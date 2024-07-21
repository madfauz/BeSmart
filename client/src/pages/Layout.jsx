import React from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const Layout = ({ children }) => {
  return (
    <React.Fragment>
      <Navigation />
      <div style={{ minHeight: "100%" }}>
        <div>
          <main>{children}</main>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default Layout;
