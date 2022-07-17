import { Module } from '@nestjs/common';
import { BookCategoryService } from './book-category.service';
import { BookCategoryResolver } from './book-category.resolver';

@Module({
  providers: [BookCategoryResolver, BookCategoryService]
})
export class BookCategoryModule {}
