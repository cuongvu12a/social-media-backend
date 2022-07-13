import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { Prisma, Role as PrismaRole } from '@prisma/client';

import { AuthResponse, Role, SignInInput, SignUpInput } from 'src/generator';
import { JwtPayload } from 'src/models';
import { AccountService } from './account.service';
import { JwtAuthGuard, Roles, RolesGuard } from './strategy';
import { ERROR, Exception } from 'src/utils';

@Resolver('Account')
export class AccountResolver {
  constructor(private accountService: AccountService) {}

  @Mutation('signIn')
  async signIn(
    @Args('data')
    data: SignInInput,
  ): Promise<AuthResponse> {
    try {
      const account = await this.accountService.validateAccount(
        data.email,
        data.password,
      );

      const jwtPayload: JwtPayload = {
        email: account.email,
        identityNumber: account.identityNumber,
        role: account.role,
      };
      const token = await this.accountService.signToken(jwtPayload);

      const accountResponse: AuthResponse = {
        account: { ...account, role: account.role as Role },
        token: { accessToken: token },
      };

      return accountResponse;
    } catch (error) {
      Exception.handle(error);
    }
  }

  @Mutation('signUp')
  async signUp(
    @Args('data')
    data: SignUpInput,
  ): Promise<AuthResponse> {
    try {
      const accountExist = await this.accountService.findAccountExist({
        OR: [
          {
            accountName: data.accountName,
          },
          {
            email: data.email,
          },
        ],
      });
      if (!!accountExist) throw new Exception(ERROR.ACCOUNT_EXIST);

      const identityNumber =
        await this.accountService.makeAccountIdentityNumber();
      const accountInput: Prisma.AccountCreateInput = {
        ...data,
        role: PrismaRole.USER,
        identityNumber,
      };

      const account = await this.accountService.createAccount(accountInput);
      const jwtPayload: JwtPayload = {
        email: account.email,
        identityNumber: account.identityNumber,
        role: account.role,
      };
      const token = await this.accountService.signToken(jwtPayload);

      const accountResponse: AuthResponse = {
        account: { ...account, role: account.role as Role },
        token: { accessToken: token },
      };

      return accountResponse;
    } catch (error) {
      Exception.handle(error);
    }
  }

  @Roles(PrismaRole.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query('getAccountInfo')
  getAccountInfo(@Context() context: any): string {
    return 'hey yoo!';
  }
}
