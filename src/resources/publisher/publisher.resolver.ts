import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreatePublisherInput } from 'src/generator';
import { Exception } from 'src/utils';
import { PublisherService } from './publisher.service';

@Resolver('Publisher')
export class PublisherResolver {
  constructor(private readonly publisherService: PublisherService) {}

  @Mutation('createPublisher')
  async createPublisher(
    @Args('data')
    data: CreatePublisherInput,
  ) {
    try {
      const publisher = await this.publisherService.createPublisher({
        name: data.name,
      });

      return true;
    } catch (error) {
      Exception.handle(error);
    }
  }
}
