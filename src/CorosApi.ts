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
  STSConfig,
  UploadGetListResponse,
  UploadRemoveFromListResponse,
} from './types';
import { isDirectory, isFile, createDirectory, writeToFile, getFileExtension, getFileName } from './utils';
import { calculateMd5, zip } from './utils/compress';
import { uploadToS3 } from './utils/s3';
import { API_URL, FAQ_API_URL, salt, STSConfigs } from './config';

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
    if (config.apiUrl) this._apiUrl = config.apiUrl;
    if (config.appId) this._appId = config.appId;
    if (config.salt) this._salt = config.salt;
    if (config.sign) this._sign = config.sign;
    if (config.faqApiUrl) this._faqApiUrl = config.faqApiUrl;
    if (config.stsConfig) {
      if (config.stsConfig.service === 'aliyun') throw new Error('Provider not implemented');
      this._stsConfig = config.stsConfig;
    }
  }

  updateCredentials(credentials: CorosCredentials) {
    this._credentials = credentials;
  }

  exportTokenToFile(directoryPath: string) {
    if (!isDirectory(directoryPath)) {
      createDirectory(directoryPath);
    }
    writeToFile(path.join(directoryPath, TOKEN_FILE), this._accessToken);
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
    this._accessToken = fileContent;
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
    const response = await ky
      .post<LoginResponse>('account/login', {
        json: {
          account: this._credentials.email,
          accountType: 2,
          pwd: createHash('md5').update(this._credentials.password).digest('hex'),
        },
        prefixUrl: this._apiUrl,
      })
      .json();

    const { accessToken, ...rest } = response.data;
    this._accessToken = accessToken;
    return rest;
  }

  public async getAccount() {
    if (!this._accessToken) {
      throw new Error('Not logged in');
    }
    const response = await ky
      .get<LoginResponse>('account/query', {
        prefixUrl: this._apiUrl,
        headers: {
          accessToken: this._accessToken,
        },
      })
      .json();

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
    if (!this._accessToken) {
      throw new Error('Not logged in');
    }
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
      searchParams.append('endDay', dayjs(from).format('YYYYMMDD'));
    }
    const response = await ky
      .get<ActivitiesResponse>('activity/query', {
        prefixUrl: this._apiUrl,
        headers: {
          accessToken: this._accessToken,
        },
        searchParams,
      })
      .json();

    return response.data;
  }

  // this method fetches more data than activity but there is no other know option
  public async getActivityDetails(activityId: string): Promise<ActivityResponse['data']> {
    if (!this._accessToken) {
      throw new Error('Not logged in');
    }
    const response = await ky
      .post<ActivityResponse>('activity/detail/query', {
        prefixUrl: this._apiUrl,
        headers: {
          accessToken: this._accessToken,
        },
        searchParams: new URLSearchParams({
          // screenW: '1095',
          // screenH: '797',
          labelId: activityId,
          sportType: '100',
        }),
      })
      .json();
    return response.data;
  }

  public async getActivityDownloadFile({ activityId, fileType }: { activityId: string; fileType: FileTypeKey }) {
    if (!this._accessToken) {
      throw new Error('Not logged in');
    }
    const response = await ky
      .post<ActivityDownloadResponse>('activity/detail/download', {
        prefixUrl: this._apiUrl,
        headers: {
          accessToken: this._accessToken,
        },
        searchParams: new URLSearchParams({
          labelId: activityId,
          sportType: '100',
          fileType: FileType[fileType],
        }),
      })
      .json();

    return response.data.fileUrl;
  }

  private async getBucketData() {
    const result = await ky
      .get<BucketCredentialsResponse>('openapi/oss/sts', {
        searchParams: {
          bucket: this._stsConfig.bucket,
          service: this._stsConfig.service,
          v: 2,
          app_id: this._appId,
          sign: this._sign,
        },
        prefixUrl: this._faqApiUrl,
      })
      .json();

    return JSON.parse(atob(result.data.credentials.replace(this._salt, ''))) as BucketDataResponse;
  }

  public async removeFromImportList(importId: string) {
    if (!this._accessToken) {
      throw new Error('Not logged in');
    }
    const response = await ky
      .post<UploadRemoveFromListResponse>('activity/fit/deleteSportImport', {
        prefixUrl: this._apiUrl,
        headers: {
          accessToken: this._accessToken,
        },
        json: {
          importId,
        },
      })
      .json();
    return response;
  }

  public async getImportList() {
    if (!this._accessToken) {
      throw new Error('Not logged in');
    }
    const response = await ky
      .post<UploadGetListResponse>('activity/fit/getImportSportList', {
        prefixUrl: this._apiUrl,
        headers: {
          accessToken: this._accessToken,
        },
        json: {
          size: 10,
        },
      })
      .json();
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
          AccessToken: this._accessToken,
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60 * 1000,
        data: formData,
        baseURL: this._apiUrl,
      })
      .then((res) => res.data);
  }

  public deleteActivity(activityId: string) {
    if (!this._accessToken) {
      throw new Error('Not logged in');
    }
    return ky
      .get<CorosCommonResponse>('activity/delete', {
        prefixUrl: this._apiUrl,
        headers: {
          accessToken: this._accessToken,
        },
        searchParams: new URLSearchParams({
          labelId: activityId,
        }),
      })
      .json();
  }
}
