import firebase from 'react-native-firebase';
import { AsyncStorage, Alert } from 'react-native';
import { firebaseConfig } from './config';

export const appConfig = {
}

export const userManager = {
  newUser: async (email, password) => {
    const responseUser = await firebase
      .auth()
      .createUserAndRetrieveDataWithEmailAndPassword(email, password);
    const { user } = responseUser;
    await firebase.database().ref(`users/${user.uid}`).set({
      email,
      date: +new Date(),
      favourite: []
    });
    return user.uid;
  },

  signInUser: async (email, password) => {
    const response = await firebase
      .auth()
      .signInAndRetrieveDataWithEmailAndPassword(email, password);
    return response;
  },

  signInAnonymously: async () => {
    const response = await firebase
      .auth()
      .signInAnonymouslyAndRetrieveData();
    return response;
  },

  convertAnonymously: async (email, password) => {
    const credential = await firebase.auth.EmailAuthProvider.credential(email, password);
      firebase.auth().currentUser.linkAndRetrieveDataWithCredential(credential).then(function(usercred) {
        var user = usercred.user;
         firebase.database().ref(`users/${user.uid}`).set({
          email,
          date: +new Date(),
          favourite: []
        });
      }, function(error) {
        console.log("Error upgrading anonymous account", error);
      });
    return credential;
  },

  logOutUser: async () => {
    try {
      const response = await firebase.auth().signOut();
      await AsyncStorage.clear();
    } catch (error) {
      console.log('Error userManager.logOutUser -->', error)
    }
  },

  getUser: () => {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(function (user) {
        resolve(user);
      });
    });
  },

  loadUserData: async (id) => {
    const user = await userManager.getUser();
    let res = await firebase.database()
      .ref(`users/${user.uid}/info`)
      .once("value");
    return res.val();
  },

  loadUserData(id, setUserData) {
    firebase.database()
      .ref(`users/${id}/info`)
      .once("value", function( userData ) {
        setUserData( userData.val() );
      });
  },

  editUser: async ({ name, phone }) => {
    const user = await userManager.getUser();
    return await firebase.database()
      .ref(`users/${user.uid}/info`)
      .set({
        displayName: name,
        phoneNumber: phone,
      })
  },

  resetPassword: async (emailAddress, obj) => {
    const auth = firebase.auth();
    try {
      await auth.sendPasswordResetEmail(emailAddress);
      obj.setState({
        isLoading: false
      });
    } catch (error) {
      throw error
    }
  },

  userIsbad: async () => {
    const user   = await userManager.getUser();
    const lyrics = await firebase.database().ref("usersBad").once("value");
    let badUsers = lyrics.val();
    if (!badUsers) { return false; }
    let bad = Object.values(badUsers).filter(badUser => { return badUser.email == user.email;  })
    return bad.length > 0;
  },

  userIsAdmin: async () => {
    const user   = await userManager.getUser();
    const isAdmin = await firebase.database()
      .ref(`users/${user.uid}/isAdmin`)
      .once("value");
    return isAdmin.val() > 0;
  }

}

export const LyricsManager = {

  getConfig: async () => {
    const config = await firebase.database().ref("config")
      .once("value");
    return config.val();
  },

  getConfig( setConfig ) {
    firebase.database().ref("config")
      .once("value", function( snapshot ) {
        setConfig( snapshot.val() );
      } );
  },

  getLyrics: async (configFromServer) => {
    let lyrics;
    if (configFromServer.showLatest) {
      lyrics = await firebase.database().ref("lyrics")
        .limitToLast(configFromServer.countList)
        .once("value");
    } else {
      lyrics = await firebase.database().ref("lyrics")
        .orderByChild('viewCount')
        .limitToLast(configFromServer.countList)
        .once("value");
    }
    return lyrics.val();
  },

  getLyrics( configFromServer, query, addChild ) {
    if( configFromServer.showLatest ) {
      if( query === undefined || query === null || query === 'undefined' || query.length === 0 ) {
        firebase.database().ref("lyrics")
          .limitToLast(configFromServer.countList)
          .on('child_added', function(childSnapshot, prevChildKey) {
            addChild(childSnapshot.val(), prevChildKey, childSnapshot.key);
          });
      } else {
        firebase.database().ref("lyrics")
          .limitToLast(configFromServer.countList)
          .on('child_added', function(childSnapshot, prevChildKey) {
            addChild(childSnapshot.val(), prevChildKey, childSnapshot.key);
          });
      }
    } else {
      if( query === undefined || query === null || query === 'undefined' || query.length === 0 ) {
        firebase.database().ref("lyrics")
          .orderByChild('viewCount')
          .limitToLast(configFromServer.countList)
          .on('child_added', function(childSnapshot, prevChildKey) {
            addChild(childSnapshot.val(), prevChildKey, childSnapshot.key);
          });
      } else {
        firebase.database().ref("lyrics")
          .limitToLast(configFromServer.countList)
          .orderByChild('viewCount')
          .on('child_added', function(childSnapshot, prevChildKey) {
            addChild(childSnapshot.val(), prevChildKey, childSnapshot.key);
          });
      }

    }
  },


  searchLyrics ( query, result )  {
      firebase.database()
        .ref("lyrics")
        .orderByChild("lyricText")
        .limitToLast(4)
        .startAt(query)
        .endAt(query+"\uf8ff")
        .once( 'value', function(snapshot) {
          result(snapshot.key, snapshot.val());
        });

  },
  // searchLyrics: async (query) =>{

  //   const lyrics = await firebase.database()
  //   .ref(`lyrics`)
  //   .orderByChild("lyricText")
  //   .limitToLast(6)
  //   .startAt(query)
  //   .endAt(query+"\uf8ff")
  //   .once('value');
  //   return lyrics.val();

  // },



  getLyricItem( id, getItem ) {
    firebase.database().ref("lyrics").child(id)
      .on('value', function( snapshot ) {
        getItem( snapshot.val() );
      } );
  },

  viewCountIncrease: async (id, userId) => {
    let cachedData = await AsyncStorage.getItem("LyricDetail@" + id);
    if (cachedData) {
      return false;
    }
    const ref = firebase.database().ref(`lyrics/${id}`);
    return await ref.child("viewCount").transaction((currentView) => {
      return currentView + 1;
    });
  },

  viewCountIncrease(id, userId, setCount) {
    const ref = firebase.database().ref(`lyrics/${id}`);
    ref.child("viewCount").transaction( function (currentView) {
      setCount( currentView + 1 );
    });
  },

  getFavouriteLyrics: async () => {
    const user = await userManager.getUser();
    const lyrics = await firebase.database()
      .ref(`users/${user.uid}/favourite`)
      .once("value");
    return lyrics.val();
  },

  getFavouriteLyrics( user, setFavouriteLyrics ) {
    firebase.database()
      .ref(`users/${user.uid}/favourite`)
      .once("value", function( snapshot ) {
        setFavouriteLyrics( snapshot.val() );
      } );
  },

  getMyFavouriteLyrics: async () => {
    let data = {}
    const favouriteToFetch = await LyricsManager.getFavouriteLyrics();
    if (favouriteToFetch === null) return {};
    const favouritePromises = favouriteToFetch.map(id => {
      return firebase.database()
        .ref(`lyrics`)
        .orderByKey()
        .equalTo(id)
        .once('value')
    });
    const lyrics = await Promise.all(favouritePromises);
    const newData = lyrics.map(item => item.val());
    const getFavourites = CashManager.getFavourites.bind(CashManager)
    const storeData = CashManager.storeData.bind(CashManager)
    try {
      await storeData(CashManager.FAVORITES, newData)
      const dataFromCache = await getFavourites()
      dataFromCache.forEach((item, index) => {
        data = {
          ...data,
          ...item
        }
      });
    } catch (error) {
      console.warn('Error getting data: ', error)
    }
    return data
  },

  getLyricWithId: async (id) => {
    const getFavourites = CashManager.getFavourites.bind(CashManager)
    const getMyLyrics = CashManager.getMyLyrics.bind(CashManager)
    const favouritesCache = await getFavourites() ? (await getFavourites())[0] : null
    const myLyrics = await getMyLyrics()
    let song = null;
    if (favouritesCache && favouritesCache[id]) {
      song = favouritesCache[id]
    } else if (myLyrics && myLyrics[id]) {
      song = myLyrics[id]
    } else {
      song = (await firebase.database()
        .ref(`lyrics/${id}`)
        .once("value")).val()
    }
    return song
  },

  getMyLyrics: async () => {
    const user = await userManager.getUser();
    const lyrics = await firebase.database().ref(`users/${user.uid}/myLyrics`).once("value");
    if (lyrics === null) return null;
    const getMyLyrics = CashManager.getMyLyrics.bind(CashManager)
    const storeData = CashManager.storeData.bind(CashManager)
    storeData(CashManager.MY_LYRICS, lyrics.val())
    return await getMyLyrics();
  },

  getMyLyrics(id, addMyLyrics) {
    firebase.database().ref(`users/${id}/myLyrics`).on('child_added', function(childSnapshot, prevChildKey) {
      addMyLyrics( childSnapshot.val(), childSnapshot.key );
    });
  },

  toggleLyricFavourite: async (lyricData) => {
    const user = await userManager.getUser();
    return await firebase.database()
      .ref(`users/${user.uid}/favourite`)
      .transaction((favourite) => {
        if (favourite !== null) {
          const index = favourite.indexOf(lyricData._id);
          if (index === -1) {
            return [...favourite, lyricData._id];
          } else {
            let favClone = [...favourite];
            favClone.splice(index, 1);
            return [...favClone];
          }
        }
        return [lyricData._id];
      });
  },

  checkVoteLyric: async (id) => {
    const user = await userManager.getUser();
    const lyricsVoteRef = await firebase.database()
      .ref(`lyrics/${id}/lyricsVote/${user.uid}`)
      .once('value');
    return lyricsVoteRef.val();
  },

  checkVoteLyric( user, id ) {
    firebase.database()
      .ref(`lyrics/${id}/lyricsVote/${user.uid}`)
      .once('value', function( snapshot ) {
        return snapshot.val();
      });
  },

  voteLyric: async (id, status, lyricsVoteData) => {
    const user = await userManager.getUser();
    const refItem = firebase.database()
      .ref(`lyrics/${id}/${status}vote`);
    const lyricsVoteRef = firebase.database()
      .ref(`lyrics/${id}/lyricsVote/${user.uid}`);
    await lyricsVoteRef.set(status);
    return await refItem
      .transaction((num) => {
        let rating = num || 0;
        if (lyricsVoteData === null) return rating + 1;
        return rating + 1;
      });
  },

  deletePrivateLyric: async (id) => {
    const user = await userManager.getUser();
    return await firebase.database().ref(`users/${user.uid}/myLyrics/${id}`).remove();
  },

  deleteLyric: async (id) => {
    return await firebase.database().ref(`lyrics/${id}`).remove();
  },

  deletePrivateLyric: async (id) => {
    const user = await userManager.getUser();
    return await firebase.database()
      .ref(`users/${user.uid}/myLyrics/${id}`).remove();

   },

  createNewPrivate: async ({ songName, songText }) => {
    const user = await userManager.getUser();
    return await firebase.database()
      .ref(`users/${user.uid}/myLyrics/`)
      .push({
        songName: songName,
        lyricText: songText,
        date: +new Date(),
      })
  },

  createNew: async ({ singerID, singer, songName, metaData, songText, imageUrl }) => {
    console.log("Singer",singer);
    console.log("singerID",singerID);
    console.log("imageUrl",imageUrl);
    const user = await userManager.getUser();
    const lyricsMeta = Object.keys(metaData).map(key => ({ metaKey: key, metaValue: metaData[key] }))
    return await firebase.database()
      .ref('lyrics')
      .push({
        userId: user.uid,
        singer,
        singerID,
        imageUrl,
        songName,
        viewCount: 0,
        upvote: 0,
        downvote: 0,
        lyricText: songText,
        date: +new Date(),
        lyricsMeta
      })
  },

  checkLyricPending: async (id) => {
    return await firebase.database()
      .ref(`lyricsPending`)
      .orderByKey()
      .equalTo(id)
      .once('value');
  },

  checkLyricPending(id, setLyricPending) {
    firebase.database()
      .ref(`lyricsPending`)
      .orderByKey()
      .equalTo(id)
      .once('value', function( snapshot ) {
        setLyricPending( snapshot );
      });
  },

  createEditedPrivateLyric: async (id, { songName, songText }) => {
    const user = await userManager.getUser();
    return await firebase.database()
      .ref(`users/${user.uid}/myLyrics/${id}`)
      .set({
        songName,
        lyricText: songText,
        date: +new Date(),
      })
  },

  editLyric: async (id, { singer, songName, metaData, songText, imageUrl }) => {
    const user = await userManager.getUser();
    const lyricsMeta = Object.keys(metaData).map(key => ({ metaKey: key, metaValue: metaData[key] }))
    return await firebase.database()
      .ref(`lyrics/${id}`)
      .set({
        singer,
        songName,
        lyricText: songText,
        date: +new Date(),
        lyricsMeta,
      })
  },

  createEditedLyric: async (id, { singer, songName, metaData, songText, imageUrl }) => {
    const user = await userManager.getUser();
    const lyricsMeta = Object.keys(metaData).map(key => ({ metaKey: key, metaValue: metaData[key] }))
    return await firebase.database()
      .ref(`lyricsPending/${id}`)
      .set({
        userId: user.uid,
        singer,
        songName,
        lyricText: songText,
        date: +new Date(),
        lyricsMeta
      })
  }
}

export const CashManager = {

  FAVORITES: 'FAVORITES',
  MY_LYRICS: 'MY_LYRICS',

  getFavourites: async function () {
    try {
      return await this.retriveData(this.FAVORITES)
    } catch (error) {
      console.warn('Error retriveing favourites from cache', error)
    }
  },

  getMyLyrics: async function () {
    try {
      return await this.retriveData(this.MY_LYRICS)
    } catch (error) {
      console.warn('Error retriveing my lyrics from cache', error)
    }
  },

  updateItem: (table, uuid) => {
  },

  storeData: async function (key, value) {
    try {
      await AsyncStorage.setItem(
        key,
        typeof value === 'string' || typeof value === 'number' ? value : JSON.stringify(value)
      )
    } catch (error) {
      console.warn('Error storeing data to cash: ', error)
    }
  },

  retriveData: async key => {
    try {
      return JSON.parse(await AsyncStorage.getItem(key))
    } catch (error) {
      console.warn('Error retriving data from cash: ', error)
    }
  },

  removeItem: value => {
    AsyncStorage.removeItem(value, error => console.log('Error removeing item from cash: ', error))
  },

  cleanCash: () => {
    AsyncStorage.clear(error => console.warn('Error cleaning cash: ', error))
  }

}

async function testFunt() {

  try {
    AsyncStorage.clear();
  } catch (error) {
    console.warn('testFunct error: ', error)
  }

}

export const fetchSingers = async () => {

   try {
     return (await firebase.database().ref("singers").once('value')).val();
   } catch (error) {
     console.warn('Error fetching singers: ', error)
   }

}

export const searchSingers = ( query, setSingers ) => {
  firebase.database().ref("singers").orderByChild("name").limitToLast(3).startAt(query)
             .endAt(query+"\uf8ff").once( 'value', function(snapshot) {
    setSingers(snapshot.val());
  } );

}
