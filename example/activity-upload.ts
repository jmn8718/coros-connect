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

  // upload activity
  const downloadFilePath = './my_activity_file.tcx';
  await coros.uploadActivityFile(downloadFilePath, userId);
}

run();