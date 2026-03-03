import type { STSConfig } from './types';

export const STSConfigs: Record<'EN' | 'CN' | 'EU', STSConfig> = {
  EN: {
    env: 'en.prod',
    bucket: 'coros-s3',
    service: 'aws',
  },
  CN: {
    env: 'cn.prod',
    bucket: 'coros-oss',
    service: 'aliyun',
  },
  EU: {
    env: 'eu.prod',
    bucket: 'eu-coros',
    service: 'aws',
  },
};

// this value is hardcoded on the webapp file stsUpload.js
export const salt = '9y78gpoERW4lBNYL';

export const API_URL = 'https://teamapi.coros.com';

export const EU_API_URL = 'https://teameuapi.coros.com';

export const FAQ_API_URL = 'https://faq.coros.com';

export const SIGN = 'E34EF0E34A498A54A9C3EAEFC12B7CAF';

export const APP_ID = '1660188068672619112';

export const EU_SIGN = '877571111A1EE5316E4B590103D4B5B3';
