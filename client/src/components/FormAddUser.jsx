import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import styles from "../styles/formAddUser.module.css";
import { domain } from "../config/domain";

const FormAddUser = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const role = "student";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState("");
  const [response, setResponse] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getImage = async () => {
      try {
        const res = await axios.get(`${domain}/resource/registerImage`);
        const result = res.data;
        setImage(result.image.url);
      } catch (err) {
        console.log(err);
      }
    };
    getImage();
  }, []);

  // const handlerSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     await axios.post(`${domain}/users/register`, {
  //       username: username,
  //       email: email,
  //       role: role,
  //       password: password,
  //       confirmPassword: confirmPassword,
  //     });
  //     navigate("/");
  //   } catch (err) {
  //     setResponse(err.response.data.msg);
  //   }
  // };

  const handlerSubmit = async (e) => {
    e.preventDefault();

    try {
      const post = await axios.post(`${domain}/users/register`, {
        username: username,
        email: email,
        role: role,
        password: password,
        confirmPassword: confirmPassword,
      });
      setResponse(post.data.msg);
    } catch (err) {
      setResponse(err.response.data.msg);
    }
  };

  return (
    <div className={styles.main_container_add}>
      <div className={styles.add_image}>
        <img src={`${domain}/${image}`} alt="" width="500px" />
      </div>
      <Form className={styles.custom_form} onSubmit={handlerSubmit}>
        <Form.Text className={styles.custom_title_add}>
          <h2>
            <span style={{ color: "green" }}>DAFTAR</span>
          </h2>
        </Form.Text>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Username"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Konfirmasi Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            role={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
            }}
          />
        </Form.Group>
        <Form.Group className={styles.custom_footer_add}>
          <Form.Text>{response}</Form.Text>
          <Button
            type="submit"
            variant="warning"
            className={styles.custom_add_button}
          >
            Daftar
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default FormAddUser;
