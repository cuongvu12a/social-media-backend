import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import {
  CreatePostInput,
  GetListPostCondition,
  GetListPostOrderBy,
  ObjFileOutput,
  OrderByType,
  PaginationInput,
  PostForGetListPostResponse,
  FileCategory as GQLFileCategory,
  Author,
} from 'src/generator';
import { PrismaService } from 'src/prisma/prisma.service';
import { buildQueryPagination, Exception } from 'src/utils';
import { PostService } from './post.service';
import { makeModelIdentityNumber } from 'src/utils';
import { FileCategory, Prisma, PrismaClient } from '@prisma/client';

@Resolver('Post')
export class PostResolver {
  constructor(
    private readonly postService: PostService,
    private prisma: PrismaService,
  ) {}

  @Mutation('createPost')
  async create(@Args('data') data: CreatePostInput) {
    try {
      const identityNumber = await makeModelIdentityNumber(this.prisma, 'post');

      this.prisma.$transaction(async (prisma: PrismaClient) => {
        const postCreated = await this.prisma.post.create({
          data: {
            content: data.content,
            title: data.title,
            identityNumber: identityNumber,
            authorId: data.authorId,
          },
        });
        if (!!data.medias && data.medias.length !== 0) {
          await prisma.file.createMany({
            data: data.medias.map((media) => ({
              postId: postCreated.id,
              filename: media.filename,
              mimetype: media.mimetype,
              fileCategory: FileCategory.MEDIA,
            })),
          });
        }
      });

      return true;
    } catch (error) {
      Exception.handle(error);
    }
  }

  @Query('getListPost')
  async getListPost(
    @Args('pagination') pagination: PaginationInput,
    @Args('condition') condition: GetListPostCondition,
  ) {
    const { skip, take, page, size } = buildQueryPagination(pagination);
    const where = buildQueryFilters(condition);
    const orderBy = buildQuerySorting(condition);

    const [posts, totalData] = await Promise.all([
      this.prisma.post.findMany({
        include: {
          author: {
            include: {
              file: true,
            },
          },
          file: true,
        },
        where,
        orderBy,
        skip,
        take,
      }),
      this.prisma.post.count({
        where,
      }),
    ]);

    const responsePosts: PostForGetListPostResponse[] = posts.map((post) => {
      const files: ObjFileOutput[] = post.file.map((file) => ({
        fileCategory: GQLFileCategory.MEDIA,
        filename: file.filename,
        id: file.id,
        mimetype: file.mimetype,
      }));

      const author: Author = {
        id: post.author.id,
        name: post.author.name,
        avatar: post?.author?.file
          ? {
              fileCategory: GQLFileCategory.MAIN_PHOTO,
              id: post.author.file.id,
              filename: post.author.file.filename,
              mimetype: post.author.file.mimetype,
            }
          : null,
      };
      return {
        id: post.id,
        identityNumber: post.identityNumber,
        author,
        medias: files,
        content: post.content,
        title: post.title,
      };
    });

    return {
      data: responsePosts,
      pagination: {
        page,
        size,
        totalData,
      },
    };
  }
}

const buildQueryFilters = (
  condition: GetListPostCondition,
): Prisma.BookWhereInput => {
  const { authorIds, searching } = condition;
  let result: Prisma.BookWhereInput = {};

  if (!!authorIds && authorIds.length !== 0) {
    result = {
      ...result,
      authorId: {
        in: authorIds,
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
        {
          author: {
            name: {
              contains: searching,
            },
          },
        },
      ],
    };
  }

  return result;
};

const buildQuerySorting = (
  condition: GetListPostCondition,
): Prisma.Enumerable<Prisma.PostOrderByWithRelationInput> => {
  const orderBy: GetListPostOrderBy =
    condition.orderBy || GetListPostOrderBy.CREATED_AT;
  const orderType: Prisma.SortOrder =
    condition.orderType === OrderByType.ASC ? 'asc' : 'desc';

  let result: Prisma.Enumerable<Prisma.PostOrderByWithRelationInput> = {};

  switch (orderBy) {
    case GetListPostOrderBy.AUTHOR:
      result = {
        ...result,
        author: {
          name: orderType,
        },
      };
      break;
    case GetListPostOrderBy.IDENTITY_NUMBER:
      result = {
        ...result,
        identityNumber: orderType,
      };
      break;
    case GetListPostOrderBy.TITLE:
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
