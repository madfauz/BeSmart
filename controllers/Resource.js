//http://localhost:5000/images_default/login.png
import connect from "../config/Database.js";
import mongoose, { mongo } from "mongoose";
import Resource from "../models/ResourceModel.js";

export const createImage = async (req, res) => {
  const { url } = req.body;
  const newResource = new Resource({
    url: url,
  });
  await newResource.save();
};

export const getLoginImage = async (req, res) => {
  const image = await Resource.findOne({
    _id: "64eb36a04f00d7ab6e52ede9",
  });

  res.json({ image });
};

export const getRegisterImage = async (req, res) => {
  const image = await Resource.findOne({
    _id: "6620ac2adeb0815b2ca433c7",
  });

  res.json({ image });
};

export const getClassImage = async (req, res) => {
  const image = await Resource.findOne({
    _id: "64eb4d6a0b8ca6b45cc0453f",
  });

  res.json({ image });
};
