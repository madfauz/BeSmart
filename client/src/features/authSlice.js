import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { domain } from "../config/domain";

const initialState = {
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// melakukan request ke method login
export const LoginUser = createAsyncThunk("user-slice/LoginUser", async (user, thunkAPI) => {
  try {
    const response = await axios.post(`${domain}/login`, {
      email: user.email,
      password: user.password,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      // ambil pesan error lewat msg dari backend
      const message = error.response.data.msg;
      return thunkAPI.rejectWithValue(message);
    }
  }
});

export const getMe = createAsyncThunk("user-slice/getMe", async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${domain}/info-user-login`);
    return response.data;
  } catch (error) {
    if (error.response) {
      // ambil pesan error lewat msg dari backend
      const message = error.response.data.msg;
      return thunkAPI.rejectWithValue(message);
    }
  }
});

export const LogOut = createAsyncThunk("user-slice/LogOut", async () => {
  await axios.delete(`${domain}/logout`);
});

export const authSlice = createSlice({
  name: "auth-slice",
  initialState,
  // mereset value di initialState
  reducers: {
    reset: (state) => initialState,
  },
  // untuk menghandle createAsyncThunk
  extraReducers: (builder) => {
    builder.addCase(LoginUser.pending, (state) => {
      // saat pending set loading jadi true
      state.isLoading = true;
    });
    builder.addCase(LoginUser.fulfilled, (state, action) => {
      // saat berhasil set loading jadi false
      state.isLoading = false;
      state.isSuccess = true;
      // mengambil data untuk state.user dari action.payload yang di return dari hasil LoginUser return response.data
      state.user = action.payload;
    });
    builder.addCase(LoginUser.rejected, (state, action) => {
      // saat terjadi error
      state.isLoading = false;
      state.isError = true;
      // mengambil message error untuk state.message dari action.payload yang di return dari hasil LoginUser return thunkAPI.rejectWithValue(message);
      state.message = action.payload;
    });

    // Get User Login

    builder.addCase(getMe.pending, (state) => {
      // saat pending set loading jadi true
      state.isLoading = true;
    });
    builder.addCase(getMe.fulfilled, (state, action) => {
      // saat berhasil set loading jadi false
      state.isLoading = false;
      state.isSuccess = true;
      // mengambil data untuk state.user dari action.payload yang di return dari hasil getMe return response.data
      state.user = action.payload;
    });
    builder.addCase(getMe.rejected, (state, action) => {
      // saat terjadi error
      state.isLoading = false;
      state.isError = true;
      // mengambil message error untuk state.message dari action.payload yang di return dari hasil getMe return thunkAPI.rejectWithValue(message);
      state.message = action.payload;
    });
  },
});

// mengexport function reset dari variabel authSlice sebagai action
export const { reset } = authSlice.actions;
export default authSlice.reducer;
