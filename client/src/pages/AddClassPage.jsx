import React, { useEffect } from "react";
import Layout from "./Layout";
import axios from "axios";
import FormAddClass from "../components/FormAddClass";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "../features/authSlice";
import { verifyToken } from "../features/tokenSlice";

const AddClass = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isError } = useSelector((state) => state.auth);
  const { token, expireAccess, isError: isErrorToken } = useSelector((state) => state.token);

  useEffect(() => {
    dispatch(getMe());
    dispatch(verifyToken());
  }, [dispatch]);

  useEffect(() => {
    if (isError || isErrorToken) {
      navigate("/");
    }
  }, [navigate, isError]);
  const axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expireAccess * 1000 < currentDate.getTime()) {
        dispatch(verifyToken());
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return (
    <Layout>
      <FormAddClass />
    </Layout>
  );
};

export default AddClass;
