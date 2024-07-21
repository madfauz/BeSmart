import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyToken } from "../features/tokenSlice";
import styles from "../styles/setting.module.css";
import { domain } from "../config/domain";

const Setting = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [response, setResponse] = useState("");
  let { idUserAccess, nameAccess, isError } = useSelector((state) => state.token);
  isError = false;
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(verifyToken());
  }, []);

  useEffect(() => {
    if (isError === true) {
      navigate("/");
    }

    if (nameAccess !== null) {
      setUsername(nameAccess);
    }
  }, [isError, nameAccess]);

  const editHandler = async () => {
    try {
      const res = await axios.put(`${domain}/users/edit/username`, { user_id: idUserAccess, username: username });
      console.log(res.data.msg);
      window.location.reload();
    } catch (err) {
      setResponse(err.response.data.msg);
    }
  };

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>PENGATURAN</h2>
      <div className={styles.list}>
        <span className={styles.titleOption}>Username :</span>
        {isEdit ? (
          <input
            type="text"
            className={styles.input}
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
        ) : (
          <input type="text" className={styles.input} value={username} disabled />
        )}
        {isEdit ? (
          <>
            <button className={styles.button} onClick={() => setIsEdit(editHandler)}>
              Simpan
            </button>
            <button
              className={styles.button}
              onClick={() => {
                setIsEdit(!isEdit);
                setUsername(nameAccess);
              }}
            >
              Batal
            </button>
          </>
        ) : (
          <button className={styles.button} onClick={() => setIsEdit(!isEdit)}>
            Edit
          </button>
        )}
      </div>
      <div className={styles.response}>{response}</div>
    </section>
  );
};

export default Setting;
