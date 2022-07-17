import { Injectable } from '@nestjs/common';
import { Author, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthorService {
  constructor(private prisma: PrismaService) {}

  createAuthor: (data: Prisma.AuthorCreateInput) => Promise<Author> = async (
    data,
  ) =>
    this.prisma.author.create({
      data,
    });
}
