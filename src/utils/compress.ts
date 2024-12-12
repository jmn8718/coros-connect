import JSZip from 'jszip';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

export const zip = (filePath: string, filename: string): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    const data = readFileSync(filePath);
    const zip = new JSZip();
    zip.file(filename, data, { createFolders: true });
    return zip
      .generateAsync({ type: 'blob' })
      .then((content) => content.arrayBuffer())
      .then((content) => resolve(Buffer.from(content)))
      .catch(reject);
  });

export function calculateMd5(filePath: string) {
  const file = readFileSync(filePath);
  return createHash('md5').update(file).digest('hex');
}
