// src/routes/AuthGuard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UnauthorizedModal from "../components/UnauthorizedModal";

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [checked, setChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("Access-Token");
    if (token) {
      setAuthorized(true);
      setShowModal(false);
    } else {
      setAuthorized(false);
      setShowModal(true);
    }
    setChecked(true);
  }, []);

  const handleClose = () => setShowModal(false);
  const handleLogin = () => navigate("/", { replace: true });

  if (!checked) return null;

  return (
    <>
      {authorized ? children : null}
      {showModal && <UnauthorizedModal onLogin={handleLogin} onClose={handleClose} />}
    </>
  );
};

export default AuthGuard;
