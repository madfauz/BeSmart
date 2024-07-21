import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  try {
    // mengambil cookie refresh_token dari user
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) return res.sendStatus(401);
    // mengecek apakah refreshToken terdaftar di refresh_token database
    const user = await User.findOne({ refresh_token: refreshToken });
    const { _id: id, name, email, role, confirmed } = user;
    if (!user) return res.sendStatus(402);

    // verifikasi apakah refreshToken dari user sesuai dengan REFRESH_TOKEN_SECRET di environment
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, decode) => {
      if (error) return res.sendStatus(403);
      const accessToken = jwt.sign({ id, name, email, role, confirmed }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "40s",
      });
      res.json({ accessToken });
    });
  } catch (err) {
    console.log(err);
  }
};
