import { PutObjectCommand, ListObjectsCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { NodeJsClient } from '@smithy/types';
import { createWriteStream } from 'node:fs';
import { BucketDataResponse } from '../types';

export const uploadToS3 = async (filename: string, data: Buffer, params: BucketDataResponse['data']) => {
  const client = new S3Client({
    region: params.Region,
    credentials: {
      sessionToken: params.SessionToken,
      accessKeyId: params.AccessKeyId,
      secretAccessKey: params.SecretAccessKey,
    },
  });
  const putCommand = new PutObjectCommand({
    Bucket: params.Bucket,
    Key: filename,
    Body: data,
    ContentType: 'application/zip',
  });
  await client.send(putCommand);

  const listCommand = new ListObjectsCommand({
    Bucket: params.Bucket,
    Prefix: filename,
  });
  const result = await client.send(listCommand);
  const uploadedFile = result.Contents?.find(({ Key }) => Key === filename);
  if (!uploadedFile) {
    throw new Error('File not uploaded');
  }
  return uploadedFile.Size;
};

export const downloadFromS3 = async (params: BucketDataResponse['data'], Key: string, filePath: string) => {
  const client = new S3Client({
    region: params.Region,
    credentials: {
      sessionToken: params.SessionToken,
      accessKeyId: params.AccessKeyId,
      secretAccessKey: params.SecretAccessKey,
    },
  }) as NodeJsClient<S3Client>;
  const getObjectCommand = new GetObjectCommand({
    Bucket: params.Bucket,
    Key,
  });
  const getCommandResult = await client.send(getObjectCommand);
  getCommandResult.Body?.pipe(createWriteStream(filePath));
};
