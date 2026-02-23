import { ActivityData } from './activity';
import { FileType, ResponseCodes } from './enums';
export * from './enums';
export interface CorosCredentials {
  email: string;
  password: string;
}

export type FileTypeKey = keyof typeof FileType;

export interface CorosCommonResponse {
  message: 'OK' | string;
  result: ResponseCodes.Success | string;
  apiCode: string;
}

// there are more fields on the response
export interface UserResponse {
  userId: string;
  nickname: string;
  email: string;
  headPic: string;
  countryCode: string;
  // YYYYMMDD as a number
  birthday: number;
}

export type LoginResponse = CorosCommonResponse & {
  data: {
    accessToken: string;
  } & UserResponse;
  result: ResponseCodes.Success;
};

export type LoginErrorResponse = CorosCommonResponse & {
  tlogId: string;
  result: ResponseCodes.LoginError;
};

// there are more fields on the response
export interface Activity {
  // format 20241130
  date: number;
  device: string;
  distance: number;
  imageUrl: string;
  endTime: number;
  endTimezone: number;
  labelId: string;
  name: string;
  sportType: number;
  total: number;
  startTime: number;
  startTimezone: number;
  totalTime: number;
  trainingLoad: number;
  unitType: number;
  workoutTime: number;
}

export type ActivitiesResponse = {
  data: {
    count: number;
    totalPage?: number;
    pageNumber?: number;
    dataList?: Activity[];
  };
} & CorosCommonResponse;

export type ActivityResponse = {
  data: ActivityData;
} & CorosCommonResponse;

export type ActivityDownloadResponse = {
  data: {
    fileUrl: string;
  };
} & CorosCommonResponse;

interface ActivityUploadData {
  createTime: string;
  // if there is an error on the upload, this property exists
  errorSize?: number;
  fileUrl: string;
  finishSize: number;
  id: string;
  idString: string;
  md5: string;
  originalFilename: string;
  size: number;
  source: number;
  status: number;
  taskImportPredicateSeconds: number;
  taskImportRemainSeconds: number;
  timezone: number;
  unzipPredicateSeconds: number;
  updateTime: string;
  userId: string;
}

export type ActivityUploadResponse = {
  data: ActivityUploadData;
} & CorosCommonResponse;

export type UploadGetListResponse = {
  data: ActivityUploadData[];
} & CorosCommonResponse;

export type UploadRemoveFromListResponse = {
  data: Omit<
    ActivityUploadData,
    'idString' | 'taskImportPredicateSeconds' | 'taskImportRemainSeconds' | 'unzipPredicateSeconds'
  >[];
} & CorosCommonResponse;

export type BucketCredentialsResponse = {
  data: {
    credentials: string;
    v: '2';
  };
} & CorosCommonResponse;

export type BucketDataResponse = {
  AccessKeyId: string;
  SecretAccessKey: string;
  SessionToken: string;
  Expiration: string;
  TokenExpireTime: number;
  Region: string;
  Bucket: string;
  SessionName: string;
  AccessKeySecret: string;
};

export type STSConfig = {
  env: string;
  bucket: string;
  service: 'aws' | 'aliyun';
};
