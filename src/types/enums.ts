export enum SportTypes {
  RunAll = '100,101,102,103',
  Running = '100',
  IndoorRunning = '101',
  TrailRunning = '102',
  TrackRunning = '103',
  Hike = '104',
  Walk = '900',
  BikeAll = '200,299,201,202,203,204,205',
  RoadBike = '200',
  RoadBike_2 = '299',
  IndoorBike = '201',
  MountainBike = '202',
  PoolSwim = '300',
  OpenWaterSwim = '301',
  GymCardio = '400',
  GpsCardio = '401',
  Strength = '402',
}

export enum FileType {
  fit = '4',
  tcx = '3',
  gpx = '1',
  kml = '2',
  csv = '0',
}

export enum ResponseCodes {
  Success = '0000',
  LoginError = '1030',
}
