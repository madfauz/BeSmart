import React, { useEffect } from "react";
import Layout from "./Layout";
import UserList from "../components/UserList";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "../features/authSlice";

const Users = () => {
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
      <UserList />
    </Layout>
  );
};

export default Users;
