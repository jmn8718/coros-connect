import appRoot from 'app-root-path';
import ky from 'ky';
import dayjs from 'dayjs';
import axios from 'axios';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import {
  ActivitiesResponse,
  ActivityDownloadResponse,
  ActivityResponse,
  ActivityUploadResponse,
  BucketCredentialsResponse,
  BucketDataResponse,
  CorosCommonResponse,
  CorosCredentials,
  FileType,
  FileTypeKey,
  LoginResponse,
  ActivityComment,
  ListCommentsResponse,
  ResponseCodes,
  SportTypes,
  STSConfig,
  UploadGetListResponse,
  UploadRemoveFromListResponse,
} from './types';
import { isDirectory, isFile, createDirectory, writeToFile, getFileExtension, getFileName } from './utils';
import { calculateMd5, zip } from './utils/compress';
import { uploadToS3 } from './utils/s3';
import { API_URL, EU_API_URL, FAQ_API_URL, salt, STSConfigs } from './config';

let config: CorosCredentials | undefined = undefined;

try {
  config = appRoot.require('/coros.config.json');
} catch (e) {
  // Do nothing
}

const TOKEN_FILE = 'token.txt';

export default class CorosApi {
  private _credentials: CorosCredentials;
  private _accessToken?: string;
  private _userId?: string;

  private _apiUrl: string = API_URL;
  private _faqApiUrl: string = FAQ_API_URL;
  private _salt: string = salt;
  private _stsConfig: STSConfig = STSConfigs.EN;
  private _sign = 'E34EF0E34A498A54A9C3EAEFC12B7CAF';
  private _appId = '1660188068672619112';

  constructor(credentials: CorosCredentials | undefined = config) {
    if (!credentials) {
      throw new Error('Missing credentials');
    }
    this._credentials = credentials || {
      email: '',
      password: '',
    };
  }

  config(
    config: {
      apiUrl?: string;
      appId?: string;
      sign?: string;
      salt?: string;
      faqApiUrl?: string;
      stsConfig?: STSConfig;
    } = {},
  ) {
    if (config.stsConfig) {
		  if (config.stsConfig.service === "aliyun") throw new Error("Provider not implemented");
		  this._stsConfig = config.stsConfig;
		  if (config.stsConfig === STSConfigs.EU) {
			  this._apiUrl = EU_API_URL;
		  }
	  }
    if (config.apiUrl) this._apiUrl = config.apiUrl;
    if (config.appId) this._appId = config.appId;
    if (config.salt) this._salt = config.salt;
    if (config.sign) this._sign = config.sign;
    if (config.faqApiUrl) this._faqApiUrl = config.faqApiUrl;
  }

  updateCredentials(credentials: CorosCredentials) {
    this._credentials = credentials;
  }

  exportTokenToFile(directoryPath: string) {
    if (!isDirectory(directoryPath)) {
      createDirectory(directoryPath);
    }
    // Save both token and userId as JSON
    const data = JSON.stringify({ accessToken: this._accessToken, userId: this._userId });
    writeToFile(path.join(directoryPath, TOKEN_FILE), data);
  }

  loadTokenByFile(directoryPath: string): void {
    if (!isDirectory(directoryPath)) {
      throw new Error(`loadTokenByFile: Directory not found: ${directoryPath}`);
    }
    const filePath = path.join(directoryPath, TOKEN_FILE);
    if (!isFile(filePath)) {
      throw new Error(`loadTokenByFile: File not found: ${filePath}`);
    }
    const fileContent = readFileSync(filePath, {
      encoding: 'utf-8',
    });
    // Try to parse as JSON (new format), fall back to plain token (old format)
    try {
      const data = JSON.parse(fileContent);
      this._accessToken = data.accessToken;
      this._userId = data.userId;
    } catch {
      // Legacy format: plain token string
      this._accessToken = fileContent;
    }
  }

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    if (this._accessToken) {
      headers.accessToken = this._accessToken;
    }
    if (this._userId) {
      headers.yfheader = JSON.stringify({ userId: this._userId });
    }
    return headers;
  }

  private validateApiResponse<T extends CorosCommonResponse>(response: T): T {
    if (response.result !== ResponseCodes.Success) {
      throw new Error(`Coros API error: ${response.message} (code: ${response.result})`);
    }
    return response;
  }

  private async requestApi<T extends CorosCommonResponse>({
    path,
    method = 'get',
    searchParams,
    json,
    prefixUrl = this._apiUrl,
    authenticated = false,
  }: {
    path: string;
    method?: 'get' | 'post';
    searchParams?: URLSearchParams | Record<string, string | number>;
    json?: unknown;
    prefixUrl?: string;
    authenticated?: boolean;
  }): Promise<T> {
    if (authenticated && !this._accessToken) {
      throw new Error('Not logged in');
    }

    const headers = authenticated ? this.getAuthHeaders() : undefined;
    const response =
      method === 'post'
        ? await ky
            .post<T>(path, {
              prefixUrl,
              headers,
              searchParams,
              json,
            })
            .json()
        : await ky
            .get<T>(path, {
              prefixUrl,
              headers,
              searchParams,
            })
            .json();

    return this.validateApiResponse(response);
  }

  async login(email?: string, password?: string) {
    if ((!email && !this._credentials.email) || (!password && !this._credentials.password)) {
      throw new Error('Missing credentials');
    }
    if (email) {
      this._credentials.email = email;
    }
    if (password) {
      this._credentials.password = password;
    }
    const response = await this.requestApi<LoginResponse>({
      path: 'account/login',
      method: 'post',
      json: {
        account: this._credentials.email,
        accountType: 2,
        pwd: createHash('md5').update(this._credentials.password).digest('hex'),
      },
    });

    const { accessToken, userId, ...rest } = response.data;
    this._accessToken = accessToken;
    this._userId = userId;
    return { userId, ...rest };
  }

  public async getAccount() {
    const response = await this.requestApi<LoginResponse>({
      path: 'account/query',
      authenticated: true,
    });

    return response.data;
  }

  public async getActivitiesList({
    page = 1,
    size = 20,
    from,
    to,
  }: {
    page?: number;
    size?: number;
    from?: Date;
    to?: Date;
  }): Promise<ActivitiesResponse['data']> {
    const searchParams = new URLSearchParams({
      size: String(size),
      pageNumber: String(page),
    });
    if (from) {
      // add "from" to searchParams
      searchParams.append('startDay', dayjs(from).format('YYYYMMDD'));
    }
    if (to) {
      // add "to" to searchParams
      searchParams.append('endDay', dayjs(to).format('YYYYMMDD'));
    }
    const response = await this.requestApi<ActivitiesResponse>({
      path: 'activity/query',
      searchParams,
      authenticated: true,
    });

    return response.data;
  }

  // this method fetches more data than activity but there is no other known option
  public async getActivityDetails(
    activityId: string,
    sportType: SportTypes | string = SportTypes.Running,
  ): Promise<ActivityResponse['data']> {
    const response = await this.requestApi<ActivityResponse>({
      path: 'activity/detail/query',
      method: 'post',
      searchParams: new URLSearchParams({
        // screenW: '1095',
        // screenH: '797',
        labelId: activityId,
        sportType,
      }),
      authenticated: true,
    });

    return response.data;
  }

  public async getActivityDownloadFile({
    activityId,
    fileType,
    sportType = SportTypes.Running,
  }: { activityId: string; fileType: FileTypeKey; sportType?: SportTypes | string }) {
    const response = await this.requestApi<ActivityDownloadResponse>({
      path: 'activity/detail/download',
      method: 'post',
      searchParams: new URLSearchParams({
        labelId: activityId,
        sportType,
        fileType: FileType[fileType],
      }),
      authenticated: true,
    });

    return response.data.fileUrl;
  }

  private async getBucketData() {
    const result = await this.requestApi<BucketCredentialsResponse>({
      path: 'openapi/oss/sts',
      searchParams: {
        bucket: this._stsConfig.bucket,
        service: this._stsConfig.service,
        v: 2,
        app_id: this._appId,
        sign: this._sign,
      },
      prefixUrl: this._faqApiUrl,
    });

    return JSON.parse(atob(result.data.credentials.replace(this._salt, ''))) as BucketDataResponse;
  }

  public async removeFromImportList(importId: string) {
    const response = await this.requestApi<UploadRemoveFromListResponse>({
      path: 'activity/fit/deleteSportImport',
      method: 'post',
      json: {
        importId,
      },
      authenticated: true,
    });
    return response;
  }

  public async getImportList() {
    const response = await this.requestApi<UploadGetListResponse>({
      path: 'activity/fit/getImportSportList',
      method: 'post',
      json: {
        size: 10,
      },
      authenticated: true,
    });
    return response;
  }

  public async uploadActivityFile(filePath: string, userId: string) {
    if (!this._accessToken) {
      throw new Error('Not logged in');
    }
    const bucketData = await this.getBucketData();
    const fileExtension = getFileExtension(filePath);
    if (fileExtension !== 'fit' && fileExtension !== 'tcx') {
      throw new Error('Only .fit or .tcx files supported');
    }
    const filename = getFileName(filePath);
    const originalFilename = `${filename}.${fileExtension}`;
    const md5 = calculateMd5(filePath);
    const data = await zip(filePath, `${md5}/${originalFilename}`);
    // coros uses the md5 of the activity file to identify the zip file
    const remoteFilename = `fit_zip/${userId}/${md5}.zip`;
    await uploadToS3(remoteFilename, data, bucketData);
    const uploadedFileSize = data.buffer.byteLength; // 1008540 real // 1008204 web

    const body = {
      source: 1,
      timezone: (-new Date().getTimezoneOffset() / 60) * 4,
      bucket: bucketData.Bucket,
      md5,
      size: uploadedFileSize,
      object: remoteFilename,
      serviceName: this._stsConfig.service,
      oriFileName: originalFilename,
    };
    const formData = new FormData();
    formData.append('jsonParameter', JSON.stringify(body));

    // use axios because it does not work with other packages
    return axios
      .request<ActivityUploadResponse>({
        url: '/activity/fit/import',
        method: 'post',
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60 * 1000,
        data: formData,
        baseURL: this._apiUrl,
      })
      .then((res) => this.validateApiResponse(res.data));
  }

  public deleteActivity(activityId: string) {
    return this.requestApi<CorosCommonResponse>({
      path: 'activity/delete',
      searchParams: new URLSearchParams({
        labelId: activityId,
      }),
      authenticated: true,
    });
  }

  public updateActivityName({ labelId, name }: { labelId: string; name: string }) {
    return this.requestApi<CorosCommonResponse>({
      path: 'activity/update',
      method: 'post',
      json: {
        labelId,
        name,
        type: 1,
      },
      authenticated: true,
    });
  }

  public updateActivityPerception({
    labelId,
    feelType,
    sportNote,
  }: {
    labelId: string;
    feelType: 1 | 2 | 3 | 4 | 5;
    sportNote: string;
  }) {
    if (feelType < 1 || feelType > 5) {
      throw new Error('feelType must be between 1 and 5');
    }

    return this.requestApi<CorosCommonResponse>({
      path: 'activity/update',
      method: 'post',
      json: {
        labelId,
        feelType,
        sportNote,
      },
      authenticated: true,
    });
  }

  public addComment({ dataId, content }: { dataId: string; content: string }) {
    return this.requestApi<CorosCommonResponse>({
      path: 'leavingmessage/add',
      method: 'post',
      json: {
        type: 1,
        dataId,
        content,
        messageType: 1,
      },
      authenticated: true,
    });
  }

  public removeComment(commentId: string) {
    return this.requestApi<CorosCommonResponse>({
      path: 'leavingmessage/delete',
      method: 'post',
      json: [commentId],
      authenticated: true,
    });
  }

  public listComments(activityId: string): Promise<ActivityComment[]> {
    return this.requestApi<ListCommentsResponse>({
      path: 'leavingmessage/list',
      searchParams: new URLSearchParams({
        dataId: activityId,
        type: '1',
      }),
      authenticated: true,
    }).then((response) => response.data || []);
  }
}
