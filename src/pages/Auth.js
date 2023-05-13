import React, { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/material";
import ParticlesBackground from "../Components/ParticlesBackground";
import { Typewriter } from "react-simple-typewriter";
import signupSVG from "../assets/signup-form.svg";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import FacebookIcon from "@mui/icons-material/Facebook";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import Loading from "../Components/Loading";

import { FormHelperText } from "@mui/material";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";

import { loginFunc, registerFunc, googleLogin } from "../firebase";

import { auth } from "../firebase";
import { useHistory } from "react-router-dom";

function Login() {
  const history = useHistory();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [userData, setUserData] = useState({
    name: "",
    surname: "",
    email_adress: "",
    password: "",
    isSubmitting: false,
  });
  const [errorMessages, setErrorMessages] = useState({
    name: null,
    surname: null,
    email_adress: null,
    password: null,
  });

  const handleChange = (event) => {
    setUserData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
    setErrorMessages((prevState) => ({
      ...prevState,
      [event.target.name]: "",
    }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setUserData((prevUserData) => ({
      ...prevUserData,
      isSubmitting: true,
    }));

    // state'lerin güncellendiğinden emin olmak için bekleyin
    await new Promise((resolve) => setTimeout(resolve, 0));

    // state'lerin güncellendiği son hallerini kullanarak hataları kontrol edin
    const errorMessages = {
      name: !isLoginMode && !userData.name ? "İsim boş olamaz." : "",
      surname: !isLoginMode && !userData.surname ? "Soyisim boş olamaz." : "",
      email_adress: !userData.email_adress
        ? "E-posta adresi girilmedi."
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email_adress)
        ? "Hatalı e-posta adresi."
        : "",
      password:
        userData.password.length < 6 ? "Şifre en az 6 karakter olmalıdır." : "",
    };

    setErrorMessages(errorMessages);

    // hata mesajlarının güncellendiğinden emin olmak için bekleyin
    await new Promise((resolve) => setTimeout(resolve, 0));

    // state'lerin güncellendiği son hallerini kullanarak submit işlemini gerçekleştirin
    const isFormValid = Object.values(errorMessages).every(
      (errorMsg) => errorMsg === ""
    );
    if (isFormValid) {
      if (isLoginMode) {
        loginFunc(
          auth,
          userData.email_adress,
          userData.password,
          history,
          setLoading,
          setError
        );
      } else {
        registerFunc(
          auth,
          userData.email_adress,
          userData.password,
          history,
          userData.name,
          userData.surname,
          setLoading,
          setError,   
        );
      }
    } else {
      console.log("Form hatalı!");
    }
  };
  const switchModeHandler = () => {
    if (!isLoginMode) {
      setUserData({
        ...userData,
        name: undefined,
        surname: undefined,
      });
      setErrorMessages({
        ...errorMessages,
        name: null,
        surname: null,
      });
    } else {
      setUserData({
        ...userData,
        name: "",
        surname: "",
      });
      setErrorMessages({
        ...errorMessages,
        name: null,
        surname: null,
      });
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const googleLoginHandler = () => {
    googleLogin(auth, history);
  };

  // İNPUTLAR VE ANİMATİON TEXT RESPONSİVE DEĞİL.
  return (
    <React.Fragment>
      <ParticlesBackground />

      {loading === true && <Loading asOverlay />}

      

      <Container component="main" maxWidth="lg">
        <Typography
          sx={{ position: "absolute", top: 40, left: 400, fontSize: "25px" }}
        >
          <Typewriter
            words={[
              "Kitap inceleme platformuna hoş geldin!",
              "Merak ettiğin, almadan önce incelemek istediğin bütün kitapları burada bulabilirsin.",
              "Kolayca kayıt ol ve kitapları incelemeye başla.",
            ]}
            loop={10}
            cursor
            cursorStyle="|"
            typeSpeed={50}
            deleteSpeed={25}
          />
        </Typography>
        <Box
          sx={{
            marginTop: 10,
          }}
        >
          <Grid container>
            <CssBaseline />
            <Grid
              item
              xs={false}
              sm={4}
              md={7}
              sx={{
                backgroundImage: `url(${signupSVG})`,
                backgroundRepeat: "no-repeat",
                backgroundColor: (t) =>
                  t.palette.mode === "light"
                    ? t.palette.grey[50]
                    : t.palette.grey[900],
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            <Grid
              item
              xs={12}
              sm={8}
              md={5}
              component={Paper}
              elevation={6}
              square
            >
              <Box
                sx={{
                  my: 8,
                  mt: 2,
                  mx: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "70vh",
                }}
              >
                <Stack direction="row" alignItems="center">
                  <Switch
                    checked={!isLoginMode}
                    onChange={() => switchModeHandler()}
                    sx={{
                      width: "50ch",
                      height: "100px",
                      "& .MuiSwitch-root.Mui-checked": {
                        bgcolor: "#21cc89",
                      },

                      "& .MuiSwitch-thumb": {
                        width: "96px",
                        height: "90px",
                        bgcolor: "#fff",
                      },
                      "& .MuiSwitch-track": {
                        borderRadius: "37px",
                        bgcolor: isLoginMode ? "#21cc89" : "#21cc89",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        {
                          bgcolor: isLoginMode ? "#21cc89" : "#21cc89",
                        },

                      "& .MuiSwitch-switchBase.Mui-checked": {
                        transform: "translateX(330px)",
                      },
                    }}
                  />

                  <Typography
                    variant="h5"
                    sx={{
                      position: "absolute",
                      marginLeft: 20,
                    }}
                  >
                    {isLoginMode ? "GİRİŞ" : "KAYIT"}
                  </Typography>
                </Stack>
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ mt: 1 }}
                >
                  <Box
                    variant="contained"
                    sx={{
                      mb: 1,
                      display: "flex",
                      gap: 1,
                      justifyContent: "center",
                    }}
                  >
                    <Button variant="outlined" onClick={googleLoginHandler}>
                      <img
                        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4="
                        alt="Google Sign-In"
                      />
                      &nbsp;
                      <Typography
                        sx={{ color: "black", fontWeight: "bold" }}
                        variant="caption"
                      >
                        GOOGLE İLE GİRİŞ YAP
                      </Typography>
                    </Button>
                    <Button variant="outlined">
                      <FacebookIcon />
                      &nbsp;{" "}
                      <Typography
                        sx={{ color: "black", fontWeight: "bold" }}
                        variant="caption"
                      >
                        Facebook İLE GİRİŞ YAP
                      </Typography>
                    </Button>
                  </Box>
                  {!isLoginMode && (
                    <div>
                      <FormControl
                        sx={{ mt: 0.5, width: "50ch", paddingBottom: 0.5 }}
                        variant="outlined"
                        error={errorMessages.name ? true : false}
                      >
                        <InputLabel htmlFor="name" required>
                          İsim
                        </InputLabel>
                        <OutlinedInput
                          id="name"
                          name="name"
                          type="text"
                          autoFocus
                          required
                          label="İsim"
                          onChange={handleChange}
                        />
                        <FormHelperText>{errorMessages.name}</FormHelperText>
                      </FormControl>
                      <FormControl
                        sx={{ mt: 0.5, width: "50ch", paddingBottom: 0.5 }}
                        variant="outlined"
                        error={errorMessages.surname ? true : false}
                      >
                        <InputLabel htmlFor="surname" required>
                          Soyisim
                        </InputLabel>
                        <OutlinedInput
                          id="surname"
                          name="surname"
                          type="text"
                          autoFocus
                          required
                          label="Soyisim"
                          onChange={handleChange}
                        />
                        <FormHelperText>{errorMessages.surname}</FormHelperText>
                      </FormControl>
                    </div>
                  )}

                  <FormControl
                    sx={{ mt: 0.5, width: "50ch", paddingBottom: 0.5 }}
                    variant="outlined"
                    error={errorMessages.email_adress ? true : false}
                  >
                    <InputLabel htmlFor="email_adress" required>
                      Email Adresi
                    </InputLabel>
                    <OutlinedInput
                      id="email_adress"
                      name="email_adress"
                      type="email"
                      autoFocus
                      required
                      label="Email Adresi"
                      onChange={handleChange}
                    />
                    <FormHelperText>
                      {errorMessages.email_adress}
                    </FormHelperText>
                  </FormControl>

                  <FormControl
                    sx={{ mt: 0.5, width: "50ch" }}
                    variant="outlined"
                    error={errorMessages.password ? true : false}
                  >
                    <InputLabel htmlFor="password" required>
                      Şifre
                    </InputLabel>
                    <OutlinedInput
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoFocus
                      required
                      onChange={handleChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Şifre"
                    />
                    <FormHelperText>{errorMessages.password}</FormHelperText>
                  </FormControl>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2.5, mb: 2 }}
                  >
                    {isLoginMode ? "GİRİŞ YAP" : "KAYIT OL"}
                  </Button>
                  {error && (
        <Stack >
          <Alert severity="error">{error}</Alert>
        </Stack>
      )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </React.Fragment>
  );
}
export default Login;
