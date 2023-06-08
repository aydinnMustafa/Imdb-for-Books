import React from "react";
import Navbar from "../Components/Navbar";
import BookList from "../Components/BookList";
import Footer from "../Components/Footer";
function Home() {
  return (
    <React.Fragment>
      <Navbar />
      <BookList />
      <Footer />
    </React.Fragment>
  );
}

export default Home;
