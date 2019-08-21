const algoliasearch = require('algoliasearch');
const dotenv = require('dotenv');
const firebase = require('firebase');

// load values from the .env file in this directory into process.env
dotenv.load();

// configure firebase
firebase.initializeApp({
    apiKey: "AIzaSyAZAP95A3jI5Wb-E05enfH-TQXQbFvbhB4",
    authDomain: "lyric-test-642ce.firebaseapp.com",
    databaseURL: "https://lyric-test-642ce.firebaseio.com",
    projectId: "lyric-test-642ce",
    storageBucket: "lyric-test-642ce.appspot.com",
    messagingSenderId: "747387632992"
});
const database = firebase.database();

// configure algolia
const algolia = algoliasearch(
    'IHDSGTB54L',
    '42825c6c7ca1492628549f51c0794bec'
);
const index = algolia.initIndex('lyrics');

const lyricsRef = database.ref('lyrics');
lyricsRef.on('child_added', addOrUpdateIndexRecord);
lyricsRef.on('child_changed', addOrUpdateIndexRecord);
lyricsRef.on('child_removed', deleteIndexRecord);

function addOrUpdateIndexRecord(contact) {
    // Get Firebase object
    const record = contact.val();

    // Specify Algolia's objectID using the Firebase object key
    record.objectID = contact.key;

    // Add or update object
    index
        .saveObject(record)
        .then(() => {
            console.log('Firebase object indexed in Algolia', record.objectID);
        })
        .catch(error => {
            console.error('Error when indexing contact into Algolia', error);
            process.exit(1);
        });
}

function deleteIndexRecord(contact) {
    // Get Algolia's objectID from the Firebase object key
    const objectID = contact.key;
    // Remove the object from Algolia
    index
        .deleteObject(objectID)
        .then(() => {
            console.log('Firebase object deleted from Algolia', objectID);
        })
        .catch(error => {
            console.error('Error when deleting contact from Algolia', error);
            process.exit(1);
        });
}