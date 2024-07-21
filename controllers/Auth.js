import connect from "../config/Database.js";
import User from "../models/UserModel.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

export const Login = async (req, res) => {
  try {
    await connect();
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(404).json({ msg: "Email tidak ditemukan" });

    if (user !== null) {
      const { _id: id, name: username, email: usermail, role, password: userpassword, confirmed: confirmedEmail } = user;

      if(!confirmedEmail){
        return res.status(400).json({msg: "Email anda belum diverifikasi"});
      }

      const match = await argon2.verify(userpassword, password);
      if (!match) {
        return res.status(400).json({ msg: "Password salah" });
      }

      const refreshToken = jwt.sign({ id, username, usermail, role }, process.env.REFRESH_TOKEN_SECRET);

      if (user.refresh_token !== null) {
        await User.updateOne(
          {
            email: email,
          },
          {
            $set: {
              refresh_token: user.refresh_token,
            },
          }
        );

        res.clearCookie("refreshToken");
        res.cookie("refresh_token", user.refresh_token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });

        req.session.userId = id;
        return res.status(200).json({ msg: "Berhasil login" });
      } else {
        await User.updateOne(
          {
            email: email,
          },
          {
            $set: {
              refresh_token: refreshToken,
            },
          }
        );
        res.clearCookie("refreshToken");
        res.cookie("refresh_token", refreshToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });
        req.session.userId = id;
        return res.status(200).json({ msg: "Berhasil login" });
      }
    } else {
      return res.status(400).json({ msg: "Email tidak terdaftar" });
    }
  } catch (err) {
    console.log(err);
  }
};

export const InfoUserLogin = async (req, res) => {
  await connect();
  if (!req.session.userId) {
    return res.status(401).json({ msg: "Mohon login ke akun anda" });
  }

  const user = await User.findOne(
    { _id: req.session.userId },
    {
      password: 0,
      refresh_token: 0,
    }
  );
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  res.status(200).json(user);
};


export const Logout = async (req, res) => {
  try {
    await connect();
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) return res.sendStatus(500);

    const user = await User.findOne({
      refresh_token: refreshToken,
    });

    if (!user) return res.sendStatus(500);

    // const userId = user._id;

    // await User.updateOne(
    //   {
    //     _id: userId,
    //   },
    //   {
    //     $set: {
    //       refresh_token: null,
    //     },
    //   }
    // );

    res.clearCookie("refresh_token");
    req.session.destroy((error) => {
      if (error) return res.status(400).json({ msg: "Tidak dapat logout" });
    });
    return res.status(200).json({ msg: "Anda telah logout" });
  } catch (err) {
    console.log(err);
  }
};
