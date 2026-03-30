import { Injectable } from '@nestjs/common';
import { ensureDir, writeFile } from 'fs-extra';
import { FileResponse } from './file.interface';
import { path } from 'app-root-path';

@Injectable()
export class FileService {
  async saveFiles(files: Express.Multer.File[], folder: string = 'products') {
    const uploadedFolder = `${path}/uploads/${folder}`;
    await ensureDir(uploadedFolder);

    const response: FileResponse[] = await Promise.all(
      files.map(async (file) => {
        const originalName = `${Date.now()}-${file.originalname}`;
        await writeFile(`${uploadedFolder}/${originalName}`, file.buffer);
        return {
          url: `/uploads/${folder}/${originalName}`,
          name: originalName,
        };
      }),
    );
    return response;
  }
}
