import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Account, Prisma } from '@prisma/client';

import { JWT_EXPIRES_IN, JWT_SECRET } from 'src/constants';
import { JwtPayload } from 'src/models';
import { PrismaService } from 'src/prisma/prisma.service';
import { makeModelIdentityNumber } from 'src/utils';
import { ERROR, Exception } from 'src/utils';
@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async validateAccount(email: string, password: string): Promise<Account> {
    const where: Prisma.AccountWhereInput = { email: email };
    const account: Account = await this.prisma.account.findFirst({
      where,
    });
    if (!account) throw new Exception(ERROR.ACCOUNT_NOT_FOUND);

    const flag = await this.comparePassword(password, account.password);
    if (!flag) throw new Exception(ERROR.PASSWORD_NOT_VALID);

    delete account.password;
    return account;
  }

  async createAccount(data: Prisma.AccountCreateInput): Promise<Account> {
    const hash = await this.hashPassword(data.password);
    const accountCreateInput: Prisma.AccountCreateInput = {
      ...data,
      password: hash,
    };
    const account: Account = await this.prisma.account.create({
      data: accountCreateInput,
    });
    return account;
  }

  findAccountExist: (
    where: Prisma.AccountWhereInput,
  ) => Promise<Account | null> = (where) =>
    this.prisma.account.findFirst({ where });

  signToken(payload: JwtPayload): Promise<string> {
    const options: JwtSignOptions = {
      expiresIn: JWT_EXPIRES_IN,
      secret: JWT_SECRET,
    };
    return this.jwt.signAsync(payload, options);
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  comparePassword: (password: string, hash: string) => Promise<boolean> = (
    password,
    hash,
  ) => bcrypt.compare(password, hash);

  makeAccountIdentityNumber: () => Promise<string> = () =>
    makeModelIdentityNumber(this.prisma, 'account');
}
