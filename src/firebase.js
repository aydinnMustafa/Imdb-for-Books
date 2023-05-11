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
export const registerFunc = (
  auth,
  email,
  password,
  history,
  name,
  surname,
  setLoading,
  setError
) => {
  setLoading(true);
  createUserWithEmailAndPassword(auth, email, password)
    .then((userAuth) => {
      updateProfile(userAuth.user, {
        displayName: `${name} ${surname}`,
      }).catch((error) => {
        console.log("user not updated");
      });
      async function fetch() {
        try {
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
                  "Content-Type": "application/json",
                },
              }
            )
            .then((response) => {});
        } catch (err) {
          console.error(err);
        }
      }
      fetch();

      if (userAuth) {
        setTimeout(function () {
          setLoading(false);
          history.push("/books");
        }, 3000);
      }
    })
    .catch((err) => {
      let errorMessage;
      if (err.message === "Firebase: Error (auth/email-already-in-use).") {
        errorMessage =
          "Bu mail adresiyle kayıtlı olan bir kullanıcı zaten var!";
      } else if (
        err.message ===
        "Firebase: Password should be at least 6 characters (auth/weak-password)."
      ) {
        errorMessage = "Şifreniz 6 karekterden kısa olamaz.";
      } else if (err.message === "Firebase: Error (auth/internal-error).") {
        errorMessage = "Şifre boş bırakılamaz!";
      } else {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setLoading(false);
    });
};

const provider = new GoogleAuthProvider();
export const googleLogin = (auth, history) => {
  signInWithPopup(auth, provider)
    .then((userAuth) => {
      console.log(userAuth);
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
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {});

      if (userAuth) {
        setTimeout(function () {
          history.push("/books");
        }, 300);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
export const onLogout = (history, dispatchFunc) => {
  auth.signOut();
  dispatchFunc(logout());
  history.push("/auth");
};
