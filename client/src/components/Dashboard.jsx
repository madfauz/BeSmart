import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyToken } from "../features/tokenSlice";
import styles from "../styles/dashboard.module.css";
import { domain } from "../config/domain";

const Dashboard = () => {
  const [classTaken, setClassTaken] = useState("");
  const [listMaterial, setListMaterial] = useState([]);
  const dispatch = useDispatch();
  let { idUserAccess, nameAccess, expireAccess, confirmedEmail ,isError } = useSelector((state) => state.token);
  const navigate = useNavigate();
  useEffect(() => {
    isError = false;
    dispatch(verifyToken());
  }, []);

  useEffect(() => {
    if (isError === true || confirmedEmail === false) {
      navigate("/");
    } else if (classTaken !== "") {
      const materials = [];
      for (let i = 0; i < classTaken.length; i++) {
        for (let v = 0; v < classTaken[i].learning_materials.length; v++) {
          const material = { date: classTaken[i].learning_materials[v].content_created, class_id: classTaken[i]._id, class_name: classTaken[i].name, title_material: classTaken[i].learning_materials[v].title };
          materials.push(material);
        }
      }
      // pengurutan materi kelas berdasarkan waktu terbaru
      const orderMaterials = materials.slice().sort((a, b) => b.date - a.date);
      if (orderMaterials.length < 5) {
        setListMaterial(materials);
      } else {
        setListMaterial(orderMaterials.slice(0, 5));
      }
    }
  }, [isError, classTaken]);

  useEffect(() => {
    if (idUserAccess !== null) {
      const getClassTakken = async () => {
        const res = await axios.post(`${domain}/users/classTaken`, { user_id: idUserAccess });
        setClassTaken(res.data);
      };
      getClassTakken();
    }
  }, [idUserAccess]);

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

  return (
    <section className={styles.main_container}>
      <div className={styles.listClass}>
        <div className={styles.title}>
          <h3>Kelas Yang Diikuti</h3>
        </div>
        <ul>
          {classTaken.length === 0 ? (
            <h4 className={styles.empty_column}>Belum ada kelas yang diikuti</h4>
          ) : (
            classTaken.map((kelas, index) => (
              <li key={index}>
                <a href={`/class/${kelas._id}`}>
                  <h4>{kelas.name}</h4>
                  <h5>{kelas.type}</h5>
                  <h6>{`Pemilik : ${kelas.owner[1]}`}</h6>
                </a>
              </li>
            ))
          )}
        </ul>
      </div>
      <div className={styles.listMaterial}>
        <div className={styles.title}>
          <h3>Materi Terbaru</h3>
        </div>
        <ul>
          {listMaterial.length === 0 ? (
            <h4 className={styles.empty_column}>Gabung kelas untuk mendapat materi terbaru</h4>
          ) : (
            listMaterial.map((material, index) => (
              <li key={index}>
                <a href={`/class/${material.class_id}`}>
                  <h4>{material.title_material}</h4>
                  <h5>{material.class_name}</h5>
                  <h6>{formatMaterialDate(material.date)}</h6>
                </a>
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
};

export default Dashboard;
