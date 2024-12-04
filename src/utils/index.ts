import ky from 'ky';
import { createWriteStream, existsSync, lstatSync, mkdirSync, writeFileSync } from 'node:fs';
import { Readable } from 'node:stream';

export async function downloadFile({
  filePath,
  fileUrl,
}: {
  fileUrl: string;
  filePath: string;
}) {
  const response = await ky.get(fileUrl);
  if (response.ok && response.body) {
    Readable.fromWeb(response.body).pipe(createWriteStream(filePath));
  } else {
    throw new Error('Error downloading the file');
  }
}

export const isFile = (path: string) => existsSync(path) && lstatSync(path).isFile();

export const isDirectory = (directoryPath: string) =>
  existsSync(directoryPath) && lstatSync(directoryPath).isDirectory();

export const createDirectory = (directoryPath: string) => mkdirSync(directoryPath);

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const writeToFile = (filePath: string, data: any) =>
  writeFileSync(filePath, data, {
    encoding: 'utf-8',
  });
