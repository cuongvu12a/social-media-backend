import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileCategory } from '@prisma/client';
import { CreateCasterInput } from 'src/generator';
import { Exception } from 'src/utils';
import { CasterService } from './caster.service';

@Resolver('Caster')
export class CasterResolver {
  constructor(private readonly casterService: CasterService) {}

  @Mutation('createCaster')
  async createCaster(
    @Args('data')
    data: CreateCasterInput,
  ): Promise<boolean> {
    try {
      const author = await this.casterService.createCaster(
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
