import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';

export const { searchClient } = instantMeiliSearch(
  'http://localhost:7700',
  'MiClaveSecreta123!'
);