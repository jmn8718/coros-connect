import { CorosApi, isDirectory, STSConfigs } from 'coros-connect';

async function run() {
  const coros = new CorosApi();

  coros.config({
    stsConfig: STSConfigs.EN
  })

  const tokenFolder = 'any.folder'

  let userId: string;
  if (isDirectory(tokenFolder)) {
    console.log('loading token from file');
    coros.loadTokenByFile(tokenFolder);
    const user = await coros.getAccount()
    userId = user.userId;
  } else {
    const user = await coros.login();
    console.log('exporting token to file');
    coros.exportTokenToFile(tokenFolder);
    userId = user.userId;
  }

  const activitiesData = await coros.getActivitiesList({
    size: 3,
    page: 1,
  });

  if (activitiesData.dataList) {
    const activity = activitiesData.dataList[0];
    // get activity details by activity Id
    // same data as it is fetched from getActivitiesList
    const activityData = await coros.getActivityDetails(activity.labelId);
    
    console.log('Activity details:', activityData);
  }
}

run();