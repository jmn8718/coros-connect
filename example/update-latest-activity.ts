import { CorosApi, isDirectory, STSConfigs } from 'coros-connect';

async function run() {
  const coros = new CorosApi();

  coros.config({
    stsConfig: STSConfigs.EN,
  });

  const tokenFolder = 'any.folder';

  if (isDirectory(tokenFolder)) {
    coros.loadTokenByFile(tokenFolder);
    await coros.getAccount();
  } else {
    await coros.login();
    coros.exportTokenToFile(tokenFolder);
  }

  const activitiesData = await coros.getActivitiesList({
    size: 1,
    page: 1,
  });

  const latestActivity = activitiesData.dataList?.[0];
  if (!latestActivity) {
    throw new Error('No activity found');
  }

  const { labelId } = latestActivity;
  const originalName = latestActivity.name;
  const temporaryName = `${originalName} (updated)`;

  await coros.updateActivityName({
    labelId,
    name: temporaryName,
  });

  try {
    const refreshed = await coros.getActivitiesList({
      size: 1,
      page: 1,
    });
    const refreshedActivity = refreshed.dataList?.find((activity) => activity.labelId === labelId);
    if (!refreshedActivity) {
      throw new Error(`Updated activity not found: ${labelId}`);
    }
    if (refreshedActivity.name !== temporaryName) {
      throw new Error(`Activity title did not update. Expected "${temporaryName}", got "${refreshedActivity.name}"`);
    }
  } finally {
    await coros.updateActivityName({
      labelId,
      name: originalName,
    });
  }
}

run();
