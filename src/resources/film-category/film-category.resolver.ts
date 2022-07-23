import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateFilmCategoryInput } from 'src/generator';
import { Exception } from 'src/utils';
import { FilmCategoryService } from './film-category.service';

@Resolver('FilmCategory')
export class FilmCategoryResolver {
  constructor(private readonly filmCategoryService: FilmCategoryService) {}
  @Mutation('createFilmCategory')
  async createFilmCategory(
    @Args('data')
    data: CreateFilmCategoryInput,
  ) {
    try {
      const bookCategory = await this.filmCategoryService.createFilmCategory({
        name: data.name,
      });
      return true;
    } catch (error) {
      Exception.handle(error);
    }
  }
}
