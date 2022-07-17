import { Injectable } from '@nestjs/common';
import { BookCategory, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookCategoryService {
  constructor(private prisma: PrismaService) {}

  createBookCategory: (
    data: Prisma.BookCategoryCreateInput,
  ) => Promise<BookCategory> = (data) =>
    this.prisma.bookCategory.create({
      data,
    });
}
