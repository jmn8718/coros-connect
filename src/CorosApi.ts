import appRoot from 'app-root-path';
import ky from 'ky';
import dayjs from 'dayjs';
import { createHash } from 'node:crypto';
import {
  ActivitiesResponse,
  ActivityDownloadResponse,
  ActivityResponse,
  CorosCredentials,
  FileType,
  FileTypeKey,
  LoginResponse,
} from './types';
import { isDirectory, isFile, createDirectory, writeToFile } from './utils';
import path from 'node:path';
import { readFileSync } from 'node:fs';

let config: CorosCredentials | undefined = undefined;

const API_URL = 'https://teamapi.coros.com';

try {
  config = appRoot.require('/coros.config.json');
} catch (e) {
  // Do nothing
}

const TOKEN_FILE = 'token.txt';

export default class CorosApi {
  private _credentials: CorosCredentials;
  private _accessToken?: string;

  constructor(credentials: CorosCredentials | undefined = config) {
    if (!credentials) {
      throw new Error('Missing credentials');
    }
    this._credentials = credentials || {
      email: '',
      password: '',
    };
  }

  updateCredentials(credentials: CorosCredentials) {
    this._credentials = credentials;
  }

  exportTokenToFile(directoryPath: string) {
    console.log('export');
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
    console.log(fileContent);
    this._accessToken = fileContent;
  }

  async login(email?: string, password?: string) {
    if ((!email && !this._credentials.email) || (!password && !this._credentials.password)) {
      throw new Error('Missing credentials');
    }
    if (email) {
      console.log('updating email');
      this._credentials.email = email;
    }
    if (password) {
      console.log('updating password');
      this._credentials.password = password;
    }
    const response = await ky
      .post<LoginResponse>('account/login', {
        json: {
          account: this._credentials.email,
          accountType: 2,
          pwd: createHash('md5').update(this._credentials.password).digest('hex'),
        },
        prefixUrl: API_URL,
      })
      .json();

    const { accessToken, ...rest } = response.data;
    this._accessToken = accessToken;
    return rest;
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
        prefixUrl: API_URL,
        headers: {
          accessToken: this._accessToken,
        },
        searchParams,
      })
      .json();

    return response.data;
  }

  // this method fetchs more data than activity but there is no other know option
  public async getActivityDetails(activityId: string): Promise<ActivityResponse['data']> {
    if (!this._accessToken) {
      throw new Error('Not logged in');
    }
    const response = await ky
      .post<ActivityResponse>('activity/detail/query', {
        prefixUrl: API_URL,
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
        prefixUrl: API_URL,
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
}
