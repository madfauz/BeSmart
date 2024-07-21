import { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import styles from "../styles/carousel.module.css";

function ControlledCarousel() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel indicators={false} activeIndex={index} onSelect={handleSelect} className={styles.crsl}>
      <Carousel.Item className={styles.crsl_item}>
        <img src="https://images.pexels.com/photos/4492126/pexels-photo-4492126.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className={styles.img} alt="" />
        <Carousel.Caption className={styles.caption}>
          <h1>Belajar Fleksibel</h1>
          <h4>Tingkatkan pengetahuan mu dimana saja kapan saja</h4>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item className={styles.crsl_item}>
        <img src="https://images.pexels.com/photos/4778401/pexels-photo-4778401.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className={styles.img} alt="" />
        <Carousel.Caption className={styles.caption}>
          <h1>Beragam Pilihan Kelas</h1>
          <h4>Kuasai bidang yang ingin kamu tekuni dengan banyak pilihan kelas</h4>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default ControlledCarousel;
