import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginUser, reset } from "../features/authSlice";
import { verifyToken } from "../features/tokenSlice";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import styles from "../styles/login.module.css";
import axios from "axios";
import { domain } from "../config/domain";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  let { user, isSuccess, isLoading, message } = useSelector(
    (state) => state.auth
  );
  let { idUserAccess, nameAccess, expireAccess, confirmedEmail, isError } =
    useSelector((state) => state.token);

  useEffect(() => {
    isError = false;
    dispatch(verifyToken());
  }, []);

  useEffect(() => {
    if (user || isSuccess) {
      if (confirmedEmail !== false) {
        navigate("/dashboard");
      }
    }

    const getImage = async () => {
      try {
        const res = await axios.get(`${domain}/resource/loginImage`);
        const result = res.data;
        setImage(result.image.url);
      } catch (err) {
        console.log(err);
      }
    };
    getImage();
    dispatch(reset());
  }, [user, isSuccess, dispatch, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(LoginUser({ email, password }));
  };

  return (
    <div className={styles.main_container_login}>
      <div className={styles.login_image}>
        <img src={`${domain}/${image}`} alt="" width="500px" />
      </div>
      <Form className={styles.custom_form} onSubmit={handleSubmit}>
        <Form.Text className={styles.custom_title_login}>
          <h2>
            <span style={{ color: "green" }}>Be</span>
            <span style={{ color: "orange" }}>Smart</span>
          </h2>
        </Form.Text>
        <Form.Group className="mb-3">
          <Form.Label>Alamat Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="name@contoh.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="inputPassword5">Password</Form.Label>
          <Form.Control
            type="password"
            id="inputPassword5"
            aria-describedby="passwordHelpBlock"
            placeholder="*******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <span>{message}</span>
        <Form.Group className={styles.custom_footer_login}>
          <Form.Text>
            <NavLink
              style={{ textDecoration: "none", color: "grey" }}
              to="/register"
            >
              Belum punya akun?
            </NavLink>
          </Form.Text>
          <Button
            type="submit"
            variant="warning"
            className={styles.custom_login_button}
          >
            {isLoading ? "Loading..." : "Login"}
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default Login;
