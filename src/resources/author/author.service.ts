import { Injectable } from '@nestjs/common';
import { Author, FileCategory, Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthorService {
  constructor(private prisma: PrismaService) {}

  createAuthor: (
    data: Prisma.AuthorCreateInput,
    file?: Prisma.FileCreateInput,
  ) => Promise<boolean> = async (data, file) => {
    this.prisma.$transaction(async (prisma: PrismaClient) => {
      const author = await prisma.author.create({
        data,
      });
      if (!!file) {
        await prisma.file.create({
          data: file,
        });
      }
    });
    return true;
  };
}
