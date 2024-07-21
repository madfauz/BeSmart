import { createSlice, createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import { ErrorResponse } from "@remix-run/router";
import axios from "axios";
import { domain } from "../config/domain";

const initialState = {
  status: null,
  classId: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: null,
};

export const checkAccess = createAsyncThunk("user-slice/checkAccess", async (user, thunkAPI) => {
  try {
    const response = await axios.post(`${domain}/classes/access`, {
      user_id: user.userId,
      user_role: user.userRole,
      class_id: user.classId,
      class_name: user.className,
      class_type: user.classType,
    });
    return { msg: response.data.msg, status: response.status, classId: response.data.classId };
  } catch (err) {
    if (err.response) {
      const errorMessage = err.response.data.msg;
      const errorStatus = err.response.status;
      const classId = err.response.data.classId;
      throw thunkAPI.rejectWithValue([errorMessage, errorStatus, classId]);
    } else {
      throw new Error("Terjadi kesalahan pada server");
    }
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(checkAccess.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(checkAccess.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.message = action.payload.msg;
      state.status = action.payload.status;
      state.classId = action.payload.classId;
    });
    builder.addCase(checkAccess.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload[0];
      state.status = action.payload[1];
      state.classId = action.payload[2];
    });
  },
});

// mengexport function reset dari variabel authSlice sebagai action
export const { reset } = authSlice.actions;
export default authSlice.reducer;
