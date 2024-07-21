import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { domain } from "../config/domain";

const initialState = {
  token: null,
  idUserAccess: null,
  nameAccess: null,
  roleAccess: null,
  expireAccess: null,
  isError: false,
  confirmedEmail: true,
  message: "",
};

export const verifyToken = createAsyncThunk("token-slice/verifyToken", async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${domain}/token`);
    return response.data;
  } catch (error) {
    if (error.response) {
      // ambil pesan error lewat msg dari backend
      const message = error.response.data.msg;
      return thunkAPI.rejectWithValue(message);
    }
  }
});

export const tokenSlice = createSlice({
  name: "token-slice",
  initialState,
  reducers: {
    reset: (state) => initialState,
    update: (state, action) => {
      state.token = action.payload.newToken;
      state.nameAccess = action.payload.newName;
      state.roleAccess = action.payload.newRole;
      state.expireAccess = action.payload.newExpire;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(verifyToken.fulfilled, (state, action) => {
      state.isError = false;
      state.token = action.payload?.accessToken;
      const response = JSON.stringify(action.payload);
      const decoded = jwt_decode(response);
      state.idUserAccess = decoded.id;
      state.confirmedEmail = decoded.confirmed;
      state.nameAccess = decoded.name;
      state.roleAccess = decoded.role;
      state.expireAccess = decoded.exp;
    });
    builder.addCase(verifyToken.rejected, (state, action) => {
      state.message = action.payload;
      state.isError = true;
    });
  },
});

export const { reset, update } = tokenSlice.actions;
export default tokenSlice.reducer;
