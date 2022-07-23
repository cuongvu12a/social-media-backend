import { Module } from '@nestjs/common';
import { CasterService } from './caster.service';
import { CasterResolver } from './caster.resolver';

@Module({
  providers: [CasterResolver, CasterService]
})
export class CasterModule {}
