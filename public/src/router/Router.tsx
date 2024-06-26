import { FC, memo } from "react";
import { Route, Routes } from "react-router-dom";
import { Home } from "../components/pages/Home";
import { Login } from "../components/pages/Login";
import { Register } from "../components/pages/Register";
import { AuthProvider } from "../components/providers/LoginUserProvider";

export const Router:FC = memo(() => {
    return (
       <AuthProvider>
        <Routes>
         <Route path="/" element={<Login />} />
         <Route path="register" element={<Register />} />
         <Route path="home" element={< Home/>}  />
        </Routes>
        </AuthProvider>
    )
  });