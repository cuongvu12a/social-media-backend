import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileCategory } from '@prisma/client';
import { CreateAuthorInput } from 'src/generator';
import { Exception } from 'src/utils';
import { AuthorService } from './author.service';

@Resolver('Author')
export class AuthorResolver {
  constructor(private readonly authorService: AuthorService) {}

  @Mutation('createAuthor')
  async createAuthor(
    @Args('data')
    data: CreateAuthorInput,
  ): Promise<boolean> {
    try {
      const author = await this.authorService.createAuthor(
        { name: data.name },
        {
          fileCategory: FileCategory.MAIN_PHOTO,
          filename: data.avatar.filename,
          mimetype: data.avatar.mimetype,
        },
      );

      return true;
    } catch (error) {
      Exception.handle(error);
    }
  }
}
