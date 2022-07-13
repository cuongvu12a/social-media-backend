import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileUpload } from 'graphql-upload';

import { UploadFileResponse } from 'src/generator';
import { UploadService } from './upload.service';
import { Exception } from 'src/utils';

@Resolver('Upload')
export class UploadResolver {
  constructor(private readonly uploadService: UploadService) {}

  @Mutation('singleUpload')
  async singleUpload(
    @Args('file')
    file: FileUpload,
  ): Promise<UploadFileResponse> {
    try {
      return await this.uploadService.readFile(file);
    } catch (err) {
      Exception.handle(err);
    }
  }

  @Mutation('multipleUpload')
  async multipleUpload(
    @Args('files')
    files: FileUpload[],
  ): Promise<UploadFileResponse[]> {
    try { 
      return await Promise.all(
        files.map((file) => this.uploadService.readFile(file)),
      );
    } catch (err) {
      Exception.handle(err);
    }
  }
}
