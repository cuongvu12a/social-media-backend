import { Module } from '@nestjs/common';
import { FilmResolver } from './film.resolver';

@Module({
  providers: [FilmResolver]
})
export class FilmModule {}
