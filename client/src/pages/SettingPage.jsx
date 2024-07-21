import React, { useEffect } from "react";
import Layout from "./Layout";
import Setting from "../components/Setting";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "../features/authSlice";

const SettingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isError } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/");
    }
  }, [navigate, isError]);

  return (
    <Layout>
      <Setting />
    </Layout>
  );
};

export default SettingPage;
