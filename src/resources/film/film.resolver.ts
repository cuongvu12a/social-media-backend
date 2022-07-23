import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FileCategory, Prisma, PrismaClient } from '@prisma/client';
import {
  CreateFilmInput,
  GetFilmByIdResponse,
  FileCategory as GQLFileCategory,
} from 'src/generator';
import { PrismaService } from 'src/prisma/prisma.service';
import { ERROR, Exception } from 'src/utils';

@Resolver('Film')
export class FilmResolver {
  constructor(private prisma: PrismaService) {}

  @Mutation('createFilm')
  async createFilm(
    @Args('data')
    data: CreateFilmInput,
  ) {
    try {
      const {
        casterIds,
        categoryId,
        authorId,
        film: filmInput,
        trailer,
      } = data;

      if (!!categoryId) {
        const filmCategory = await this.prisma.filmCategory.findFirst({
          where: {
            id: categoryId,
          },
        });

        if (!filmCategory) throw new Exception(ERROR.FILM_CATEGORY_NOT_FOUND);
      }

      if (!!authorId) {
        const author = await this.prisma.author.findFirst({
          where: {
            id: authorId,
          },
        });
        if (!author) throw new Exception(ERROR.AUTHOR_NOT_FOUND);
      }

      await this.prisma.$transaction(async (prisma: PrismaClient) => {
        const film = await prisma.film.create({
          data: {
            title: data.title,
            subTitle: data.subTitle,
            description: data.subTitle,
            releaseAt: data.releaseAt,
            authorId: authorId,
            filmCategoryId: categoryId,
          },
        });
        if (!!casterIds && casterIds.length > 0) {
          const casters = await prisma.caster.findMany({
            where: {
              id: {
                in: casterIds,
              },
            },
          });
          await prisma.castingFilm.createMany({
            data: casters.map((caster) => ({
              casterId: caster.id,
              filmId: film.id,
            })),
          });
        }

        const files: Prisma.FileUncheckedCreateInput[] = [];
        if (!!filmInput) {
          files.push({
            fileCategory: FileCategory.FILM,
            filename: filmInput?.filename || '',
            mimetype: filmInput?.mimetype || '',
            filmId: film.id,
          });
        }
        if (!!trailer) {
          files.push({
            fileCategory: FileCategory.TRAILER,
            filename: trailer?.filename || '',
            mimetype: trailer?.mimetype || '',
            filmId: film.id,
          });
        }
        if (files.length > 0) {
          await prisma.file.createMany({
            data: files,
          });
        }
      });

      return true;
    } catch (error) {
      throw error;
      Exception.handle(error);
    }
  }

  @Query('getFilmById')
  async getFilmById(
    @Args('filmId')
    filmId: string,
  ) {
    try {
      const film = await this.prisma.film.findFirst({
        where: {
          id: filmId,
        },
        include: {
          author: {
            include: {
              file: true,
            },
          },
          files: true,
          filmCategory: {
            include: {
              parent: true,
            },
          },
          CastingFilm: {
            include: {
              caster: {
                include: {
                  file: true,
                },
              },
            },
          },
        },
      });
      const files = film.files;
      const filmFile = files.find(
        (file) => file.fileCategory === FileCategory.FILM,
      );
      const trailer = files.find(
        (file) => file.fileCategory === FileCategory.TRAILER,
      );
      const response: GetFilmByIdResponse = {
        title: film.title,
        description: film.description,
        subTitle: film.subTitle,
        author: {
          id: film?.author?.id || '',
          name: film?.author?.name || '',
          avatar: film?.author?.file
            ? {
                id: film?.author?.file?.id || '',
                filename: film?.author?.file?.filename || '',
                mimetype: film?.author?.file?.mimetype || '',
                fileCategory: GQLFileCategory.MAIN_PHOTO,
              }
            : null,
        },
        casters: film.CastingFilm.map((castingFilm) => ({
          id: castingFilm?.caster?.id,
          name: castingFilm?.caster?.name,
          avatar: castingFilm?.caster?.file
            ? {
                id: castingFilm?.caster?.file?.id || '',
                filename: castingFilm?.caster?.file?.filename || '',
                mimetype: castingFilm?.caster?.file?.mimetype || '',
                fileCategory: GQLFileCategory.MAIN_PHOTO,
              }
            : null,
        })),
        category: {
          id: film.filmCategory?.id,
          name: film.filmCategory?.name,
          parentId: film.filmCategory?.parent?.id,
          parentName: film.filmCategory?.parent?.name,
        },
        releaseAt: film.releaseAt,
        film: film
          ? {
              fileCategory: GQLFileCategory.FILM,
              filename: filmFile?.filename,
              id: filmFile?.id,
              mimetype: filmFile?.mimetype,
            }
          : null,
        trailer: trailer
          ? {
              fileCategory: GQLFileCategory.TRAILER,
              filename: trailer?.filename,
              id: trailer?.id,
              mimetype: trailer?.mimetype,
            }
          : null,
      };

      return response;
    } catch (error) {
      throw error;
    }
  }
}
