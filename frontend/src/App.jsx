import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import LandingPage from "./Pages/LandingPage/LandingPage";
import AppLayout from "./Components/Layout/Applayout";
import Login from "./auth/Login";
import Register from "./auth/Register";
import ConnectGithub from "./auth/ConnectGithub";

import "./App.css";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        theme="dark"
        closeButton
        toastOptions={{
          duration: 3000,
          className: "app-toast",
        }}
      />

      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/connect-github" element={<ConnectGithub/>}/>

        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </>
  );
}

export default App;