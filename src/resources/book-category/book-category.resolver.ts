import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateBookCategoryInput } from 'src/generator';
import { Exception } from 'src/utils';
import { BookCategoryService } from './book-category.service';

@Resolver('BookCategory')
export class BookCategoryResolver {
  constructor(private readonly bookCategoryService: BookCategoryService) {}

  @Mutation('createBookCategory')
  async createBookCategory(
    @Args('data')
    data: CreateBookCategoryInput,
  ) {
    try {
      const bookCategory = await this.bookCategoryService.createBookCategory({
        name: data.name,
      });
      return true;
    } catch (error) {
      Exception.handle(error);
    }
  }
}
