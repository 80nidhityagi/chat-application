import { useFormik } from "formik";
import * as Yup from 'yup';
import axios from 'axios';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css"; // Import the CSS file for styling
import "./Login" 
import Login from "./Login";

export default function Signup() {
    const nav = useNavigate();
    const [errorMessage,setErrorMessage] = useState('');
    const url = 'https://chat-application-wrb2.onrender.com';

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            image: null,
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .max(20, "Name must be less than or equal to 20 characters")
                .required("Name is required"),
            email: Yup.string()
                .email("Email must be valid")
                .required("Email is required"),
            password: Yup.string()
                .max(8, "Password must be a maximum of 8 characters")
                .min(6, "Minimum 6 characters")
                .required("Password is required"),
        }),

        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("email", values.email);
            formData.append("password", values.password);
            formData.append("image", values.image);

            try {
                const result = await axios.post(url+"/signup", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                
                (result);
                if (result.data.succes) {
                    nav("/");
                }
                else{
                    setErrorMessage(result.data.message)
                }
            } catch (error) {
                console.error("Error during signup:", error);
            }
        },
    });

    return (
        <div className="signup-container">
            <h2>Sign Up</h2>
            <form onSubmit={formik.handleSubmit} className="signup-form">
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                    />
                    {formik.touched.name && formik.errors.name && (
                        <p className="error">{formik.errors.name}</p>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <p className="error">{formik.errors.email}</p>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                    />
                    {formik.touched.password && formik.errors.password && (
                        <p className="error">{formik.errors.password}</p>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="image">Profile Photo</label>
                    <input
                        type="file"
                        name="image"
                        onChange={(event) => {
                            formik.setFieldValue("image", event.currentTarget.files[0]);
                            (event.currentTarget.files[0]);
                            
                        }}
                    />
                </div>

                <button type="submit" className="signup-button">Sign Up</button>
                <p >Already have an  account <Link to="/Login" className="link-hover-underline">Login</Link></p>
            </form>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        </div>
    );
}
