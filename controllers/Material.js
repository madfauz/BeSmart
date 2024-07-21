import Class from "../models/ClassModel.js";
import User from "../models/UserModel.js";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// Tambah materi kelas
export const addMaterial = async (req, res) => {
  try {
    const { class_id, user_id, new_title, new_content, new_link, new_video, new_desc_link, new_desc_image, new_desc_file, new_desc_video } = req.body;
    const checkRole = await User.findOne({
      _id: user_id,
    });
    const checkOwner = await Class.findOne({
      _id: class_id,
      owner: user_id,
    });
    let file, image, urlFile, urlImage, fileName, imageName;
    if (req.files) {
      if (req.files.file) {
        file = req.files.file;
        const fileSize = file.data.length;
        // mengambil extension dari file yang akan di upload
        const extFile = path.extname(file.name);
        // tipe data yang diijinkan
        const allowedType = [".pdf", ".pptx", ".txt", ".docx", ".zip"];
        // mengconvert nama file yang akan di upload menjadi md5
        fileName = file.md5 + uuidv4() + extFile;

        if (fileSize > 5000000) {
          return res.json({ msg: "Ukurun file harus dibawah 5 mb" });
        } else if (!allowedType.includes(extFile.toLowerCase())) {
          return res.json({ msg: "Tipe data file tidak valid" });
        }
        // membuat url yang akan disimpan ke database
        urlFile = `${req.protocol}://${req.get("host")}/files/materials/${fileName}`;
      }

      if (req.files.image) {
        image = req.files.image;
        const imageSize = image.data.length;
        const extImage = path.extname(image.name);
        const allowedType = [".png", ".jpg", ".jpeg"];
        imageName = image.md5 + uuidv4() + extImage;
        if (imageSize > 5000000) {
          return res.json({ msg: "Ukurun gambar harus dibawah 5 mb" });
        } else if (!allowedType.includes(extImage.toLowerCase())) {
          return res.json({ msg: "Tipe data gambar tidak valid" });
        }
        urlImage = `${req.protocol}://${req.get("host")}/images/materials/${imageName}`;
      }
    }

    if (new_title.length < 2) {
      return res.json({ msg: "Judul materi terlalu pendek" });
    } else if (new_content.length < 10) {
      return res.json({ msg: "Konten materi terlalu pendek" });
    } else if (checkRole.role !== "student") {
      if (req.files) {
        if (req.files.file) {
          file.mv(`./public/files/materials/${fileName}`, async (err) => {
            if (err) return res.status(500).json({ msg: err.message });
          });
        }

        if (req.files.image) {
          image.mv(`./public/images/materials/${imageName}`, async (err) => {
            if (err) return res.status(500).json({ msg: err.message });
          });
        }
      }

      await Class.updateOne(
        {
          _id: class_id,
        },
        {
          $push: {
            learning_materials: {
              title: new_title,
              content: new_content,
              file_name: file !== undefined ? file?.name : "",
              file_url: urlFile !== undefined ? urlFile : "",
              file_directory: file !== undefined ? fileName : "",
              file_desc: new_desc_file,
              image_url: image !== undefined ? urlImage : "",
              image_directory: image !== undefined ? imageName : "",
              image_desc: new_desc_image,
              link: new_link,
              link_desc: new_desc_link,
              video: new_video,
              video_desc: new_desc_video,
              content_created: new Date().getTime(),
            },
          },
        }
      );

      return res.status(201).json({ msg: "Berhasil menambahkan materi" });
    } else if (checkRole.role === "student") {
      return res.json({ msg: "Kamu tidak punya hak akses menambah materi kelas ini" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Salah server nih" });
  }
};

// Edit materi kelas
export const editMaterial = async (req, res) => {
  try {
    let { class_id, material_list, material_index, user_id, new_title, new_content, new_link, new_video, new_desc_link, new_desc_image, new_desc_file, new_desc_video } = req.body;
    const checkRole = await User.findOne({
      _id: user_id,
    });
    const previousClass = await Class.findOne({
      _id: class_id,
    });

    const previousMaterial = previousClass.learning_materials[material_index];

    const parseMaterials = JSON.parse(material_list);
    const materialEdit = parseMaterials[material_index];

    let file, image, urlFile, urlImage, fileName, imageName;
    if (req.files) {
      if (req.files.file) {
        file = req.files.file;
        const fileSize = file.data.length;
        // mengambil extension dari file yang akan di upload
        const extFile = path.extname(file.name);
        // tipe data yang diijinkan
        const allowedType = [".pdf", ".pptx", ".txt", ".docx", ".zip"];
        // mengconvert nama file yang akan di upload menjadi md5
        fileName = file.md5 + uuidv4() + extFile;

        if (fileSize > 5000000) {
          return res.json({ msg: "Ukurun file harus dibawah 5 mb" });
        } else if (!allowedType.includes(extFile.toLowerCase())) {
          return res.json({ msg: "Tipe data file tidak valid" });
        }
        // membuat url yang akan disimpan ke database
        urlFile = `${req.protocol}://${req.get("host")}/files/materials/${fileName}`;
      }

      if (req.files.image) {
        image = req.files.image;
        const imageSize = image.data.length;
        const extImage = path.extname(image.name);
        const allowedType = [".png", ".jpg", ".jpeg"];
        imageName = image.md5 + uuidv4() + extImage;
        if (imageSize > 5000000) {
          return res.json({ msg: "Ukurun gambar harus dibawah 5 mb" });
        } else if (!allowedType.includes(extImage.toLowerCase())) {
          return res.json({ msg: "Tipe data gambar tidak valid" });
        }
        urlImage = `${req.protocol}://${req.get("host")}/images/materials/${imageName}`;
      }
    }

    if (new_title.length < 2) {
      return res.json({ msg: "Judul materi terlalu pendek" });
    } else if (new_content.length < 10) {
      return res.json({ msg: "Konten materi terlalu pendek" });
    } else if (checkRole.role !== "student") {
      if (req.files) {
        if (req.files.file) {
          const filepath = `./public/files/materials/${previousMaterial.file_directory}`;
          fs.unlinkSync(filepath);
          file.mv(`./public/files/materials/${fileName}`, async (err) => {
            if (err) return res.status(500).json({ msg: err.message });
          });
        }

        if (req.files.image) {
          const filepath = `./public/images/materials/${previousMaterial.image_directory}`;
          fs.unlinkSync(filepath);
          image.mv(`./public/images/materials/${imageName}`, async (err) => {
            if (err) return res.status(500).json({ msg: err.message });
          });
        }
      }

      materialEdit.title = new_title;
      materialEdit.content = new_content;
      materialEdit.file_name = file !== undefined ? file?.name : previousMaterial.file_name;
      materialEdit.file_url = urlFile !== undefined ? urlFile : previousMaterial.file_url;
      materialEdit.file_directory = file !== undefined ? fileName : previousMaterial.file_directory;
      materialEdit.file_desc = new_desc_file;
      materialEdit.image_url = image !== undefined ? urlImage : previousMaterial.image_url;
      materialEdit.image_directory = image !== undefined ? imageName : previousMaterial.image_directory;
      materialEdit.image_desc = new_desc_image;
      materialEdit.link = new_link;
      materialEdit.link_desc = new_desc_link;
      materialEdit.video = new_video;
      materialEdit.video_desc = new_desc_video;

      parseMaterials[material_index] = materialEdit;

      await Class.updateOne(
        {
          _id: class_id,
        },
        {
          $set: {
            learning_materials: parseMaterials,
          },
        }
      );

      return res.status(201).json({ msg: "Berhasil mengubah materi" });
    } else if (checkRole.role === "student") {
      return res.json({ msg: "Kamu tidak punya hak akses menambah materi kelas ini" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Salah server nih" });
  }
};

// hapus materi kelas

export const deleteMaterial = async (req, res) => {
  try {
    const { class_name, materials, material_title, file_directory, image_directory } = req.body;

    if (file_directory !== "") {
      const filepath = `./public/files/materials/${file_directory}`;
      fs.unlinkSync(filepath);
    }
    if (image_directory !== "") {
      const filepath = `./public/images/materials/${image_directory}`;
      fs.unlinkSync(filepath);
    }

    const newLearningMaterials = materials.filter((material) => material.title !== material_title);
    const updateResult = await Class.updateOne(
      { name: class_name },
      {
        $set: { learning_materials: newLearningMaterials },
      }
    );

    return res.status(203).json({ msg: `Berhasil menghapus materi ${updateResult.modifiedCount}` });
  } catch (error) {
    return res.status(500).json({ msg: "Gagal menghapus materi" });
  }
};
