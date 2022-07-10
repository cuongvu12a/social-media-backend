import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AccountService } from './account.service';
import { AccountResolver } from './account.resolver';
import { JwtAuthGuard, JwtStrategy, RolesGuard } from './strategy';

@Module({
  imports: [JwtModule.register({})],
  providers: [AccountResolver, AccountService, JwtStrategy, JwtAuthGuard, RolesGuard],
})
export class AccountModule {}
