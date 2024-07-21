import connect from "../config/Database.js";
import mongoose, { mongo } from "mongoose";
import Class from "../models/ClassModel.js";
import User from "../models/UserModel.js";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export const createClass = async (req, res) => {
  try {
    await connect();

    let { name: nameClass, type, owner, accessCode, description } = req.body;
    let image, urlImage, imageName;
    const class_id = new mongoose.Types.ObjectId().toHexString();
    if (req.files) {
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
      // urlImage = `${req.protocol}://${req.get("host")}/images/classes/${imageName}`;
      urlImage = `images/classes/${imageName}`;
    }

    if (!nameClass) {
      return res
        .status(400)
        .json({ msg: "Harap masukan nama kelas yang benar" });
    } else if (nameClass.length <= 4) {
      return res
        .status(400)
        .json({ msg: "Nama kelas harus berisi minimal 5 karakter" });
    } else if (type === "private" && !accessCode) {
      return res
        .status(400)
        .json({ msg: "Harap masukan kode akses kelas yang benar" });
    } else if (type === "private" && accessCode.length <= 2) {
      return res
        .status(400)
        .json({ msg: "Kode akses kelas harus berisi minimal 3 karakter" });
    } else if (owner === "") {
      return res.status(400).json({ msg: "Harap pilih owner kelasnya" });
    } else if (!description) {
      description = `Kelas ${nameClass} adalah kelas umum yang mencakup berbagai topik dan materi pembelajaran. Kelas ini dirancang untuk memberikan pengetahuan dan keterampilan yang diperlukan dalam bidang yang dikhususkan`;
    }

    // name class check
    const nameCheck = await Class.findOne({ name: nameClass });
    const ownerData = await User.findOne({
      _id: owner,
    });

    if (nameCheck !== null) {
      return res.status(400).json({ msg: "Nama kelas sudah ada" });
    }

    if (req.files) {
      image.mv(`./public/images/classes/${imageName}`, async (err) => {
        if (err) return res.status(500).json({ msg: err.message });
      });
    }

    const newClass = new Class({
      _id: class_id,
      name: nameClass,
      type: type,
      owner: [ownerData._id, ownerData.name],
      list_teachers: [owner],
      access_code: accessCode,
      description: description,
      learning_materials: [
        {
          title: "Pengantar awal",
          content: `Halooo!! Selamat Datang Di Kelas ${nameClass}`,
          file_name: "",
          file_url: "",
          file_directory: "",
          file_desc: "",
          image_url: "",
          image_directory: "",
          image_desc: "",
          link: "",
          link_desc: "",
          video: "",
          video_desc: "",
          content_created: new Date().getTime(),
        },
      ],
      image_url: image !== undefined ? urlImage : "",
      image_directory: image !== undefined ? imageName : "",
    });

    await newClass.save();

    await User.updateOne(
      {
        _id: owner,
      },
      {
        $push: { class_taken: class_id },
      }
    );

    return res.status(201).json({ msg: "Kelas berhasil dibuat" });
  } catch (error) {
    return res.status(500).json({ msg: "Kelas gagal dibuat" });
  }
};

export const getClasses = async (req, res) => {
  try {
    await connect();
    const classes = await Class.find(
      {},
      {
        access_code: 0,
      }
    );
    res.json(classes);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getClassById = async (req, res) => {
  try {
    await connect();
    const response = await Class.findOne({
      _id: req.params.id,
    });
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// cek role dan terdaftarnya user ketika klik masuk kelas
export const checkUserAccess = async (req, res) => {
  // field student_list di database Class tiap document berisi id setiap user yang sudah terdaftar
  try {
    await connect();
    const { user_id, class_id } = req.body;
    const user = await User.findOne({
      _id: user_id,
    });
    const singleClass = await Class.findOne({
      _id: class_id,
    });

    // cek kalau role nya admin / teacher
    if (user.role === "admin") {
      return res
        .status(202)
        .json({ msg: "Kamu sudah terdaftar sebagai admin" });
    } else if (user.role === "teacher") {
      const checkTeachers = await Class.findOne({
        _id: class_id,
        list_teachers: { $in: [user_id] },
      });
      if (!checkTeachers) {
        if (singleClass.type === "private") {
          return res.status(403).json({ msg: "Kamu bukan owner kelas ini" });
        }
        await Class.updateOne(
          {
            _id: class_id,
          },
          {
            $push: { list_teachers: user_id },
          }
        );

        await User.updateOne(
          {
            _id: user_id,
          },
          {
            $push: { class_taken: class_id },
          }
        );
        return res
          .status(201)
          .json({ msg: "Kamu sudah didaftarkan sebagai guru" });
      } else {
        return res
          .status(202)
          .json({ msg: "Kamu sudah terdaftar sebagai guru" });
      }
    }

    // cek kalau role nya student
    if (user.role === "student") {
      const checkStudent = await Class.findOne({
        _id: class_id,
        list_students: { $in: [user_id] },
      });

      if (!checkStudent) {
        if (singleClass.type === "private") {
          return res
            .status(401)
            .json({ msg: "Kamu belum terdaftar kelas ini" });
        } else {
          await Class.updateOne(
            {
              _id: class_id,
            },
            {
              $push: { list_students: user_id },
            }
          );

          await User.updateOne(
            {
              _id: user_id,
            },
            {
              $push: { class_taken: class_id },
            }
          );
          return res
            .status(201)
            .json({ msg: "Kamu sudah didaftarkan ke kelas ini" });
        }
      } else {
        return res.status(202).json({ msg: "Kamu terdaftar dikelas ini" });
      }
    }
  } catch (err) {
    return res.status(500).json({ msg: "Something went wrong" });
  }
};

// cek kode akses yang diinputan user dari page VerifyClassPage
export const verifyCodeClass = async (req, res) => {
  try {
    await connect();
    const { class_id, class_name, user_id, code_access } = req.body;
    const user = await User.findOne({
      _id: user_id,
    });
    const checkCode = await Class.findOne({
      _id: class_id,
      access_code: code_access,
    });

    if (!checkCode) {
      return res.status(403).json({ msg: "Token salah" });
    } else {
      if (user.role === "teacher") {
        await Class.updateOne(
          {
            _id: class_id,
          },
          {
            $push: { list_teachers: user_id },
          }
        );

        await User.updateOne(
          {
            _id: user_id,
          },
          {
            $push: { class_taken: class_id },
          }
        );
      } else {
        await Class.updateOne(
          {
            _id: class_id,
          },
          {
            $push: { list_students: user_id },
          }
        );

        await User.updateOne(
          {
            _id: user_id,
          },
          {
            $push: { class_taken: class_id },
          }
        );
      }
    }

    return res.status(202).json({ msg: "Berhasil masuk" });
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// ubah list_students id menjadi name
export const getListStudentsById = async (req, res) => {
  try {
    const { list_students } = req.body;
    const response = await User.find(
      {
        _id: { $in: list_students },
      },
      {
        _id: 1,
        name: 1,
      }
    );
    return res.status(201).json(response);
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// ubah list_teachers id menjadi name
export const getListTeachersById = async (req, res) => {
  try {
    const { list_teachers } = req.body;
    const response = await User.find(
      {
        _id: { $in: list_teachers },
      },
      {
        _id: 1,
        name: 1,
      }
    );
    return res.status(201).json(response);
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// edit kelas
export const editClass = async (req, res) => {
  try {
    let {
      class_id,
      name: nameClass,
      type,
      owner,
      access_code,
      description,
    } = req.body;
    let image, urlImage, imageName;
    if (req.files) {
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
      urlImage = `${req.protocol}://${req.get(
        "host"
      )}/images/classes/${imageName}`;
    }

    if (!nameClass) {
      return res
        .status(400)
        .json({ msg: "Harap masukan nama kelas yang benar" });
    } else if (nameClass.length <= 4) {
      return res
        .status(400)
        .json({ msg: "Nama kelas harus berisi minimal 5 karakter" });
    } else if (type === "private" && !access_code) {
      return res
        .status(400)
        .json({ msg: "Harap masukan kode akses kelas yang benar" });
    } else if (type === "private" && access_code.length <= 2) {
      return res
        .status(400)
        .json({ msg: "Kode akses kelas harus berisi minimal 3 karakter" });
    } else if (owner === "") {
      return res.status(400).json({ msg: "Harap pilih owner kelasnya" });
    } else if (!description) {
      description = `Kelas ${nameClass} adalah kelas umum yang mencakup berbagai topik dan materi pembelajaran. Kelas ini dirancang untuk memberikan pengetahuan dan keterampilan yang diperlukan dalam bidang yang dikhususkan`;
    }

    // name class check
    const classCheck = await Class.findOne({ _id: class_id });
    const classNameCheck = await Class.findOne({ name: nameClass });

    const ownerData = await User.findOne({
      _id: owner,
    });

    if (classCheck.name !== nameClass) {
      if (classNameCheck !== null) {
        return res.status(400).json({ msg: "Nama kelas sudah ada" });
      }
    }

    if (req.files) {
      const filepath = `./public/images/classes/${classCheck.image_directory}`;
      fs.unlinkSync(filepath);
      image.mv(`./public/images/classes/${imageName}`, async (err) => {
        if (err) return res.status(500).json({ msg: err.message });
      });
    }

    let editClass;

    if (classCheck.image_url !== "") {
      editClass = {
        name: nameClass,
        type: type,
        owner: [ownerData._id, ownerData.name],
        list_teachers: classCheck.list_teachers.includes(owner)
          ? classCheck.list_teachers
          : classCheck.list_teachers.push(owner),
        access_code: type === "public" ? "" : access_code,
        description: description,
        image_url: image !== undefined ? urlImage : classCheck.image_url,
        image_directory:
          image !== undefined ? imageName : classCheck.image_directory,
      };
    } else {
      editClass = {
        name: nameClass,
        type: type,
        owner: [ownerData._id, ownerData.name],
        list_teachers: classCheck.list_teachers.includes(owner)
          ? classCheck.list_teachers
          : classCheck.list_teachers.push(owner),
        access_code: type === "public" ? "" : access_code,
        description: description,
        image_url: image !== undefined ? urlImage : "",
        image_directory: image !== undefined ? imageName : "",
      };
    }

    await Class.updateOne(
      {
        _id: class_id,
      },
      {
        $set: editClass,
      }
    );

    return res.status(201).json({ msg: "Kelas berhasil diubah" });
  } catch (error) {
    return res.status(500).json({ msg: "Kelas gagal dibuat" });
  }
};

// hapus kelas
export const deleteClass = async (req, res) => {
  try {
    await connect();
    const { class_id, image_directory } = req.body;

    const deleteClass = await Class.findOne(
      {
        _id: class_id,
      },
      {
        learning_materials: 1,
      }
    );

    const { learning_materials } = deleteClass;
    const image_material = [];
    const file_material = [];

    learning_materials.forEach((material) => {
      if (material.image_directory !== "") {
        image_material.push(material.image_directory);
      }

      if (material.file_directory !== "") {
        file_material.push(material.file_directory);
      }
    });

    // menghapus gambar dan file materi kelas
    if (image_material.length !== 0) {
      image_material.forEach((image) => {
        const filepath = `./public/images/materials/${image}`;
        fs.unlinkSync(filepath);
      });
    }

    if (file_material.length !== 0) {
      file_material.forEach((file) => {
        const filepath = `./public/files/materials/${file}`;
        fs.unlinkSync(filepath);
      });
    }

    // menghapus gambar kelas
    if (image_directory !== "") {
      const filepath = `./public/images/classes/${image_directory}`;
      fs.unlinkSync(filepath);
    }
    // menghapus satu document kelas di collection Class
    const deleteResult = await Class.deleteOne({ _id: class_id });
    // pada keseluruhan document di collection User menghapus satu data (string) di array field class_taken yang terdapat data (string) tersebut
    const updateResult = await User.updateMany(
      {
        class_taken: class_id,
      },
      {
        $pull: { class_taken: class_id },
      }
    );
    return res.status(203).json({
      msg: `Update count : ${updateResult.modifiedCount} and Delete count : ${deleteResult}`,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Gagal menghapus kelas" });
  }
};
