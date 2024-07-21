import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import { domain } from "../config/domain";

const UserList = () => {
  const currentURL = window.location.href;
  const pathname = new URL(currentURL).pathname;
  const pathParts = pathname.split("/");
  const parameter = pathParts[pathParts.length - 1];

  const [response, setResponse] = useState([]);

  useEffect(() => {
    const getUserByRole = async () => {
      const res = await axios.get(`${domain}/users/${parameter}`);
      setResponse(res.data);
    };
    getUserByRole();
  }, [parameter]);

  return (
    <div>
      <Link to="/register">Tambah {parameter === "teacher" ? "Guru" : "Murid"}</Link>
      <h1>List {parameter === "teacher" ? "Guru" : "Murid"}</h1>
      <ul>
        {response.map((user, index) => (
          <li key={index + 1}>
            <Link to={`/user/${parameter}/${user._id}`}>
              <h2>{user.name}</h2>
              <h3>{user.role}</h3>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
