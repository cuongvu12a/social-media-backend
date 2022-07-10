import { join } from 'path';

export const TYPE_PATHS = 'src/graphql/*.graphql';
export const GENERATE_PATH = join(process.cwd(), 'src/generator/graphql.ts');
export const MIN_IDENTITY_NUMBER = 0;
export const MAX_IDENTITY_NUMBER = 999999999999;
