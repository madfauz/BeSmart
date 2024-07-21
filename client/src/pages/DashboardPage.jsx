import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import Dashboard from "../components/Dashboard";
import ControlledCarousel from "../components/Carousels";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "../features/authSlice";

const DashboardPage = () => {
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
      <ControlledCarousel />
      <Dashboard />
    </Layout>
  );
};

export default DashboardPage;
