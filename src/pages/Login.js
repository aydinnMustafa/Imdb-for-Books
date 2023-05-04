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
    fullname: "",
    email_adress: "",
    password: "",
    isSubmitting: false,
  });

  const handleChange = (event) => {
    setUserData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setUserData({
      ...userData,
      isSubmitting: true,
    });
  };



  const switchModeHandler = () => {
    if (!isLoginMode) {
      setUserData(
        {
          ...userData,
          name: undefined,
          image: undefined,
        },
      );
    } else {
      setUserData(
        {
          ...userData,
          name: {
            value: "",
          },
          image: {
            value: null,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };





// SWITCH YARIM KALDI DETAYLI İNCELE DÜZENLE AŞAĞI KAYMAYI DÜZELT.








  return (
    <React.Fragment>
      {userData.isSubmitting && <Loading asOverlay />}
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
                  mx: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                 
                }}
              >
                <Typography component="h1" variant="h5">
                  Kayıt Ol
                </Typography>
                <Button onClick={switchModeHandler}>
                Swıtch
                </Button>
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ mt: 1 }}
                >
                  {!isLoginMode && (
                  <FormControl
                    sx={{ mt: 1, width: "50ch", paddingBottom: 1 }}
                    variant="outlined"
                  >
                    <InputLabel htmlFor="fullname" required>
                      İsim soyisim
                    </InputLabel>
                    <OutlinedInput
                      id="fullname"
                      name="fullname"
                      type="text"
                      autoFocus
                      required
                      label="İsim soyisim"
                      onChange={handleChange}
                    />
                  </FormControl>
                  )}
                  <FormControl
                    sx={{ mt: 1, width: "50ch", paddingBottom: 1 }}
                    variant="outlined"
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
                  </FormControl>

                  <FormControl sx={{ mt: 1, width: "50ch" }} variant="outlined">
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
                  </FormControl>

                  <Button
                    disabled={userData.isSubmitting}
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Kayıt Ol
                  </Button>

                  <Grid container>
                    <Grid item xs>
                      <Link href="#" variant="body2">
                        Forgot password?
                      </Link>
                    </Grid>
                    <Grid item>
                      <Link href="#" variant="body2">
                        {"Don't have an account? Sign Up"}
                      </Link>
                    </Grid>
                  </Grid>
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
