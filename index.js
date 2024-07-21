import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import FileUpload from "express-fileupload";
import UserRoute from "./route/UserRoute.js";
import AuthRoute from "./route/AuthRoute.js";
import ClassRoute from "./route/ClassRoute.js";
import ResourceRoute from "./route/ResourceRoute.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import connect from "./config/Database.js";
import path from "path";

dotenv.config();

const app = express();
const connectMongo = async () => {
  await connect();
};
connectMongo();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      secure: "auto",
      maxAge: 86400000,
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO,
      touchAfter: 24 * 3600,
    }),
  })
);

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cors({ credentials: true, origin: "https://eager-rose-pronghorn.cyclic.cloud" }));
app.use(express.json());
app.use(cookieParser());
app.use(FileUpload());

app.use(UserRoute);
app.use(AuthRoute);
app.use(ClassRoute);
app.use(ResourceRoute);

// membuat folder public menjadi static
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "./public")));
app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", function (_, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"), function (err) {
    res.status(500).send(err);
  });
});
// app.get("/*", function (req, res) {
//   res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
// });

app.listen(process.env.PORT, () => {
  console.log(`Server running in port ${process.env.PORT}`);
});
