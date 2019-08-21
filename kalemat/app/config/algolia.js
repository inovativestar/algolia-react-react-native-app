import algoliasearch from 'algoliasearch'
import { algoliaConfig } from './config'
var client = algoliasearch(algoliaConfig.appId, algoliaConfig.apiKey);
var index = client.initIndex(algoliaConfig.indexName);

export const AlgoliaFuncs = {
    searchLyrics ( query, result )  {
        index
        .search({
            query
        })
        .then(function(responses) {
            //console.warn(responses.hits);
            result(responses.objectID,  responses.hits);
        });
    },
}