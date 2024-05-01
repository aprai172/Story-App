import React, { useState } from "react";
import ModalContainer from "../ModalContainer/ModalContainer";
import styles from "./signInModal.module.css";
import passwordIcon from "../../assets/passwordIcon.png";
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const SignInModal = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsProcessing(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/auth/login`,
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.status === 200) {
        const errorData = response.data;
        throw new Error(errorData.message);
      }
  
      const responseData = response.data;
      window.localStorage.setItem("token", responseData.token);
      window.localStorage.setItem("userId", responseData.userId);
      window.localStorage.setItem("username", responseData.username);

  
      setTimeout(() => {
        window.location.href = "/";
      }, 1200);
      toast.success("Login successful!");
  
    } catch (error) {
      setError(error.message);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  

  return (
    <>
    <ModalContainer>
     <ToastContainer />
      
        

        <>
          <h1 className={styles.formHeader}>Login to SwipTory</h1>
          <form className={styles.formContainer}>
            <div>
              <label>Username</label>
              <input
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="Enter username"
              />
            </div>
            <div className={styles.passwordContainer}>
              <label>Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className={styles.passwordInput}
              />
              <img
                onClick={() => setShowPassword(!showPassword)}
                className={styles.passwordIcon}
                src={passwordIcon}
                alt="password icon"
              />
            </div>
            {error && <div className={styles.error}>{error}</div>}
            <div>
              <button onClick={handleSubmit}>Login</button>
            </div>
            {isProcessing && (
              <div className={styles.formHeader}>Processing...</div>
            )}
          </form>
        </>

    </ModalContainer>
    </>
  );
};

export default SignInModal;
