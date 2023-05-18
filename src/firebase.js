import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { logout } from "./features/userSlice";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import axios from "axios";

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
export const loginFunc = (
  auth,
  email,
  password,
  history,
  setLoading,
  setError
) => {
  setLoading(true);
  signInWithEmailAndPassword(auth, email, password)
    .then((userAuth) => {
      console.log(userAuth);
      if (userAuth) {
        history.push("/books");
      }
    })

    .catch((err) => {
      let errorMessage;
      if (err.message === "Firebase: Error (auth/user-not-found).") {
        errorMessage = "Böyle bir kullanıcı bulunamadı!";
      } else if (err.message === "Firebase: Error (auth/wrong-password).") {
        errorMessage = "Şifreniz hatalı! Lütfen kontrol ediniz.";
      } else if (err.message === "Firebase: Error (auth/invalid-email).") {
        errorMessage = "Geçersiz email adresi.";
      } else if (err.message === "Firebase: Error (auth/internal-error).") {
        errorMessage = "Şifre boş bırakılamaz!";
      } else {
        errorMessage = err.message;
      }
      setError(errorMessage);
    })
    .finally(() => {
      setLoading(false);
    });
};

function deleteCurrentUser() {
  const user = auth().currentUser;
  user
    .delete()
    .then(function () {})
    .catch(function (error) {});
}

export const registerFunc = (
  auth,
  email,
  password,
  history,
  name,
  surname,
  setLoading,
  setError,
) => {
  setLoading(true);
  createUserWithEmailAndPassword(auth, email, password)
    .then((userAuth) => {
      try {
        updateProfile(userAuth.user, {
          displayName: `${name} ${surname}`,
        });
      } catch (err) {
        console.log("Display Name not updated!", err);
      }
      userAuth.user?.getIdToken().then((token) => {
        axios
          .post(
            "http://localhost:5000/api/users/signup",
            {
              _id: userAuth.user.uid,
              fullname: `${name} ${surname}`,
              email: email,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
            auth.currentUser?.getIdTokenResult(true);
            setTimeout(function () {
              setLoading(false);
              history.push("/books");
            }, 500);
          })
          .catch((e) => {
            deleteCurrentUser();
            setLoading(false);
            setError("Something wrong please try again later.");
          });
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      setLoading(false);
      if (errorCode === "auth/email-already-in-use") {
        setError("Failed to create acount. User already exist!");
      } else {
        setError("Something wrong please try again later.");
      }
    });
};

const provider = new GoogleAuthProvider();
export const googleLogin = (auth, history) => {
  signInWithPopup(auth, provider)
    .then((userAuth) => {
      userAuth.user?.getIdToken().then((token) => {
        axios
          .post(
            "http://localhost:5000/api/users/signup",
            {
            _id: userAuth.user.uid,
            fullname: userAuth.user.displayName,
            email: userAuth.user.email,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
            auth.currentUser?.getIdTokenResult(true); //We prevent token renewal if the role has been added to the token before in logins with Google.
            setTimeout(function () {
              history.push("/books");
            }, 1000);
          })
      });
    })
};


export const onLogout = (history, dispatchFunc) => {
  auth.signOut();
  dispatchFunc(logout());
  history.push("/auth");
};
