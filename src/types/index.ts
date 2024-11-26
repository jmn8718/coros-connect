export interface CorosCredentials {
  email: string;
  password: string;
}

interface CorosCommonResponse {
  message: 'OK' | string;
  result: '0000' | string;
  apiCode: string;
}

// there are more fields on the response
interface UserResponse {
  userId: string;
  nickname: string;
  email: string;
  headPic: string;
  countryCode: string;
  // YYYYMMDD as a number
  birthday: number;
}

export type LoginResponse = {
  data: {
    accessToken: string;
  } & UserResponse;
} & CorosCommonResponse;

// there are more fields on the response
interface Activity {
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
    totalPage: number;
    pageNumber: number;
    dataList: Activity[];
  };
} & CorosCommonResponse;
