import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';

import { TYPE_PATHS } from 'src/constants';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DateScalar } from 'src/scalars';
import { UtilsModule } from 'src/utils/utils.module';
import * as resources from 'src/resources';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: false,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      typePaths: [TYPE_PATHS],
    }),
    DateScalar,
    PrismaModule,
    UtilsModule,
    ...Object.values(resources),
  ],
})
export class AppModule {}
