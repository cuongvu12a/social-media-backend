import { Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';

import { PrismaService } from 'src/prisma/prisma.service';
import { UploadFileResponse } from 'src/generator';
import { UPLOADS_FOLDER } from 'src/constants';
import { Exception, ERROR } from 'src/utils';
@Injectable()
export class UploadService {
  constructor(private prisma: PrismaService) {}

  readFile: (file: FileUpload) => Promise<UploadFileResponse> = async (
    file,
  ) => {
    const { filename, createReadStream, mimetype } = await file;

    const path = `${UPLOADS_FOLDER}/${Date.now()}-${filename}`;
    const saveFile: boolean = await new Promise(async (resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(path))
        .on('finish', () => resolve(true))
        .on('error', (err) => reject(err)),
    );
    if (!saveFile) throw new Exception(ERROR.UPLOAD_FILE_ERROR);

    return {
      filename: path,
      mimetype,
    };
  };
}
