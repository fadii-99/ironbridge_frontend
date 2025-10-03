// src/routes/AuthGuard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UnauthorizedModal from "../components/UnauthorizedModal";

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [checked, setChecked] = useState(false); // wait until we check token
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("Access-Token");
    if (token) {
      setAuthorized(true);
      setChecked(true);
      setShowModal(false);
    } else {
      setAuthorized(false);
      setChecked(true);
      setShowModal(true);
    }
  }, []);

  // Optional: close just keeps them on a dimmed page (no content)
  const handleClose = () => setShowModal(false);
  const handleLogin = () => navigate("/", { replace: true });

  if (!checked) return null; // or a tiny inline loader if you prefer

  return (
    <>
      {authorized ? children : null}
      {showModal && (
        <UnauthorizedModal onLogin={handleLogin} onClose={handleClose} />
      )}
    </>
  );
};

export default AuthGuard;
