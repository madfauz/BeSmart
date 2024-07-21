import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { verifyToken, reset } from "../features/tokenSlice";
import { reset as resetAccess } from "../features/accessClassSlice";
import { getMe } from "../features/authSlice";
import styles from "../styles/classList.module.css";
import { domain } from "../config/domain";

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [response, setResponse] = useState("");
  const [image, setImage] = useState("");
  let { idUserAccess, roleAccess, isError } = useSelector(
    (state) => state.token
  );
  const {
    isLoading,
    isSuccess,
    isError: isErrorAccess,
    status,
    message,
    classId,
  } = useSelector((state) => state.accessClass);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    isError = false;
    dispatch(verifyToken());
    dispatch(getMe());
    const getClasses = async () => {
      const res = await axios.get(`${domain}/classes`);
      setClasses(res.data);
    };
    getClasses();
    const getImage = async () => {
      try {
        const res = await axios.get(`${domain}/resource/classImage`);
        const result = res.data;
        setImage(result.image.url);
      } catch (err) {
        console.log(err);
      }
    };
    getImage();
  }, []);

  useEffect(() => {
    if (isError === true) {
      dispatch(reset());
      dispatch(resetAccess());
      navigate("/");
    }
  }, [isError]);

  // set classes ambil name nya saja
  const className = classes.map((kelas) => kelas.name);
  // membuat regex pattern dari state searchTerm dan "i" untuk case-insensitive matching
  const regex = new RegExp(searchTerm, "i");
  // filter className sesuai regex (menghasilkan array)
  const filteredData = className.filter((kelas) => regex.test(kelas));
  // query name tiap classes yang include salah satu atau lebih index filteredData
  const classesFilter = classes.filter((kelas) =>
    filteredData.some((i) => kelas.name.includes(i))
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <input
          className={styles.search}
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari kelas"
        />
      </div>
      {roleAccess !== "student" ? (
        <Link to="/class/add" className={styles.addClass}>
          Tambah Kelas
        </Link>
      ) : (
        ""
      )}
      <ul className={styles.listContent}>
        {searchTerm === ""
          ? classes.map((kelas, index) => (
              <li key={index + 1} className={styles.content}>
                {user?.class_taken.includes(kelas._id) ||
                user?.role === "admin" ||
                kelas.type === "public" ? (
                  <Link to={`/class/${kelas._id}`} className={styles.link}>
                    <div className={styles.content_header}>
                      {kelas.image_url && kelas.image_directory ? (
                        <img
                          loading="lazy"
                          src={`${domain}/${kelas.image_url}`}
                          width="100%"
                        />
                      ) : (
                        <img loading="lazy" src={`${image}`} width="100%" />
                      )}
                    </div>
                    <h2>{kelas.name}</h2>
                    <h3>{kelas.type}</h3>
                    <h4>{`Pemilik : ${kelas.owner[1]}`}</h4>
                  </Link>
                ) : (
                  <Link
                    to={`/class/${kelas._id}/verification`}
                    className={styles.link}
                  >
                    <div className={styles.content_header}>
                      {kelas.image_url && kelas.image_directory ? (
                        <img
                          loading="lazy"
                          src={`${domain}/${kelas.image_url}`}
                          width="100%"
                        />
                      ) : (
                        <img loading="lazy" src={`${image}`} width="100%" />
                      )}
                    </div>
                    <h2>{kelas.name}</h2>
                    <h3>{kelas.type}</h3>
                    <h4>{`Pemilik : ${kelas.owner[1]}`}</h4>
                  </Link>
                )}
                {status === 403 ? <h3>{message}</h3> : ""}
              </li>
            ))
          : classesFilter.map((kelas, index) => (
              <li key={index + 1} className={styles.content}>
                {user?.class_taken.includes(kelas._id) ||
                user?.role === "admin" ||
                kelas.type === "public" ? (
                  <Link to={`/class/${kelas._id}`} className={styles.link}>
                    <div className={styles.content_header}>
                      {kelas.image_url && kelas.image_directory ? (
                        <img
                          loading="lazy"
                          src={`${domain}/${kelas.image_url}`}
                          width="100%"
                        />
                      ) : (
                        <img loading="lazy" src={image} width="100%" />
                      )}
                    </div>
                    <h2>{kelas.name}</h2>
                    <h3>{kelas.type}</h3>
                    <h4>{`Pemilik : ${kelas.owner[1]}`}</h4>
                  </Link>
                ) : (
                  <Link
                    to={`/class/${kelas._id}/verification`}
                    className={styles.link}
                  >
                    <div className={styles.content_header}>
                      {kelas.image_url && kelas.image_directory ? (
                        <img
                          loading="lazy"
                          src={`${domain}/${kelas.image_url}`}
                          width="100%"
                        />
                      ) : (
                        <img loading="lazy" src={image} width="100%" />
                      )}
                    </div>
                    <h2>{kelas.name}</h2>
                    <h3>{kelas.type}</h3>
                    <h4>{`Pemilik : ${kelas.owner[1]}`}</h4>
                  </Link>
                )}
                {status === 403 ? <h3>{message}</h3> : ""}
              </li>
            ))}
      </ul>
    </div>
  );
};

export default ClassList;
