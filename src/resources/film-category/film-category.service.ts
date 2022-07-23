import { Injectable } from '@nestjs/common';
import { FilmCategory, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FilmCategoryService {
  constructor(private prisma: PrismaService) {}

  createFilmCategory: (
    data: Prisma.FilmCategoryCreateInput,
  ) => Promise<FilmCategory> = (data) =>
    this.prisma.filmCategory.create({
      data,
    });
}
