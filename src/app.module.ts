import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import graphqlUploadExpress = require('graphql-upload/graphqlUploadExpress.js')

import { TYPE_PATHS } from 'src/constants';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DateScalar, UploadScalar } from 'src/scalars';
import * as resources from 'src/resources';
import { AppController } from './app.controller';

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
    UploadScalar,
    PrismaModule,
    ...Object.values(resources),
  ],
  controllers: [AppController]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(graphqlUploadExpress()).forRoutes('graphql');
  }
}
