import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { verifyToken, reset } from "../features/tokenSlice";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import styles from "../styles/formAddClass.module.css";
import { domain } from "../config/domain";

const FormEditClass = () => {
  let { idUserAccess, roleAccess, isError } = useSelector(
    (state) => state.token
  );
  const currentURL = window.location.href;
  const pathname = new URL(currentURL).pathname;
  const pathParts = pathname.split("/");
  const parameter = pathParts[pathParts.length - 2];
  const [name, setName] = useState("");
  const [type, setType] = useState("public");
  const [owner, setOwner] = useState("");
  const [ownerDefault, setOwnerDefault] = useState("");
  const [ownerID, setOwnerID] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [description, setDescription] = useState("");
  const [newImage, setNewImage] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [imageDirectory, setImageDirectory] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [singleClass, setSingleClass] = useState("");
  const [response, setResponse] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [filterTeachers, setFilterTeachers] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    if (singleClass !== "") {
      const getListTeachers = async () => {
        const res = await axios.post(`${domain}/classes/listTeachers`, {
          list_teachers: singleClass.data.list_teachers,
        });
        setTeachers(res.data);
      };
      getListTeachers();
    }
  }, [singleClass]);

  useEffect(() => {
    if (teachers.length > 0) {
      const filter = teachers.filter(
        (teacher) => teacher._id !== singleClass.data.owner[0]
      );
      setFilterTeachers(filter);
    }
  }, [teachers]);

  // set nama, tipe, owner, dll kelas yang diedit
  useEffect(() => {
    if (singleClass !== "" && teachers.length > 0) {
      const filterOwner = teachers.filter(
        (teacher) => teacher._id === singleClass.data.owner[0]
      );
      setName(singleClass.data.name);
      setType(singleClass.data.type);
      setOwner(filterOwner[0]?._id);
      setOwnerDefault(filterOwner[0]?.name);
      setOwnerID(filterOwner[0]?._id);
      setAccessCode(singleClass.data.access_code);
      setDescription(singleClass.data.description);
      setImageURL(singleClass.data.image_url);
      setPreviewImage(singleClass.data.image_url);
      setImageDirectory(singleClass.data.image_directory);
    }
  }, [singleClass, teachers]);

  const loadImage = (event) => {
    const image = event.target.files[0];
    setNewImage(image);
    setPreviewImage(URL.createObjectURL(image));
    setResponse("");
  };

  const handlerSubmit = async (e) => {
    e.preventDefault();

    try {
      if (newImage !== "") {
        const formData = new FormData();
        formData.append("image", newImage);
        formData.append("class_id", parameter);
        formData.append("name", name);
        formData.append("type", type);
        formData.append("owner", owner);
        formData.append("access_code", accessCode);
        formData.append("description", description);
        const res = await axios.post(`${domain}/classes/edit`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setResponse(res.data.msg);
        navigate(`/class/${parameter}`);
      } else {
        const res = await axios.post(`${domain}/classes/edit`, {
          class_id: parameter,
          name: name,
          type: type,
          owner: owner,
          access_code: accessCode,
          description: description,
        });
        setResponse(res.data.msg);
        navigate(`/class/${parameter}`);
      }
    } catch (err) {
      setResponse(err.response.data.msg);
    }
  };
  return (
    <section>
      <div className={styles.main_container_add}>
        <Form className={styles.custom_form} onSubmit={handlerSubmit}>
          <Form.Text className={styles.custom_title_add}>
            <h2>Edit Kelas</h2>
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
            <Form.Select
              aria-label="Default select example"
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              {type === "public" ? (
                <>
                  <option value="public" defaultChecked>
                    Publik
                  </option>
                  <option value="private">Privat</option>
                </>
              ) : (
                <>
                  <option value="public">Publik</option>
                  <option value="private" defaultChecked>
                    Privat
                  </option>
                </>
              )}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Pilih Owner</Form.Label>
            <Form.Select
              value={owner}
              onChange={(event) => setOwner(event.target.value)}
            >
              <option value="" disabled>
                Pilih owner :
              </option>
              <option value={ownerID} defaultChecked>
                {ownerDefault}
              </option>
              {filterTeachers.map((teacher, index) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
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
            <Form.Control
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className={styles.custom_textarea}
              as="textarea"
              placeholder="Deskripsi kelas (Opsional)"
              rows={4}
            ></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label> Banner Kelas (opsional)</Form.Label>
            <Form.Control
              style={{ height: "auto" }}
              type="file"
              onChange={loadImage}
            ></Form.Control>
            {previewImage ? (
              <div
                style={{
                  margin: "10px 0px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Form.Label style={{ fontWeight: "400" }}>
                  Banner saat ini :
                </Form.Label>
                <img
                  src={`${domain}/${previewImage}`}
                  alt="Preview Image"
                  style={{ width: "50%" }}
                />
              </div>
            ) : (
              ""
            )}
          </Form.Group>
          <Form.Group className={styles.custom_footer_add}>
            <Form.Text>{response}</Form.Text>
            <Button
              type="submit"
              variant="warning"
              className={styles.custom_add_button}
            >
              Ubah
            </Button>
          </Form.Group>
        </Form>
      </div>
    </section>
  );
};

export default FormEditClass;
