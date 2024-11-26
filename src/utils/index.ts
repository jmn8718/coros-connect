import ky from 'ky';
import { createWriteStream } from 'node:fs';
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
