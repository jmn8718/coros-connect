import { CorosApi } from 'coros-connect';

async function run() {
  console.log('run');
  const coros = new CorosApi();

  await coros.login();
  const activitiesData = await coros.getActivitiesList({
    size: 3,
    page: 1,
  });
  console.log(activitiesData.dataList[0]);
}

run();