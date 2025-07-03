import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./Login.css"; // Assuming you're adding a separate CSS file
import ForgotPassword from "./ForgotPassword";

export default function Login() {
  const navigate = useNavigate();
  const url = 'http://localhost:3000';


  useEffect(() => {
    async function checkToken() {
      ("checktoken called");
      
      if (localStorage.getItem("token")) {
        try {
          ("inside try");
          
          const result = await axios.get(url+"/user/profile", {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          });
          if (result.data.user) {
            navigate("/Home");
          } else {
            navigate("/Login");
          }
        } catch (error) {
          console.error("Error validating token", error);
        }
      }
    }
    checkToken();
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Email must be valid")
        .required("Email is a required field"),
      password: Yup.string()
        .min(6, "Minimum 6 characters")
        .max(8, "Password must be maximum 8 characters")
        .required("Password is a required field"),
    }),
    onSubmit: async (values) => {
      try {
        const result = await axios.post(url+"/login", values);

        if (result.data.succes===false) {
          toast.error("Username or password is incorrect");
        } else {
          if (!localStorage.getItem("token")) {
            localStorage.setItem("userId", result.data.data._id);
            localStorage.setItem("token", result.data.token);
          }
          toast.success("Login successful!");
          navigate("/Home");
        }
      } catch (error) {
        toast.error("An error occurred during login");
        console.error("Login error", error);
      }
    },
  });

  return (
    <div className="login-container">
      <ToastContainer />
      <form className="login-form" onSubmit={formik.handleSubmit}>
        <h2>Login</h2>

        <input
          type="text"
          name="email"
          placeholder="Enter your email"
          className={formik.errors.email && formik.touched.email ? "error" : ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email && (
          <p className="error-message">{formik.errors.email}</p>
        )}

        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          className={
            formik.errors.password && formik.touched.password ? "error" : ""
          }
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password && (
          <p className="error-message">{formik.errors.password}</p>
        )}

        <button type="submit">Login</button>
           <p><Link to='/ForgotPassword'>Forgot password</Link></p>
        <p>
          Create a new account <Link to="/signup">Signup</Link>
        </p>
      </form>
    </div>
  );
}
