import fs from 'fs';
import path from 'path';

export const deleteFile = (filePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const fullFilePath = path.join(__dirname, '..', 'public', filePath);
    fs.unlink(fullFilePath, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};
