import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { verifyToken } from "../features/tokenSlice";
import { Link } from "react-router-dom";
import { FaFile } from "react-icons/fa";
import styles from "../styles/singleClass.module.css";
import { domain } from "../config/domain";

const SingleClass = () => {
  const currentURL = window.location.href;
  const pathname = new URL(currentURL).pathname;
  const pathParts = pathname.split("/");
  const parameter = pathParts[pathParts.length - 1];
  const [singleClass, setSingleClass] = useState("");
  const [className, setClassName] = useState("");
  const [desc, setDesc] = useState("");
  const [owner, setOwner] = useState("");
  const [learningMaterials, setLearningMaterials] = useState([]);
  const [formattedDateString, setFormattedDateString] = useState("");
  const [listStudents, setListStudents] = useState([]);
  const [listTeachers, setListTeachers] = useState([]);
  const [imageURL, setImageURL] = useState("");
  const [imageDirectory, setImageDirectory] = useState("");
  const [confirmData, setConfirmData] = useState([]);
  const [menuSelect, setMenuSelect] = useState("materi");
  const [imageDefault, setImageDefault] = useState("");
  const ratioVideo = "ratio ratio-16x9";
  let { idUserAccess, nameAccess, roleAccess, isError } = useSelector(
    (state) => state.token
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // verifikasi token dan ambil kelas berdasarkan id
  useEffect(() => {
    isError = false;
    dispatch(verifyToken());

    try {
      const getClass = async () => {
        const res = await axios.get(`${domain}/classes/${parameter}`);
        setSingleClass(res);
      };
      const getImage = async () => {
        const res = await axios.get(`${domain}/resource/classImage`);
        const result = res.data;
        setImageDefault(result.image.url);
      };
      getImage();
      getClass();
    } catch (error) {
      navigate("*");
    }
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
            class_id: parameter,
          });

          if (res.status === 201) {
            window.location.reload();
          }
        } catch (error) {
          if (error.response) {
            if (
              error.response.status === 401 ||
              error.response.status === 403
            ) {
              navigate(`/class/${parameter}/verification`);
            }
          } else {
            console.log(error.message);
          }
        }
      };
      checkVerifyClassAccess();
    }
  }, [singleClass]);

  // ubah list_students dan list_teachers id menjadi name
  useEffect(() => {
    if (singleClass !== "") {
      const getListStudents = async () => {
        const res = await axios.post(`${domain}/classes/listStudents`, {
          list_students: singleClass.data.list_students,
        });
        setListStudents(res.data);
      };
      getListStudents();
    }

    if (singleClass !== "") {
      const getListTeachers = async () => {
        const res = await axios.post(`${domain}/classes/listTeachers`, {
          list_teachers: singleClass.data.list_teachers,
        });
        setListTeachers(res.data);
      };
      getListTeachers();
    }
  }, [singleClass]);

  // set name, desc, dll. dari kelas yang diambil berdasarkan id sebelumnya
  useEffect(() => {
    if (singleClass !== "") {
      setClassName(singleClass.data.name);
      setOwner(singleClass.data.owner[1]);
      setDesc(singleClass.data.description);
      setImageURL(singleClass.data.image_url);
      setImageDirectory(singleClass.data.image_directory);
      setLearningMaterials(singleClass.data.learning_materials);
      setListStudents(singleClass.data.list_students);
      const originalDate = new Date(singleClass.data.createdAt);

      // Ambil bagian tanggal, bulan, dan tahun
      const day = originalDate.getDate();
      const month = originalDate.getMonth() + 1;
      const year = originalDate.getFullYear();

      // Ambil bagian jam, menit, dan detik
      const hours = originalDate.getHours();
      const minutes = originalDate.getMinutes();
      const seconds = originalDate.getSeconds();

      // Buat format hari dan waktu yang diinginkan (misal: DD/MM/YYYY HH:mm:ss)
      const formattedDateString = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
      setFormattedDateString(formattedDateString);
    }
  }, [singleClass]);

  const formatMaterialDate = (epoch) => {
    const originalDate = new Date(epoch);
    const day = originalDate.getDate();
    const month = originalDate.getMonth() + 1;
    const year = originalDate.getFullYear();
    const hours = originalDate.getHours();
    const minutes = originalDate.getMinutes();
    const seconds = originalDate.getSeconds();
    const formattedDateString = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    return formattedDateString;
  };

  function capitalizeFirstLetter(str) {
    return str?.toLowerCase().replace(/(^|\s)\S/g, function (letter) {
      return letter.toUpperCase();
    });
  }

  const confirm = (title, image_directory = "", file_directory = "") => {
    const showConfirm = document.getElementById("confirm");
    const titleConfirm = document.getElementsByClassName("title_confirm")[0];
    showConfirm.style.display = "flex";

    if (title === "hapus_kelas") {
      titleConfirm.innerText = "Kamu yakin ingin menghapus kelas?";
    } else if (title === "keluar_kelas") {
      titleConfirm.innerText = "Kamu yakin ingin keluar kelas?";
    } else {
      titleConfirm.innerText = "Kamu yakin ingin menghapus materi?";
    }
    setConfirmData([title, image_directory, file_directory]);
  };

  const confirmButton = async (answer, datas) => {
    try {
      if (answer === "yes") {
        if (datas[0] === "hapus_kelas") {
          const deleteResult = await axios.post(`${domain}/classes/delete`, {
            class_id: parameter,
            image_directory: datas[1],
          });
          console.log(deleteResult.data);
          navigate("/class");
        } else if (datas[0] === "keluar_kelas") {
          const deleteResult = await axios.post(`${domain}/users/leaveClass`, {
            class_id: parameter,
            user_id: idUserAccess,
            user_role: roleAccess,
          });
          navigate("/class");
        } else {
          const deleteResult = await axios.post(
            `${domain}/classes/deleteMaterial`,
            {
              class_name: className,
              materials: learningMaterials,
              material_title: datas[0],
              image_directory: datas[1],
              file_directory: datas[2],
            }
          );
          window.location.reload();
        }
      } else {
        const showConfirm = document.getElementById("confirm");
        showConfirm.style.display = "none";
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {/* confirm button */}
      <div className={styles.confirm} id="confirm">
        <h3 className="title_confirm"></h3>
        <button
          onClick={() => {
            confirmButton("yes", confirmData);
          }}
          type="button"
        >
          Ya
        </button>
        <button
          onClick={() => {
            confirmButton("no");
          }}
          type="button"
        >
          Tidak
        </button>
      </div>
      {/* header class */}
      {imageURL !== "" ? (
        <header
          className={styles.header}
          style={{ backgroundImage: `url(${domain}/${imageURL})` }}
        >
          <div className={styles.overlay}>
            <h1>{className}</h1>
            <h5>{`Pemilik : ${capitalizeFirstLetter(owner)}`}</h5>
            <h6>Dibuat pada : {formattedDateString}</h6>
            <p>{desc}</p>
          </div>
        </header>
      ) : (
        <header
          className={styles.header}
          style={{ backgroundImage: `url(${imageDefault})` }}
        >
          <div className={styles.overlay}>
            <h1>{className}</h1>
            <h5>{`Pemilik : ${capitalizeFirstLetter(owner)}`}</h5>
            <h6>Dibuat pada : {formattedDateString}</h6>
            <p>{desc}</p>
          </div>
        </header>
      )}
      {/*button class edit*/}
      <div className={styles.buttonEdit}>
        {roleAccess !== "student" ? (
          <Link to={`/class/${parameter}/addMaterial`}>
            <button className={styles.buttonClass} type="button">
              Tambah Materi
            </button>
          </Link>
        ) : (
          ""
        )}
        {nameAccess === owner || roleAccess === "admin" ? (
          <>
            <Link to={`/class/${parameter}/edit`}>
              <button className={styles.buttonClass} type="button">
                Edit Kelas
              </button>
            </Link>
            <button
              className={styles.buttonClass}
              type="button"
              onClick={() => {
                confirm("hapus_kelas", imageDirectory);
              }}
            >
              Hapus Kelas
            </button>
          </>
        ) : (
          ""
        )}
        {nameAccess !== owner && roleAccess !== "admin" ? (
          <button
            className={styles.buttonClass}
            type="button"
            onClick={() => {
              confirm("keluar_kelas");
            }}
          >
            Keluar Kelas
          </button>
        ) : (
          ""
        )}
      </div>

      {/* menu */}
      <div className={styles.menu}>
        {menuSelect === "materi" ? (
          <div
            style={{ backgroundColor: "rgb(51, 198, 127)", color: "white" }}
            className={styles.menu_item}
            onClick={() => {
              setMenuSelect("materi");
            }}
          >
            Materi
          </div>
        ) : (
          <div
            className={styles.menu_item}
            onClick={() => {
              setMenuSelect("materi");
            }}
          >
            Materi
          </div>
        )}
        {menuSelect === "latihan" ? (
          <div
            style={{ backgroundColor: "rgb(51, 198, 127)", color: "white" }}
            className={styles.menu_item}
            onClick={() => {
              setMenuSelect("latihan");
            }}
          >
            Latihan
          </div>
        ) : (
          <div
            className={styles.menu_item}
            onClick={() => {
              setMenuSelect("latihan");
            }}
          >
            Latihan
          </div>
        )}
        {menuSelect === "anggota" ? (
          <div
            style={{ backgroundColor: "rgb(51, 198, 127)", color: "white" }}
            className={styles.menu_item}
            onClick={() => {
              setMenuSelect("anggota");
            }}
          >
            Anggota
          </div>
        ) : (
          <div
            className={styles.menu_item}
            onClick={() => {
              setMenuSelect("anggota");
            }}
          >
            Anggota
          </div>
        )}
      </div>
      {/* materi */}
      {menuSelect === "materi" ? (
        <ul className={styles.classList}>
          {learningMaterials.map((material, index) => {
            const i = material.content.split(/[\/\n]/);
            return (
              <li key={index}>
                <h3>{material.title}</h3>
                {i.map((content, index) => {
                  if (content === "") {
                    return <br key={index} />;
                  } else if (content) {
                    return <p key={index}>{content}</p>;
                  }
                })}
                {material.link ? (
                  <>
                    <p>{material.link_desc}</p>
                    <a href={material.link} target="_blank">
                      {material.link}
                    </a>
                  </>
                ) : (
                  ""
                )}
                {material.image !== "" ? (
                  <>
                    <p>{material.image_desc}</p>
                    <img loading="lazy" src={material.image_url} />
                  </>
                ) : (
                  ""
                )}
                {material.file_name !== "" && material.file_url !== "" ? (
                  <>
                    <p>{material.file_desc}</p>
                    <a
                      className={styles.file}
                      href={material.file_url}
                      target="_blank"
                    >
                      <FaFile className={styles.fileIcon} />
                      <div className={styles.fileName}>
                        {material.file_name}
                      </div>
                    </a>
                  </>
                ) : (
                  ""
                )}
                {material.video !== "" ? (
                  <>
                    <p>{material.video_desc}</p>
                    <div className={`${ratioVideo} ${styles.ratioVideo}`}>
                      <iframe
                        width="560"
                        height="315"
                        src={material.video}
                        title="YouTube video"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </>
                ) : (
                  ""
                )}

                <h6 className={styles.date}>
                  {formatMaterialDate(material.content_created)}
                </h6>
                {roleAccess !== "student" ? (
                  <div className={styles.footerMaterial}>
                    <Link
                      to={`/class/${parameter}/editMaterial?index=${index}`}
                      className={styles.editMaterial}
                    >
                      <button type="button">
                        <span>Edit Materi</span>
                      </button>
                    </Link>
                    <Link className={styles.editMaterial}>
                      <button
                        type="button"
                        onClick={() => {
                          confirm(
                            material.title,
                            material.image_directory
                              ? material.image_directory
                              : "",
                            material.file_directory
                              ? material.file_directory
                              : ""
                          );
                        }}
                      >
                        <span>Hapus Materi</span>
                      </button>
                    </Link>
                  </div>
                ) : (
                  ""
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        ""
      )}
      {menuSelect === "latihan" ? (
        <h3
          style={{
            textAlign: "center",
            marginTop: "30vh",
            color: "grey",
            fontSize: "18px",
            fontWeight: "400",
          }}
        >
          Belum terdapat latihan
        </h3>
      ) : (
        ""
      )}
      {/* anggota */}
      {menuSelect === "anggota" ? (
        <ul className={styles.memberList}>
          {listTeachers.length > 0 ? <h4>Guru</h4> : ""}
          {listTeachers.map((teacher, index) => {
            return <li key={index}>{capitalizeFirstLetter(teacher.name)}</li>;
          })}
          {listStudents.length > 0 ? <h4>Murid</h4> : ""}
          {listStudents.map((student, index) => {
            return <li key={index}>{capitalizeFirstLetter(student.name)}</li>;
          })}
        </ul>
      ) : (
        ""
      )}
    </div>
  );
};

export default SingleClass;
