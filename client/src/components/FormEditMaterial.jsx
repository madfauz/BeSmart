import React, { useState, useEffect } from "react";
import { parsePath, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import styles from "../styles/formAddMaterial.module.css";
import { verifyToken } from "../features/tokenSlice";
import { useSelector, useDispatch } from "react-redux";
import { domain } from "../config/domain";

const FormEditMaterial = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const indexParam = queryParams.get("index");
  const currentURL = window.location.href;
  const pathname = new URL(currentURL).pathname;
  const pathParts = pathname.split("/");
  const parameter = pathParts[pathParts.length - 2];

  const [singleClass, setSingleClass] = useState("");
  const [listMaterials, setListMaterials] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newFile, setNewFile] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newLink, setNewLink] = useState("");
  const [newVideo, setNewVideo] = useState("");
  const [newDescLink, setNewDescLink] = useState("");
  const [newDescImage, setNewDescImage] = useState("");
  const [newDescFile, setNewDescFile] = useState("");
  const [newDescVideo, setNewDescVideo] = useState("");
  const [addFile, setAddFile] = useState(false);
  const [addLink, setAddLink] = useState(false);
  const [addImage, setAddImage] = useState(false);
  const [addVideo, setAddVideo] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewFile, setPreviewFile] = useState("");
  const [response, setResponse] = useState("");
  let { idUserAccess, roleAccess, isError } = useSelector((state) => state.token);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    isError = false;
    dispatch(verifyToken());
    const getClass = async () => {
      const res = await axios.get(`${domain}/classes/${parameter}`);
      setSingleClass(res.data);
    };
    getClass();
  }, []);

  useEffect(() => {
    if (isError === true) {
      navigate("/");
    } else if (roleAccess === "student") {
      navigate(`/class`);
    }
    if (singleClass !== "") {
      setListMaterials(singleClass.learning_materials);
    }
  }, [isError, roleAccess, singleClass]);

  // set materi yang diedit
  useEffect(() => {
    if (singleClass !== "" && listMaterials.length > 0) {
      const material = listMaterials[indexParam];
      setNewTitle(material.title);
      setNewContent(material.content);
      setNewLink(material.link);
      setNewVideo(material.video);
      if (newLink !== "") {
        setAddLink(true);
        setNewDescLink(material.link_desc);
      }
      if (material.image_url !== "") {
        setAddImage(true);
        setNewDescImage(material.image_desc);
        setPreviewImage(material.image_url);
      }

      if (material.file_url !== "") {
        setAddFile(true);
        setNewDescFile(material.file_desc);
        setPreviewFile(material.file_name);
      }

      if (newVideo !== "") {
        setAddVideo(true);
        setNewDescVideo(material.video_desc);
      }
    }
  }, [singleClass, listMaterials]);

  const loadImage = (event) => {
    const image = event.target.files[0];
    setNewImage(image);
    setPreviewImage(URL.createObjectURL(image));
    setResponse("");
  };

  const loadFile = (event) => {
    const file = event.target.files[0];
    setNewFile(file);
    setPreviewFile(file.name);
    setResponse("");
  };

  const handlerSubmit = async (e) => {
    e.preventDefault();
    let embedVideo = "";
    const material = listMaterials[indexParam];
    try {
      if (addLink || addImage || addFile || addVideo) {
        if (addLink) {
          if (newLink === "") {
            setResponse("Link tidak boleh kosong");
            return;
          }
        }
        if (addImage) {
          if (newImage === "" && material.image_url === "") {
            setResponse("Gambar tidak boleh kosong");
            return;
          }
        }
        if (addFile) {
          if (newFile === "" && material.file_url === "") {
            setResponse("File tidak boleh kosong");
            return;
          }
        }
        if (addVideo) {
          if (newVideo === "") {
            setResponse("Video tidak boleh kosong");
            return;
          } else {
            const url = new URL(newVideo);

            // jika user meng input link yang sudah di embed
            const pathnameVideo = url.pathname;
            const pathPartsVideo = pathnameVideo.split("/");

            if (url.host !== "youtu.be" && url.host !== "www.youtube.com") {
              setResponse("Link video youtube tidak valid");
              return;
            }

            // jika user meng input link yang belum di embed
            const embedURL = url.searchParams.get("v");
            if (!embedURL) {
              const splitURL = url.pathname.split("/");
              const selectURL = splitURL[splitURL.length - 1];
              if (selectURL === undefined) {
                setResponse("Link video youtube tidak valid");
                return;
              } else {
                embedVideo = `https://www.youtube.com/embed/${selectURL}`;
              }
            } else if (pathPartsVideo[1] === "embed") {
              embedVideo = newVideo;
            } else {
              embedVideo = `https://www.youtube.com/embed/${embedURL}`;
            }
          }
        }
      }

      if (newFile !== "" || newImage !== "") {
        const formData = new FormData();
        formData.append("file", newFile);
        formData.append("image", newImage);
        formData.append("new_title", newTitle);
        formData.append("new_content", newContent);
        formData.append("new_link", newLink);
        formData.append("new_video", embedVideo);
        formData.append("new_desc_link", newDescLink);
        formData.append("new_desc_image", newDescImage);
        formData.append("new_desc_file", newDescFile);
        formData.append("new_desc_video", newDescVideo);
        formData.append("class_id", parameter);
        formData.append("material_list", JSON.stringify(listMaterials));
        formData.append("material_index", indexParam);
        formData.append("user_id", idUserAccess);
        console.log(listMaterials);
        const res = await axios.post(`${domain}/classes/material/edit`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.data.msg === "Berhasil mengubah materi") {
          navigate(`/class/${parameter}`);
        }
        setResponse(res.data.msg);
        console.log(res.data);
      } else {
        const material = {
          new_title: newTitle,
          new_content: newContent,
          new_link: newLink,
          new_video: embedVideo,
          new_desc_link: newDescLink,
          new_desc_image: newDescImage,
          new_desc_file: newDescFile,
          new_desc_video: newDescVideo,
          class_id: parameter,
          material_list: JSON.stringify(listMaterials),
          material_index: indexParam,
          user_id: idUserAccess,
        };
        const res = await axios.post(`${domain}/classes/material/edit`, material);
        if (res.data.msg === "Berhasil menambahkan materi") {
          navigate(`/class/${parameter}`);
        }
        setResponse(res.data.msg);
        console.log(res.data);
      }
    } catch (err) {
      if (err.message) {
        setResponse("Gagal mengupdate materi");
      }
    }
  };
  return (
    <section>
      <div className={styles.main_container_add}>
        <Form className={styles.custom_form} onSubmit={handlerSubmit}>
          <Form.Text className={styles.custom_title_add}>
            <h2>Edit Materi</h2>
          </Form.Text>
          <Form.Group className="mb-3">
            <Form.Label>Judul Materi</Form.Label>
            <Form.Control
              type="text"
              placeholder="Judul Materi"
              value={newTitle}
              onChange={(event) => {
                setNewTitle(event.target.value);
                setResponse("");
              }}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Isi Materi</Form.Label>
            <Form.Control
              value={newContent}
              onChange={(event) => {
                setNewContent(event.target.value);
                setResponse("");
              }}
              className={styles.custom_textarea}
              as="textarea"
              rows={10}
              placeholder="Isi Materi"
              required
            ></Form.Control>
          </Form.Group>
          {/* Input Link */}
          <Form.Group>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px", margin: "0" }}>
              <div className="custom-checkbox">
                {newLink !== "" ? (
                  <input
                    value={addLink}
                    onClick={() => {
                      setAddLink(!addLink);
                      setNewLink("");
                      setNewDescLink("");
                    }}
                    type="checkbox"
                    id="checkbox"
                    defaultChecked
                  />
                ) : (
                  <input
                    value={addLink}
                    onClick={() => {
                      setAddLink(!addLink);
                      setNewLink("");
                      setNewDescLink("");
                    }}
                    type="checkbox"
                    id="checkbox"
                  />
                )}
                <Form.Label style={{marginLeft:"6px"}}>Tambahkan Link</Form.Label>
              </div>
            </div>
            {addLink ? (
              <>
                <Form.Control
                  className={styles.custom_textarea}
                  as="textarea"
                  rows={3}
                  placeholder="Deskripsi link (opsional)"
                  value={newDescLink}
                  onChange={(event) => {
                    setNewDescLink(event.target.value);
                    setResponse("");
                  }}
                  style={{ marginBottom: "8px" }}
                ></Form.Control>
                <Form.Control
                  type="text"
                  placeholder="Tautan Link"
                  value={newLink}
                  onChange={(event) => {
                    setNewLink(event.target.value);
                    setResponse("");
                  }}
                ></Form.Control>
              </>
            ) : (
              ""
            )}
          </Form.Group>
          {/* Input Gambar */}
          <Form.Group className={styles.field}>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
              <div className="custom-checkbox">
                {previewImage !== "" ? (
                  <input
                    value={addImage}
                    onClick={() => {
                      setAddImage(!addImage);
                      setNewImage("");
                      setNewDescImage("");
                    }}
                    type="checkbox"
                    id="checkbox"
                    defaultChecked
                  />
                ) : (
                  <input
                    value={addImage}
                    onClick={() => {
                      setAddImage(!addImage);
                      setNewImage("");
                      setNewDescImage("");
                    }}
                    type="checkbox"
                    id="checkbox"
                  />
                )}
                <Form.Label style={{marginLeft:"6px"}}>Tambahkan Gambar</Form.Label>
              </div>
            </div>
            {addImage ? (
              <>
                <Form.Control
                  className={styles.custom_textarea}
                  as="textarea"
                  rows={3}
                  placeholder="Deskripsi Image (opsional)"
                  value={newDescImage}
                  onChange={(event) => {
                    setNewDescImage(event.target.value);
                    setResponse("");
                  }}
                  style={{ marginBottom: "8px" }}
                ></Form.Control>
                <Form.Control style={{ height: "auto" }} type="file" onChange={loadImage}></Form.Control>
                {previewImage ? (
                  <div style={{ margin: "10px 0px", display: "flex", flexDirection: "column" }}>
                    <Form.Label style={{ fontWeight: "400" }}>Gambar saat ini :</Form.Label>
                    <img src={previewImage} alt="Preview Image" style={{ width: "50%" }} />
                  </div>
                ) : (
                  ""
                )}
              </>
            ) : (
              ""
            )}
          </Form.Group>
          {/* Input File */}
          <Form.Group className={styles.field}>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
              <div className="custom-checkbox">
                {previewFile !== "" ? (
                  <input
                    value={addLink}
                    onClick={() => {
                      setAddFile(!addFile);
                      setNewFile("");
                      setNewDescFile("");
                    }}
                    type="checkbox"
                    id="checkbox"
                    defaultChecked
                  />
                ) : (
                  <input
                    value={addLink}
                    onClick={() => {
                      setAddFile(!addFile);
                      setNewFile("");
                      setNewDescFile("");
                    }}
                    type="checkbox"
                    id="checkbox"
                  />
                )}
                <Form.Label style={{marginLeft:"6px"}}>Tambahkan File</Form.Label>
              </div>
            </div>
            {addFile ? (
              <>
                <Form.Control className={styles.custom_textarea} as="textarea" rows={3} placeholder="Deskripsi file (opsional)" value={newDescFile} onChange={loadFile} style={{ marginBottom: "8px" }}></Form.Control>
                <Form.Control style={{ height: "auto" }} type="file" onChange={loadFile}></Form.Control>
                {previewFile ? (
                  <>
                    <Form.Label style={{ fontWeight: "400" }}>File saat ini :</Form.Label>
                    <div className={styles.preview_file}>
                      <div>{previewFile}</div>
                    </div>
                  </>
                ) : (
                  ""
                )}
              </>
            ) : (
              ""
            )}
          </Form.Group>
          {/* Input Video */}
          <Form.Group>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px", margin: "0" }}>
              <div className="custom-checkbox">
                {newVideo !== "" ? (
                  <input
                    value={addVideo}
                    onClick={() => {
                      setAddVideo(!addVideo);
                      setNewVideo("");
                      setNewDescVideo("");
                    }}
                    type="checkbox"
                    id="checkbox"
                    defaultChecked
                  />
                ) : (
                  <input
                    value={addVideo}
                    onClick={() => {
                      setAddVideo(!addVideo);
                      setNewVideo("");
                      setNewDescVideo("");
                    }}
                    type="checkbox"
                    id="checkbox"
                  />
                )}
                <Form.Label style={{marginLeft:"6px"}}>Tambahkan Video</Form.Label>
              </div>
            </div>
            {addVideo ? (
              <>
                <Form.Control
                  className={styles.custom_textarea}
                  as="textarea"
                  rows={3}
                  placeholder="Deskripsi video (opsional)"
                  value={newDescVideo}
                  onChange={(event) => {
                    setNewDescVideo(event.target.value);
                    setResponse("");
                  }}
                  style={{ marginBottom: "8px" }}
                ></Form.Control>
                <Form.Control
                  type="text"
                  placeholder="Tautan Video Link Youtube"
                  value={newVideo}
                  onChange={(event) => {
                    setNewVideo(event.target.value);
                    setResponse("");
                  }}
                ></Form.Control>
              </>
            ) : (
              ""
            )}
          </Form.Group>
          <Form.Group className={styles.custom_footer_add}>
            <Form.Text>{response}</Form.Text>
            <Button type="submit" variant="warning" className={styles.custom_add_button}>
              Ubah
            </Button>
          </Form.Group>
        </Form>
      </div>
    </section>
  );
};

export default FormEditMaterial;
