import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FileCategory as PrismaFileCategory, Prisma } from '@prisma/client';
import {
  BookForGetListBookResponse,
  CreateBookInput,
  FileCategory,
  GetBookByIdResponse,
  GetListBookCondition,
  GetListBookOrderBy,
  GetListBookResponse,
  OrderByType,
  PaginationInput,
} from 'src/generator';
import { PrismaService } from 'src/prisma/prisma.service';
import { buildQueryPagination, ERROR, Exception } from 'src/utils';
import { BookService } from './book.service';

@Resolver('Book')
export class BookResolver {
  constructor(
    private readonly bookService: BookService,
    private prisma: PrismaService,
  ) {}

  @Query('getListBook')
  async getListBook(
    @Args('pagination') pagination: PaginationInput,
    @Args('condition') condition: GetListBookCondition,
  ): Promise<GetListBookResponse> {
    try {
      const { skip, take, page, size } = buildQueryPagination(pagination);
      const where = buildQueryFilters(condition);
      const orderBy = buildQuerySorting(condition);

      const [books, totalData] = await Promise.all([
        this.bookService.findBooks({ skip, take, where, orderBy }),
        this.bookService.countBook({ where }),
      ]);

      const responseBooks: BookForGetListBookResponse[] = books.map((book) => {
        const thumbnail = book.file.find(
          (file) => file.fileCategory === PrismaFileCategory.THUMBNAIL_BOOK,
        );

        return {
          id: book.id,
          identityNumber: book.identityNumber,
          author: {
            id: book.author?.id,
            name: book.author?.name,
          },
          category: {
            id: book.bookCategory.id,
            name: book.bookCategory.name,
          },
          title: book.title,
          publisher: {
            id: book.publisher?.id,
            name: book.publisher?.name,
          },
          releaseAt: book.releaseAt,
          thumbnail: !thumbnail
            ? null
            : {
                id: thumbnail?.id,
                fileCategory: thumbnail?.fileCategory as FileCategory,
                filename: thumbnail?.filename,
                mimetype: thumbnail?.mimetype,
              },
        };
      });

      return {
        data: responseBooks,
        pagination: {
          page,
          size,
          totalData,
        },
      };
    } catch (error) {
      throw error;
      Exception.handle(error);
    }
  }

  @Query('getBookById')
  async getBookById(
    @Args('bookId') bookId: string,
  ): Promise<GetBookByIdResponse> {
    try {
      const book = await this.bookService.findBook(bookId);

      if (!book) {
        throw new Exception(ERROR.BOOK_NOT_FOUND);
      }

      const thumbnail = book.file.find(
        (file) => file.fileCategory === PrismaFileCategory.THUMBNAIL_BOOK,
      );

      const ebook = book.file.find(
        (file) => file.fileCategory === PrismaFileCategory.EBOOK,
      );

      const responseBook: GetBookByIdResponse = {
        id: book.id,
        identityNumber: book.identityNumber,
        author: {
          id: book.author?.id,
          name: book.author?.name,
        },
        category: {
          id: book.bookCategory.id,
          name: book.bookCategory.name,
        },
        title: book.title,
        publisher: {
          id: book.publisher?.id,
          name: book.publisher?.name,
        },
        releaseAt: book.releaseAt,
        thumbnail: {
          id: thumbnail?.id,
          fileCategory: thumbnail?.fileCategory as FileCategory,
          filename: thumbnail?.filename,
          mimetype: thumbnail?.mimetype,
        },
        content: book.content,
        numberOfPages: book.numberOfPages,
        ebook: {
          id: ebook?.id,
          fileCategory: ebook?.fileCategory as FileCategory,
          filename: ebook?.filename,
          mimetype: ebook?.mimetype,
        },
      };

      return responseBook;
    } catch (error) {
      Exception.handle(error);
    }
  }

  @Mutation('createBook')
  async createBook(
    @Args('data')
    data: CreateBookInput,
  ) {
    try {
      const { authorId, categoryId, publishId, thumbnail, ebook } = data;

      if (!authorId) {
        const author = await this.prisma.author.findFirst({
          where: {
            id: authorId,
          },
        });
        if (!!author) throw new Exception(ERROR.AUTHOR_NOT_FOUND);
      }
      if (!categoryId) {
        const bookCategory = await this.prisma.bookCategory.findFirst({
          where: {
            id: categoryId,
          },
        });
        if (!!bookCategory) throw new Exception(ERROR.BOOK_CATEGORY_NOT_FOUND);
      }
      if (!publishId) {
        const publisher = await this.prisma.publisher.findFirst({
          where: {
            id: publishId,
          },
        });
        if (!!publisher) throw new Exception(ERROR.PUBLISHER_NOT_FOUND);
      }
      const identityNumber = await this.bookService.makeBookIdentityNumber();

      const response = await this.bookService.createBook({
        data: {
          identityNumber: identityNumber,
          title: data.title,
          content: data.content,
          numberOfPages: data.numberOfPages,
          releaseAt: data.releaseAt,
          author: {
            connect: {
              id: authorId,
            },
          },
          bookCategory: {
            connect: {
              id: categoryId,
            },
          },
          publisher: {
            connect: {
              id: publishId,
            },
          },
        },
        thumbnail: !thumbnail
          ? null
          : {
              filename: thumbnail?.filename,
              mimetype: thumbnail?.mimetype,
              fileCategory: thumbnail?.fileCategory,
            },
        ebook: !ebook
          ? null
          : {
              filename: ebook?.filename,
              mimetype: ebook?.mimetype,
              fileCategory: ebook?.fileCategory,
            },
      });
      return response;
    } catch (error) {
      Exception.handle(error);
    }
  }
}

const buildQueryFilters = (
  condition: GetListBookCondition,
): Prisma.BookWhereInput => {
  const { authorIds, publishIds, categoryIds, searching } = condition;
  let result: Prisma.BookWhereInput = {};

  if (!!authorIds && authorIds.length !== 0) {
    result = {
      ...result,
      authorId: {
        in: authorIds,
      },
    };
  }

  if (!!publishIds && publishIds.length !== 0) {
    result = {
      ...result,
      publishId: {
        in: publishIds,
      },
    };
  }

  if (!!categoryIds && categoryIds.length !== 0) {
    result = {
      ...result,
      bookCategoryId: {
        in: categoryIds,
      },
    };
  }

  if (!!searching) {
    result = {
      ...result,
      OR: [
        {
          title: {
            contains: searching,
          },
        },
        {
          identityNumber: searching,
        },
      ],
    };
  }

  return result;
};

const buildQuerySorting = (
  condition: GetListBookCondition,
): Prisma.Enumerable<Prisma.BookOrderByWithRelationInput> => {
  const orderBy: GetListBookOrderBy =
    condition.orderBy || GetListBookOrderBy.CREATED_AT;
  const orderType: Prisma.SortOrder =
    condition.orderType === OrderByType.ASC ? 'asc' : 'desc';

  let result: Prisma.Enumerable<Prisma.BookOrderByWithRelationInput> = {};

  switch (orderBy) {
    case GetListBookOrderBy.AUTHOR:
      result = {
        ...result,
        author: {
          name: orderType,
        },
      };
      break;
    case GetListBookOrderBy.CATEGORY:
      result = {
        ...result,
        bookCategory: {
          name: orderType,
        },
      };
      break;
    case GetListBookOrderBy.IDENTITY_NUMBER:
      result = {
        ...result,
        identityNumber: orderType,
      };
      break;
    case GetListBookOrderBy.NUMBER_OF_PAGES:
      result = {
        ...result,
        numberOfPages: orderType,
      };
      break;
    case GetListBookOrderBy.PUBLISHER:
      result = {
        ...result,
        publisher: {
          name: orderType,
        },
      };
      break;
    case GetListBookOrderBy.RELEASE_AT:
      result = {
        ...result,
        releaseAt: orderType,
      };
      break;
    case GetListBookOrderBy.TITLE:
      result = {
        ...result,
        title: orderType,
      };
      break;
    default:
      result = {
        ...result,
        createdAt: orderType,
      };
      break;
  }

  return result;
};
