import React, { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
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
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import Loading from "../Components/Loading";
import { AuthContext } from "../shared/context/AuthContext";
import { FormHelperText } from "@mui/material";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";

function Login() {
  const { state } = React.useContext(AuthContext);
  const isAuthenticated = state.isAuthenticated;
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
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
    name: "",
    surname: "",
    email_adress: "",
    password: "",
  });

  console.log(userData.email_adress);
  const handleChange = (event) => {
    setUserData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
    setErrorMessages((prevState) => ({
      ...prevState,
      [event.target.name]: "",
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setUserData({
      ...userData,
      isSubmitting: true,
    });
    if (!isLoginMode) {
      if (!userData.name) {
        setErrorMessages({ ...errorMessages, name: "İsim boş olamaz." });
      }
      if (!userData.surname) {
        setErrorMessages({ ...errorMessages, surname: "Soyisim boş olamaz." });
      }
    }
    if (!userData.email_adress) {
      setErrorMessages({
        ...errorMessages,
        email_adress: "E-posta adresi girilmedi.",
      });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email_adress)) {
      setErrorMessages({
        ...errorMessages,
        email_adress: "Hatalı e-posta adresi.",
      });
    }
    if (userData.password.length < 6) {
      setErrorMessages({
        ...errorMessages,
        password: "Şifre en az 6 karakter olmalıdır.",
      });
    }
    console.log(userData);
  };

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setUserData({
        ...userData,
        name: undefined,
        surname: undefined,
      });
    } else {
      setUserData({
        ...userData,
        name: "",
        surname: "",
      });
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  // SWITCH YARIM KALDI DETAYLI İNCELE DÜZENLE AŞAĞI KAYMAYI DÜZELT.
  // SWTİCHMODEHANDLER SİGNUP VE LOGİN ARASINDA DEĞİŞME OLDUĞUNDA ARKA PLANDA STATE VERİLERİNİ SIFIRLIYOR AMA FRONTEND AYNI KALIYOR.

  return (
    <React.Fragment>
      <ParticlesBackground />

      <Container component="main" maxWidth="lg">
        <Typography
          sx={{ position: "absolute", top: 100, left: 400, fontSize: "25px" }}
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
            marginTop: 20,
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
                  height: "55vh",
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
                        bgcolor: "green"
                      },

                      "& .MuiSwitch-thumb": {
                        width: "96px",
                        height: "90px",
                        bgcolor: "#fff",
                      },
                      "& .MuiSwitch-track": {
                        borderRadius: "37px",
                        bgcolor: isLoginMode ? 'green' : 'green'
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                        bgcolor: isLoginMode ? 'green' : 'green'
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
                    {isLoginMode ? "KAYIT" : "GİRİŞ"}
                  </Typography>
                </Stack>
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ mt: 1 }}
                >
                  {!isLoginMode && (
                    <div>
                      <FormControl
                        sx={{ mt: 1, width: "50ch", paddingBottom: 0.5 }}
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
                        sx={{ mt: 1, width: "50ch", paddingBottom: 0.5 }}
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
                    sx={{ mt: 1, width: "50ch", paddingBottom: 0.5 }}
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
                    sx={{ mt: 1, width: "50ch" }}
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
                    sx={{ mt: 3, mb: 2 }}
                  >
                    {isLoginMode ? "GİRİŞ YAP" : "KAYIT OL"}
                  </Button>
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
