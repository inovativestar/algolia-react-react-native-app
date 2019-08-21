const functions = require('firebase-functions');
const algoliasearch = require('algoliasearch');
const ALGOLIA_ID = functions.config().algolia.app_id;
const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;
const ALGOLIA_SEARCH_KEY = functions.config().algolia.search_key;

const ALGOLIA_INDEX_NAME = 'lyrics';
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);

exports.indexLyricsToAlgolia = functions.database.ref('/lyrics/{lyricsId}')
    .onCreate((snapshot, context) => {

      // Get the lyrics document
        const lyrics = snapshot.val();
        // Add an 'objectID' field which Algolia requires
        lyrics.objectID = context.params.lyricsId;
        console.log('Indexing To Lyrics', lyrics);
        // Write to the algolia index
        const index = client.initIndex(ALGOLIA_INDEX_NAME);
        return index.saveObject(lyrics);
    });

