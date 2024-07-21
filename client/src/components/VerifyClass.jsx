import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { verifyToken } from "../features/tokenSlice";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import styles from "../styles/verifyClass.module.css";
import { domain } from "../config/domain";

const VerifyClass = () => {
  const [response, setResponse] = useState("");
  const [codeAccess, setCodeAccess] = useState("");
  const [singleClass, setSingleClass] = useState("");

  const currentURL = window.location.href;
  const pathname = new URL(currentURL).pathname;
  const pathParts = pathname.split("/");
  const parameter = pathParts[pathParts.length - 2];
  let { idUserAccess, roleAccess, isError } = useSelector((state) => state.token);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // verifikasi token dan ambil kelas berdasarkan id
  useEffect(() => {
    isError = false;
    dispatch(verifyToken());

    const getClass = async () => {
      const res = await axios.get(`${domain}/classes/${parameter}`);
      setSingleClass(res);
    };
    getClass();
  }, []);

  useEffect(() => {
    if (isError === true) {
      navigate("/");
    }
  }, [isError]);

  useEffect(() => {
    if (singleClass !== "") {
      const checkVerifyClassAccess = async () => {
        try {
          const res = await axios.post(`${domain}/classes/access`, {
            user_id: idUserAccess,
            user_role: roleAccess,
            class_id: parameter,
            class_name: singleClass.data.name,
            class_type: singleClass.data.type,
          });
          if (res.status === 201 || res.status === 202) {
            navigate(`/class/${parameter}`);
          }
        } catch (error) {
          console.log(error.message);
        }
      };
      checkVerifyClassAccess();
    }
  }, [singleClass]);

  const handlerSubmit = async (e) => {
    try {
      e.preventDefault();
      await axios.post(`${domain}/classes/access/verify`, {
        class_id: parameter,
        class_name: singleClass.data.name,
        user_id: idUserAccess,
        code_access: codeAccess,
      });
      navigate(`/class/${parameter}`);
    } catch (error) {
      setResponse(error.response.data.msg);
    }
  };
  return (
    <section>
      <div className={styles.main_container_add}>
        <Form className={styles.custom_form} onSubmit={handlerSubmit}>
          <Form.Text className={styles.custom_title_add}>
            <h2>Masukan Kode Kelas</h2>
          </Form.Text>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Kode kelas"
              value={codeAccess}
              onChange={(event) => {
                setCodeAccess(event.target.value);
              }}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group className={styles.custom_footer_add}>
            <Form.Text>{response}</Form.Text>
            <Button type="submit" variant="warning" className={styles.custom_add_button}>
              Masuk
            </Button>
          </Form.Group>
        </Form>
      </div>
    </section>
  );
};

export default VerifyClass;
