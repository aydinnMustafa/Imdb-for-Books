import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC2fyoXUqCACxl9X3ZLziqgZLLjhNuZD14",
  authDomain: "imdb-for-books-ebe73.firebaseapp.com",
  projectId: "imdb-for-books-ebe73",
  storageBucket: "imdb-for-books-ebe73.appspot.com",
  messagingSenderId: "592924651473",
  appId: "1:592924651473:web:76c4a973ddc4fc66a5baf0",
  measurementId: "G-KE41GTX2BM",
};

// init firebase app
const app = initializeApp(firebaseConfig);


// services
export const auth = getAuth(app);
