import { initializeApp } from 'firebase/app'
import 'firebase/database'
import { createClass } from 're-base'

const firebaseApp = initializeApp({
    apiKey: "AIzaSyAbHbsLwHHLw5CfxEp52uABg5EbxWvODsI",
    authDomain: "lyrcis-8440b.firebaseapp.com",
    databaseURL: "https://lyrcis-8440b.firebaseio.com",
    projectId: "lyrcis-8440b",
    storageBucket: "lyrcis-8440b.appspot.com",
    messagingSenderId: "707480164311"

})

export const base = createClass(firebaseApp.database())