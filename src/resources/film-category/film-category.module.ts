import { Module } from '@nestjs/common';
import { FilmCategoryService } from './film-category.service';
import { FilmCategoryResolver } from './film-category.resolver';

@Module({
  providers: [FilmCategoryResolver, FilmCategoryService]
})
export class FilmCategoryModule {}
