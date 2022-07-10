import { GraphQLDefinitionsFactory } from '@nestjs/graphql';

import { TYPE_PATHS, GENERATE_PATH } from '../constants';

const definitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory.generate({
  typePaths: [TYPE_PATHS],
  path: GENERATE_PATH,
  outputAs: 'class',
  customScalarTypeMapping: {
    DateTime: 'Date',
  },
  watch: true,
});
