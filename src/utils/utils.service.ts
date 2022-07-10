import { Injectable } from '@nestjs/common';
import { Account } from '@prisma/client';
import { MAX_IDENTITY_NUMBER, MIN_IDENTITY_NUMBER } from 'src/constants';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UtilsService {
  constructor(private prisma: PrismaService) {}
  async makeAccountIdentityNumber(model: string): Promise<string> {
    const min: number = MIN_IDENTITY_NUMBER;
    const max: number = MAX_IDENTITY_NUMBER;
    let randomNumber: number;
    let identityNumber: string;
    let account: Account | null;
    do {
      randomNumber = Math.floor(Math.random() * (max - min) + min);
      identityNumber =
        '0'.repeat(String(max).length - String(randomNumber).length) +
        randomNumber;
      account = await this.prisma[model].findFirst({
        where: {
          identityNumber,
        },
      });
    } while (account);

    return identityNumber;
  }
}
