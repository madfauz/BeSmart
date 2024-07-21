import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, reset } from "../features/authSlice";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Dropdown from "react-bootstrap/Dropdown";
import { CgProfile } from "react-icons/cg";
import { RxHamburgerMenu } from "react-icons/rx";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/navigation.css";

const Navigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { nameAccess, roleAccess } = useSelector((state) => state.token);

  const handlerLogout = async () => {
    try {
      dispatch(LogOut());
      dispatch(reset());
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleDropdownToggle = () => {
    const menu = document.getElementById("custom-dropdown-menu");
    const display = menu.style.display;
    if (display === "none") {
      menu.style.display = "flex";
      setTimeout(() => {
        menu.style.opacity = "0.7";
      }, 100);
    } else {
      menu.style.opacity = "0";
      setTimeout(() => {
        menu.style.display = "none";
      }, 600);
    }
  };

  function capitalizeFirstLetter(str) {
    const firstName = str?.split(" ")[0];
    return firstName?.toLowerCase().replace(/(^|\s)\S/g, function (letter) {
      return letter.toUpperCase();
    });
  }

  return (
    <>
      <Navbar className="custom-navbar" expand="md">
        <Container className="custom-container">
          <Navbar.Brand href="/dashboard" className="custom-navbar-brand">
            Be Smart
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className="custom-navbar-toggle"
          />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className=" custom-navbar-collapse"
          >
            <Nav className="custom-nav">
              <Nav.Link href="/dashboard">Dashboard</Nav.Link>
              <Nav.Link href="/class">Kelas</Nav.Link>
              <Nav.Link href="/help">Bantuan</Nav.Link>
              <h4 style={{ marginLeft: "10%" }}>
                Halo {capitalizeFirstLetter(nameAccess)}
              </h4>
              <NavDropdown
                title={<CgProfile style={{ fontSize: "16px" }} />}
                id="basic-nav-dropdown"
                className="custom-dropdown"
              >
                <div className="text-center">
                  <NavDropdown.Item href="/setting">
                    Pengaturan
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item>
                    <button
                      style={{ border: "none", backgroundColor: "white" }}
                      onClick={handlerLogout}
                    >
                      Logout
                    </button>
                  </NavDropdown.Item>
                </div>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
          <div className="custom-dropdown-collapse">
            <button onClick={handleDropdownToggle} id="dropdown-basic">
              <RxHamburgerMenu style={{ fontSize: "16px" }} />
            </button>
          </div>
        </Container>
      </Navbar>
      <div id="custom-dropdown-menu" style={{ opacity: "0", display: "none" }}>
        <Dropdown.Item href="/dashboard">Dashboard</Dropdown.Item>
        <Dropdown.Item href="/class">Kelas</Dropdown.Item>
        <Dropdown.Item href="/help">Bantuan</Dropdown.Item>
        <Dropdown.Item href="/setting">Pengaturan</Dropdown.Item>
        <Dropdown.Item onClick={handlerLogout}>Logout</Dropdown.Item>
      </div>
    </>
  );
};

export default Navigation;
