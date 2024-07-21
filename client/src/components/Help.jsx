import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyToken, update } from "../features/tokenSlice";
import Accordion from "react-bootstrap/Accordion";
import styles from "../styles/help.module.css";

const Help = () => {
  const dispatch = useDispatch();
  let { token, nameAccess, expireAccess, isError } = useSelector((state) => state.token);
  const navigate = useNavigate();
  useEffect(() => {
    isError = false;
    dispatch(verifyToken());
  }, []);

  useEffect(() => {
    if (isError === true) {
      navigate("/");
    }
  }, [isError]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>PERTANYAAN POPULER</h2>
      <Accordion className={styles.helpList} defaultActiveKey="0">
        <Accordion.Item className={styles.helpContainer} eventKey="0 ">
          <Accordion.Header className={styles.helpHeader}>
            <h4>Saya menemukan bug di aplikasi ini, bagaimana cara melakukan umpan balik?</h4>
          </Accordion.Header>
          <Accordion.Body className={styles.helpBody}>
            Untuk melakukan umpan balik anda bisa hubungi sosial media kami yang sudah tercantum dibagian bawah.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item className={styles.helpContainer} eventKey="1">
          <Accordion.Header>
            <h4>Apakah semua kelas bisa dimasuki oleh semua siswa, meskipun tidak sesuai jurusan?</h4>
          </Accordion.Header>
          <Accordion.Body className={styles.helpBody}>
            Kami menyediakan 2 tipe kelas yaitu public dan private. Untuk kelas public bisa dimasuki oleh semua siswa, meskipun berbeda jurusan. Jika siswa ingin memasuki kelas private harus meminta ijin terlebih dulu dengan guru yang mengajar kelas tersebut agar diberikan kode aksesnya. 
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item className={styles.helpContainer} eventKey="2">
          <Accordion.Header>
            <h4>Bagaimana cara mengakses materi pembelajaran setelah mendaftar?</h4>
          </Accordion.Header>
          <Accordion.Body className={styles.helpBody}>
            Setelah mendaftar dan masuk ke akun Anda, Anda dapat mengakses kelas yang Anda mau melalui halaman "Kelas". Di sana anda akan menemukan daftar kelas yang bisa anda ikuti.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item className={styles.helpContainer} eventKey="3">
          <Accordion.Header>
            <h4>Bagaimana cara mengubah username yang salah?</h4>
          </Accordion.Header>
          <Accordion.Body className={styles.helpBody}>
            Untuk mengubah username yang salah anda bisa menuju menu pengaturan lalu edit dan simpan username terbaru anda.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item className={styles.helpContainer} eventKey="4">
          <Accordion.Header>
            <h4>Bagaimana cara mengubah password yang lupa?</h4>
          </Accordion.Header>
          <Accordion.Body className={styles.helpBody}>
            Sayangnya anda tidak bisa mengganti password, karna sistem sudah melakukan enkripsi terhadap password lama anda.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item className={styles.helpContainer} eventKey="5">
          <Accordion.Header>
            <h4>Saya tidak bisa menemukan kelas yang saya cari.</h4>
          </Accordion.Header>
          <Accordion.Body className={styles.helpBody}>
            Beberapa kelas mungkin belum tersedia untuk saat ini dan kedepannya akan ditambahkan lagi secepatnya oleh guru masing-masing pelajaran.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item className={styles.helpContainer} eventKey="6">
          <Accordion.Header>
            <h4>Apakah setiap kelas akan tersedia untuk selamanya dan tidak memiliki batas waktu?</h4>
          </Accordion.Header>
          <Accordion.Body className={styles.helpBody}>
            Untuk masa berlaku dari tiap-tiap kelas tergantung dari kebijakan guru yang memiliki kelas tersebut, coba tanyakan pada masing-masing guru agar tidak kehilangan materi pembelajaran dimasa depan.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item className={styles.helpContainer} eventKey="7">
          <Accordion.Header>
            <h4>Apakah kedepannya akan ada fitur baru untuk aplikasi ini?</h4>
          </Accordion.Header>
          <Accordion.Body className={styles.helpBody}>
            Tentu saja, karna saat ini adalah versi awal jadi beberapa fitur mungkin belum tersedia dan kedepannya akan ada fitur-fitur baru.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default Help;
