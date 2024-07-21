import { BrowserRouter, Route, Routes } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AddUserPage from "./pages/AddUserPage";
import ClassListPage from "./pages/ClassListPage";
import AddClassPage from "./pages/AddClassPage";
import VerifyClassPage from "./pages/VerifyClassPage";
import SingleClassPage from "./pages/SingleClassPage";
import Users from "./pages/Users";
import SettingPage from "./pages/SettingPage";
import AddMaterialPage from "./pages/AddMaterialPage";
import EditMaterialPage from "./pages/EditMaterialPage";
import HelpPage from "./pages/HelpPage";
import EditClassPage from "./pages/EditClassPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<AddUserPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/class" element={<ClassListPage />} />
        <Route path="/class/add" element={<AddClassPage />} />
        <Route path="/class/:id/edit" element={<EditClassPage />} />
        <Route path="/class/:id/verification" element={<VerifyClassPage />} />
        <Route path="/class/:id" element={<SingleClassPage />} />
        <Route path="/class/:id/addMaterial" element={<AddMaterialPage />} />
        <Route path="/class/:id/editMaterial" element={<EditMaterialPage />}></Route>
        <Route path="/user/:role" element={<Users />} />
        <Route path="/setting" element={<SettingPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
