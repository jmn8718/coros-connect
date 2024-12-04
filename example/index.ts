import { CorosApi, downloadFile, isDirectory } from 'coros-connect';
import path from 'node:path';

async function run() {
  console.log('run');
  const coros = new CorosApi();

  const tokenFolder = 'any.folder'

  if (isDirectory(tokenFolder)) {
    console.log('loading token from file');
    coros.loadTokenByFile(tokenFolder);
  } else {
    await coros.login();
    console.log('exporting token to file');
    coros.exportTokenToFile(tokenFolder);
  }

  const activitiesData = await coros.getActivitiesList({
    size: 3,
    page: 1,
  });
  const activity = activitiesData.dataList[0];

  if (activitiesData.dataList) {
    // get activity details by activity Id
    // same data as it is fetched from getActivitiesList
    const activityData = await coros.getActivityDetails(activity.labelId);
    
    // get file url to download
    const fileUrl = await coros.getActivityDownloadFile({
      activityId: activity.labelId,
      fileType: 'fit',
    });
    // example of file url https://s3.coros.com/fit/XXX/YYY.fit
  
    // download file to disk, you can use any other way you want
    await downloadFile({
      fileUrl,
      filePath: path.join('.', `_${activity.labelId}.fit`),
    });
  }
}

run();