import connect from "../config/Database.js";
import User from "../models/UserModel.js";
import Class from "../models/ClassModel.js";
import argon2 from "argon2";
import nodemailer from 'nodemailer';
import jwt from "jsonwebtoken";
import _ from 'lodash';

// export const createUser = async (req, res) => {
//   try {
//     await connect();
//     const { username, email, role, password, confirmPassword } = req.body;

//     const emailCheck = await User.findOne({ email: email });

//     if (username.length <= 2) {
//       return res.status(400).json({ msg: "Username harus berisi minimal 3 karakter" });
//     } else if (!email || !email.includes("@")) {
//       return res.status(400).json({ msg: "Harap masukan email yang benar" });
//     } else if (!password) {
//       return res.status(400).json({ msg: "Harap masukan password yang benar" });
//     } else if (password.length <= 4) {
//       return res.status(400).json({ msg: "Password harus berisi minimal 5 karakter" });
//     } else if (!confirmPassword) {
//       return res.status(400).json({ msg: "Harap masukan confirm password yang benar" });
//     } else if (emailCheck !== null) {
//       return res.status(400).json({ msg: "Email sudah terdaftar" });
//     } else if (password !== confirmPassword) {
//       return res.status(400).json({ msg: "Password tidak cocok" });
//     }

//     const hashPassword = await argon2.hash(password);

//     const newUser = new User({
//       name: username,
//       email: email,
//       role: role,
//       password: hashPassword,
//     });
//     await newUser.save();

//     return res.status(201).json({ msg: "Akun berhasil dibuat" });
//   } catch (error) {
//     return res.status(500).json({ msg: "Akun gagal dibuat" });
//   }
// };

export const createUser = async (req, res) => {
  try {
    await connect();
    const { username, email, role, password, confirmPassword } = req.body;

    const emailCheck = await User.findOne({ email: email });

    if (username.length <= 2) {
      return res.status(400).json({ msg: "Username harus berisi minimal 3 karakter" });
    } else if (!email || !email.includes("@")) {
      return res.status(400).json({ msg: "Harap masukan email yang benar" });
    } else if (!password) {
      return res.status(400).json({ msg: "Harap masukan password yang benar" });
    } else if (password.length <= 4) {
      return res.status(400).json({ msg: "Password harus berisi minimal 5 karakter" });
    } else if (!confirmPassword) {
      return res.status(400).json({ msg: "Harap masukan confirm password yang benar" });
    } else if (emailCheck !== null) {
      return res.status(400).json({ msg: "Email sudah terdaftar" });
    } else if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Password tidak cocok" });
    }

    const hashPassword = await argon2.hash(password);

    const newUser = new User({
      name: username,
      email: email,
      role: role,
      password: hashPassword,
    });
    await newUser.save();

    // konfigurasi email
    const transporter = nodemailer.createTransport({
      service : 'gmail',
      host: "smtp.ethereal.email",
      auth : {
        user : process.env.GMAIL_USER,
        pass : process.env.GMAIL_PASS,
      }
    })
    const emailToken = jwt.sign(
      {
        user : _.pick(newUser, 'email')
      }, 
      process.env.EMAIL_SECRET,
      {
        expiresIn: '1d'
      }
    )
      
    const url = `https://besmart.cyclic.cloud/confirmation/${emailToken}`
    // const url = `http://localhost:5000/confirmation/${emailToken}`;
    await transporter.sendMail({
      from: '"BeSmart" <agusawan2003@gmail.com>',
      to: email,
      subject: 'Konfirmasi Email BeSmart',
      html: `Silahkan lanjutkan proses pendaftaran dengan  mengklik <a href="${url}">konfirmasi ini</a> untuk proses verifikasi akun kamu (Abaikan kalau kamu tidak merasa melakukan pendaftaran)`,
    })

    return res.status(201).json({ msg: "Silahkan cek email kamu untuk proses verifikasi" });
  } catch (error) {
    return res.status(500).json({ msg: `${error}` });
  }
};

export const confirmEmail = async (req, res) => {
  try {
    const { user: { email } } = jwt.verify(req.params.token, process.env.EMAIL_SECRET);
    
    await User.updateOne(
      {
        email: email,
      },
      {
        $set: {
          confirmed: true,
        },
      }
    );
  } catch (e) {
    return res.status(400).json({msg:"Error"});
  }

  // return res.redirect('http://localhost:3000/');
  return res.redirect('https://besmart.cyclic.cloud/');
}

export const getUsers = async (req, res) => {
  try {
    await connect();
    const users = await User.find(
      {},
      {
        password: 0,
        refresh_token: 0,
      }
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const editUsername = async (req, res) => {
  try {
    const { user_id, username } = req.body;

    if (username === "") {
      return res.status(400).json({ msg: "Username tidak boleh kosong" });
    } else if (username.length <= 3) {
      return res.status(400).json({ msg: "Username terlalu pendek" });
    }

    await User.updateOne(
      {
        _id: user_id,
      },
      {
        $set: {
          name: username,
        },
      }
    );
    return res.status(202).json({ msg: "Username berhasil diubah" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const getUsersByRole = async (req, res) => {
  try {
    await connect();
    const response = await User.find({
      role: req.params.role,
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    await connect();
    const response = await User.findOne({
      attributes: ["name", "email", "role", "class_taken"],
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getUserClassTaken = async (req, res) => {
  try {
    await connect();
    let classTaken;
    const { user_id } = req.body;
    const user = await User.findOne({
      _id: user_id,
    });
    if (user) {
      const resultClass = await Class.find({
        _id: user.class_taken,
      });
      classTaken = resultClass;
    }

    return res.json(classTaken);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const leaveClass = async (req, res) => {
  try {
    const { class_id, user_id, user_role } = req.body;
    if (user_role === "student") {
      const updateUserResult = await User.updateOne(
        {
          _id: user_id,
        },
        {
          $pull: { class_taken: class_id },
        }
      );
      const updateClassResult = await Class.updateOne(
        {
          _id: class_id,
        },
        {
          $pull: { list_students: user_id },
        }
      );
      return res.status(203).json({ msg: `Update user count : ${updateUserResult.modifiedCount} and Update class count : ${updateClassResult.modifiedCount}` });
    } else {
      const updateUserResult = await User.updateOne(
        {
          _id: user_id,
        },
        {
          $pull: { class_taken: class_id },
        }
      );
      const updateClassResult = await Class.updateOne(
        {
          _id: class_id,
        },
        {
          $pull: { list_teachers: user_id },
        }
      );
      return res.status(203).json({ msg: `Update user count : ${updateUserResult.modifiedCount} and Update class count : ${updateClassResult.modifiedCount}` });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// export const updateUser = async (req, res) => {
//   try {
//     await connect();
//     const uuid = uuidv4();
//     await User.updateOne(
//       {
//         email: req.body.email,
//       },
//       {
//         $set: {
//           uuid: uuid,
//         },
//       }
//     );
//   } catch (error) {
//     console.log(error);
//   }
// };
