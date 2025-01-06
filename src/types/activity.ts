interface DeviceList {
  imageUrl: string;
  name: string;
  type: number;
  vendorId: number;
  version: string;
}

interface FrequencyList {
  adjustedPace?: number;
  distance: number;
  gpsLat: number;
  gpsLon: number;
  heart?: number;
  heartLevel?: number;
  level: number;
  levelMap?: LevelMap;
  speed?: number;
  timestamp: number;
  altitude?: number;
  slope?: number;
  cadenceLength?: number;
  cadence?: number;
  power?: number;
}

interface LevelMap {
  heartLevel: number;
  speed?: number;
  adjustedPace?: number;
  heart: number;
  altitude?: number;
  slope?: number;
  cadenceLength?: number;
  power?: number;
  cadence?: number;
}

interface GraphList {
  graphItem: GraphItem;
  key: string;
  type: number;
}

interface GraphItem {
  asc: number;
  avg: number;
  clrLocation: number[];
  count: number;
  desc: number;
  max: number;
  maxXSecond: number;
  min: number;
  orderType: number;
  sum: number;
  xScaleArr: number[];
  yScaleArr: number[];
}

interface LapList {
  fastLapIndexList: number[];
  lapDistance: number;
  lapItemList: LapItemList[];
  type: number;
}

interface LapItemList {
  actualValue?: number;
  adjustedPace: number;
  airPower?: number;
  avgCadence: number;
  avgElev: number;
  avgGrade?: number;
  avgHr: number;
  avgMoveSpeed: number;
  avgPace?: number;
  avgPower: number;
  avgSpeedV2?: number;
  avgStrideLength: number;
  avgStrokeRateLen?: number;
  avgSwolf?: number;
  bodyTemperature: number;
  calories: number;
  distance: number;
  downhillDesc: number;
  downhillDist: number;
  downhillTime: number;
  elevGain: number;
  endGpsLat?: number;
  endGpsLon?: number;
  endGpsTimestamp?: number;
  endTimestamp: number;
  exerciseId?: number;
  exerciseIndex?: number;
  exerciseNameKey?: string;
  falls: number;
  formPower?: number;
  gradingSystem: number;
  groundBalance: number;
  groundTime: number;
  hardestGrade: number;
  indexInOriginLap?: number;
  intensityType?: number;
  intensityValue?: number;
  lapIndex: number;
  lapMapMarkIsStartGps?: boolean;
  lapTrainIndex?: number;
  lapType?: number;
  legStiffness: number;
  maxActivityFall: number;
  maxCadence: number;
  maxElev: number;
  maxGrade: number;
  maxHr: number;
  maxJump: number;
  maxPower: number;
  maxSpeed: number;
  maxSwolf?: number;
  minCadence?: number;
  minElev: number;
  minHr?: number;
  minPower?: number;
  minSpeed?: number;
  minSwolf?: number;
  mode: number;
  np: number;
  numLengths?: number;
  pauseTime: number;
  programExerciseIndex?: number;
  reps: number;
  ropeAvgSpeed: number;
  ropeMaxSpeed: number;
  rowIndex?: number;
  runEfficiency?: number;
  sectionIndex?: number;
  setIndex?: number;
  sets: number;
  showRestMode?: number;
  sourceType?: number;
  speedUnit: number;
  sportType: number;
  startGpsLat?: number;
  startGpsLon?: number;
  startGpsTimestamp?: number;
  startTimestamp: number;
  strideHeight: number;
  strideRatio: number;
  strokes?: number;
  stumbleRope?: number;
  style?: number;
  swimRelationIndex?: number;
  swimStyle?: number;
  targetType?: number;
  tempc?: number;
  time: number;
  totalCadence: number;
  totalDescent: number;
  totalDistance?: number;
  totalLength: number;
  vertSpeed: number;
  waterTemperature: number;
  work: number;
  avgSpeed?: number;
}

interface SportFeelInfo {
  feelType: number;
  sportNote: string;
}

interface Summary {
  adjustedPace: number;
  aerobicEffect: number;
  aerobicEffectState: number;
  alpha500: number;
  anaerobicEffect: number;
  anaerobicEffectState: number;
  avg5x10s: number;
  avgAirPower: number;
  avgCadence: number;
  avgElev: number;
  avgFromPower: number;
  avgGrade: number;
  avgGroundBalanceLeft: number;
  avgGroundTime: number;
  avgHr: number;
  avgLegStiffness: number;
  avgMoveSpeed: number;
  avgPace: number;
  avgPower: number;
  avgPowerHori: number;
  avgPowerOrien: number;
  avgPowerVert: number;
  avgRunningEf: number;
  avgSpeed: number;
  avgStepLen: number;
  avgSwolfLen: number;
  avgVertRatio: number;
  avgVertVibration: number;
  bestKm: number;
  bestLength: number;
  bicycleIf: number;
  bodyTemperature: number;
  calories: number;
  climbingTime: number;
  combineSportMode: number;
  compareDistance: number;
  currentVo2Max: number;
  deviceSportMode: number;
  displayPerformance: number;
  distance: number;
  downhillDesc: number;
  downhillDist: number;
  downhillTime: number;
  elevGain: number;
  endTimestamp: number;
  estimation: number;
  exercises: number;
  falls: number;
  fastest100m: number;
  fastest1852m: number;
  fastest250m: number;
  fastest500m: number;
  fpRatio: number;
  gradingSystem: number;
  hardestGrade: number;
  hasProgram: number;
  hrmVo2Max: number;
  indoorRealDistance: number;
  isRunTest: number;
  isShowMs: boolean;
  lapDistance: number;
  leftPedalSmoothness: number;
  leftTorqueEffectiveness: number;
  lengths: number;
  max10sList: unknown[];
  max2s: number;
  maxActivityFall: number;
  maxCadence: number;
  maxElev: number;
  maxGrade: number;
  maxHr: number;
  maxJump: number;
  maxPower: number;
  maxSpeed: number;
  maxSwolfLen: number;
  minElev: number;
  mutliPitchStage: number;
  name: string;
  noPerformanceReason: number;
  noPerformanceReasonTip: string;
  np: number;
  pauseTime: number;
  pdrMode: boolean;
  performance: number;
  pitch: number;
  planId: number;
  programId: number;
  rdType: number;
  rightPedalSmoothness: number;
  rightTorqueEffectiveness: number;
  ropeAvgSpeed: number;
  ropeMaxSpeed: number;
  seatedTime: number;
  sets: number;
  speedType: number;
  speedUnit: number;
  sportMode: number;
  sportType: number;
  staminaLevel7d: number;
  standardRate: number;
  standingTime: number;
  startTimestamp: number;
  strydPowerCp: number;
  timezone: number;
  tiredRate: number;
  tiredRateState: number;
  totalCadence: number;
  totalDescent: number;
  totalReps: number;
  totalStumbleRope: number;
  totalTime: number;
  trainType: number;
  trainingLoad: number;
  unitType: number;
  userChangeDistance: number;
  userId: number;
  vertSpeed: number;
  waterTemperature: number;
  work: number;
  workoutTime: number;
}

interface TrackClimbInfo {
  avgSlope: number;
  climbProArr: ClimbProArr[];
  slopeLevelArr: SlopeLevelArr[];
}

interface ClimbProArr {
  avgSlope: number;
  elevGain: number;
  endDistance: number;
  endIndex: number;
  endLevelIndex: number;
  startDistance: number;
  startIndex: number;
  startLevelIndex: number;
}

interface SlopeLevelArr {
  avgSlope: number;
  endDistance: number;
  endIndex: number;
  slopeLevel: number;
  startDistance: number;
  startIndex: number;
}

interface UserInfo {
  avatar: string;
  modelValidState: boolean;
  nickname: string;
  sex: number;
  unitType: number;
  userId: string;
}

interface UserProfile {
  messageEditPermissions: boolean;
  showActivityMap: number;
}

interface Weather {
  bodyFeelTemp: number;
  fileName: string;
  humidity: number;
  imagePath: string;
  imagePathDark: string;
  provider: number;
  temperature: number;
  weatherType: number;
  windDirection: number;
  windDirectionType: number;
  windSpeed: number;
}

interface ZoneList {
  type: number;
  zoneItemList: ZoneItemList[];
  zoneType: number;
}

interface ZoneItemList {
  leftScope: number;
  percent: number;
  rightScope: number;
  second: number;
  zoneIndex: number;
}

export interface ActivityData {
  deviceList: DeviceList[];
  frequencyList: FrequencyList[];
  gpsLightDuration: unknown[];
  graphList: GraphList[];
  lapList: LapList[];
  level: number;
  newMessageCount: number;
  pauseList: unknown[];
  sportFeelInfo: SportFeelInfo;
  summary: Summary;
  trackClimbInfo: TrackClimbInfo;
  userInfo: UserInfo;
  userProfile: UserProfile;
  weather: Weather;
  zoneList: ZoneList[];
}
