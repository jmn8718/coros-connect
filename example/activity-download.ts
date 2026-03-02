import { CorosApi, downloadFile, isDirectory, STSConfigs } from 'coros-connect';
import path from 'node:path';

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
    size: 1,
    page: 1,
  });

  if (activitiesData.dataList) {
    const activity = activitiesData.dataList[0];

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
  // upload activity
  const downloadFilePath = './my_activity_file.tcx';
  await coros.uploadActivityFile(downloadFilePath, userId);
}

run();