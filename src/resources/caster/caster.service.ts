import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CasterService {
  constructor(private prisma: PrismaService) {}

  createCaster: (
    data: Prisma.CasterCreateInput,
    file?: Prisma.FileCreateInput,
  ) => Promise<boolean> = async (data, file) => {
    this.prisma.$transaction(async (prisma: PrismaClient) => {
      const caster = await prisma.caster.create({
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
