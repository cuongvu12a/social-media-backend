import { Injectable } from '@nestjs/common';
import {
  FileCategory,
  Prisma,
  Book,
  File,
  BookCategory,
  Author,
  Publisher,
  PrismaClient,
} from '@prisma/client';
import e from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { makeModelIdentityNumber } from 'src/utils';

type BookResponse = Book & {
  author?: Author;
  publisher?: Publisher;
  bookCategory?: BookCategory;
  file: File[];
};

interface FindBooksParams {
  where?: Prisma.BookWhereInput;
  orderBy?: Prisma.Enumerable<Prisma.BookOrderByWithRelationInput>;
  take?: number;
  skip?: number;
}

interface CreateBookParams {
  data: Prisma.BookCreateInput | Prisma.BookUncheckedCreateInput;
  thumbnail?: Prisma.FileCreateInput;
  ebook?: Prisma.FileCreateInput;
}

type FindBooksFunc = (params: FindBooksParams) => Promise<BookResponse[]>;
type CountBookFunc = (params: FindBooksParams) => Promise<number>;
type CreateBookFunc = (params: CreateBookParams) => Promise<boolean>;

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}

  findBooks: FindBooksFunc = async ({ where, orderBy, take, skip }) => {
    const books: BookResponse[] = await this.prisma.book.findMany({
      include: {
        author: true,
        bookCategory: true,
        publisher: true,
        file: {
          where: {
            fileCategory: FileCategory.THUMBNAIL_BOOK,
          },
        },
      },
      where,
      orderBy,
      take,
      skip,
    });

    return books;
  };

  countBook: CountBookFunc = async ({ where }) =>
    this.prisma.book.count({ where });

  findBook = async (bookId: string): Promise<BookResponse> => {
    const book: BookResponse = await this.prisma.book.findFirst({
      include: {
        author: true,
        bookCategory: true,
        publisher: true,
        file: {
          where: {
            fileCategory: {
              in: [FileCategory.THUMBNAIL_BOOK, FileCategory.EBOOK],
            },
          },
        },
      },
      where: {
        deletedAt: null,
        id: bookId,
      },
    });

    return book;
  };

  createBook: CreateBookFunc = async ({ data, ebook, thumbnail }) => {
    await this.prisma.$transaction(async (prisma: PrismaClient) => {
      const book = await prisma.book.create({
        data,
      });
      
      const files: Prisma.FileCreateManyInput[] = [];
      if (!!thumbnail)
        files.push({
          ...thumbnail,
          bookId: book.id,
        });

      if (!!ebook)
        files.push({
          ...ebook,
          bookId: book.id,
        });

      await prisma.file.createMany({
        data: files,
      });
    });
    return true;
  };
  makeBookIdentityNumber: () => Promise<string> = () =>
    makeModelIdentityNumber(this.prisma, 'book');
}
