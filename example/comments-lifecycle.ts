import { CorosApi, isDirectory, STSConfigs } from 'coros-connect';

async function run() {
  const coros = new CorosApi();

  coros.config({
    stsConfig: STSConfigs.EN,
  });

  const tokenFolder = 'any.folder';

  let userId: string;
  if (isDirectory(tokenFolder)) {
    coros.loadTokenByFile(tokenFolder);
    const user = await coros.getAccount();
    userId = user.userId;
  } else {
    const user = await coros.login();
    coros.exportTokenToFile(tokenFolder);
    userId = user.userId;
  }

  const activitiesData = await coros.getActivitiesList({
    size: 1,
    page: 1,
  });
  const latestActivity = activitiesData.dataList?.[0];
  if (!latestActivity) {
    throw new Error('No activity found');
  }

  const activityId = latestActivity.labelId;
  const initialComments = await coros.listComments(activityId);
  console.log(`Initial comments: ${initialComments.length}`);

  const content = `Comment lifecycle test ${Date.now()}`;
  await coros.addComment({
    dataId: activityId,
    content,
  });

  const commentsAfterAdd = await coros.listComments(activityId);
  const addedComment = commentsAfterAdd.find(
    (comment) => comment.content === content && comment.userInfo.userId === userId,
  );
  if (!addedComment) {
    throw new Error('Could not find the newly added comment');
  }
  console.log(`Added comment id: ${addedComment.id}`);

  await coros.removeComment(addedComment.id);

  const commentsAfterDelete = await coros.listComments(activityId);
  const stillExists = commentsAfterDelete.some((comment) => comment.id === addedComment.id);
  if (stillExists) {
    throw new Error('Comment was not deleted');
  }
  console.log('Comment deleted successfully');
}

run();
