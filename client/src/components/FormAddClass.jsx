import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { verifyToken, reset } from "../features/tokenSlice";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import styles from "../styles/formAddClass.module.css";
import { domain } from "../config/domain";

const FormAddClass = () => {
  let { idUserAccess, roleAccess, isError } = useSelector((state) => state.token);
  const [name, setName] = useState("");
  const [type, setType] = useState("public");
  const [owner, setOwner] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [description, setDescription] = useState("");
  const [newImage, setNewImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [response, setResponse] = useState("");
  const [teachers, setTeachers] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    isError = false;
    dispatch(verifyToken());
  }, []);

  useEffect(() => {
    if (isError === true) {
      dispatch(reset());
      navigate("/");
    }
  }, [isError]);

  useEffect(() => {
    if (roleAccess === "teacher") {
      setOwner(idUserAccess);
    }
  }, [idUserAccess, roleAccess]);

  useEffect(() => {
    const getTeachers = async () => {
      const res = await axios.get(`${domain}/users/teacher`);
      setTeachers(res.data);
    };
    getTeachers();
  }, []);

  const handlerSubmit = async (e) => {
    e.preventDefault();

    try {
      if (newImage !== "") {
        const formData = new FormData();
        formData.append("image", newImage);
        formData.append("name", name);
        formData.append("type", type);
        formData.append("owner", owner);
        formData.append("accessCode", accessCode);
        formData.append("description", description);
        const res = await axios.post(`${domain}/classes`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        navigate("/class");
      } else {
        const res = await axios.post(`${domain}/classes`, { name: name, type: type, owner: owner, accessCode: accessCode, description: description });
        navigate("/class");
      }
    } catch (err) {
      setResponse(err.response.data.msg);
    }
  };

  const loadImage = (event) => {
    const image = event.target.files[0];
    setNewImage(image);
    setPreviewImage(URL.createObjectURL(image));
    setResponse("");
  };

  return (
    <section>
      <div className={styles.main_container_add}>
        <Form className={styles.custom_form} onSubmit={handlerSubmit}>
          <Form.Text className={styles.custom_title_add}>
            <h2>Tambah Kelas</h2>
          </Form.Text>
          <Form.Group className="mb-3">
            <Form.Label>Nama Kelas</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nama kelas"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tipe Kelas :</Form.Label>
            <Form.Select aria-label="Default select example" value={type} onChange={(event) => setType(event.target.value)}>
              <option value="public">Publik</option>
              <option value="private">Privat</option>
            </Form.Select>
          </Form.Group>
          {roleAccess === "admin" ? (
            <Form.Group className="mb-3">
              <Form.Label>Pilih Owner</Form.Label>
              <Form.Select value={owner} onChange={(event) => setOwner(event.target.value)}>
                <option value="" disabled>
                  Pilih owner :
                </option>
                {teachers.map((teacher) => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          ) : (
            ""
          )}
          {type === "private" ? (
            <Form.Group className="mb-3">
              <Form.Label>Kode Akses</Form.Label>
              <Form.Control
                type="text"
                placeholder="Kode Akses"
                value={accessCode}
                onChange={(event) => {
                  setAccessCode(event.target.value);
                }}
                required
              />
            </Form.Group>
          ) : (
            ""
          )}
          <Form.Group className="mb-3">
            <Form.Label>Deskripsi Kelas</Form.Label>
            <Form.Control value={description} onChange={(event) => setDescription(event.target.value)} className={styles.custom_textarea} as="textarea" placeholder="Deskripsi kelas (Opsional)" rows={6}></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Banner Kelas (opsional)</Form.Label>
            <Form.Control id="input_image" style={{ height: "auto" }} type="file" onChange={loadImage}></Form.Control>
            {previewImage ? <img src={previewImage} alt="Preview Image" style={{ width: "40%", margin: "10px 0px" }} /> : ""}
          </Form.Group>
          <Form.Group className={styles.custom_footer_add}>
            <Form.Text>{response}</Form.Text>
            <Button type="submit" variant="warning" className={styles.custom_add_button}>
              Buat
            </Button>
          </Form.Group>
        </Form>
      </div>
    </section>
  );
};

export default FormAddClass;
