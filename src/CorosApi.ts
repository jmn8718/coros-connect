import appRoot from 'app-root-path';
import ky from 'ky';
import dayjs from 'dayjs';
import { createHash } from 'crypto';

import { ActivitiesResponse, CorosCredentials, LoginResponse } from './types';

let config: CorosCredentials | undefined = undefined;

const API_URL = 'https://teamapi.coros.com';

try {
  config = appRoot.require('/coros.config.json');
} catch (e) {
  // Do nothing
}

export default class CorosApi {
  private _credentials: CorosCredentials;
  private _accessToken?: string;

  constructor(credentials: CorosCredentials | undefined = config) {
    if (!credentials) {
      throw new Error('Missing credentials');
    }
    this._credentials = credentials;
  }

  async login() {
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
}
