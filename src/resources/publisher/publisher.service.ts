import { Injectable } from '@nestjs/common';
import { Prisma, Publisher } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PublisherService {
  constructor(private prisma: PrismaService) {}

  createPublisher: (data: Prisma.PublisherCreateInput) => Promise<Publisher> = (
    data,
  ) =>
    this.prisma.publisher.create({
      data,
    });
}
