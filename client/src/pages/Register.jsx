// client/src/pages/Register.jsx

import React from "react";
import Navbar from "../components/Navbar";
import "../styles/register.css";
import {
    faPlusCircle
} from "@fortawesome/free-solid-svg-icons";
import {
    FontAwesomeIcon
} from "@fortawesome/react-fontawesome";
import {
    Link
} from "react-router-dom";
import {
    useState
} from "react";
import {
    useNavigate
} from "react-router-dom";
import axios from "axios";

function Register() {
    const navigate = useNavigate();

    const [files, setFiles] = useState([]);
    const [info, setInfo] = useState({});
    const [imageDescriptions, setImageDescriptions] = useState([]);

    const handleChange = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length > 3) {
            alert("You can only upload up to 3 images");
            return;
        }
        setFiles(selectedFiles);
        setImageDescriptions(new Array(selectedFiles.length).fill(""));
    };

    const handleDescriptionChange = (index, value) => {
        const newDescriptions = [...imageDescriptions];
        newDescriptions[index] = value;
        setImageDescriptions(newDescriptions);
    };

    const handleClick = async (e) => {
        e.preventDefault();

        if (files.length > 0) {
            try {
                const uploadPromises = files.map(async (file, index) => {
                    const data = new FormData();
                    data.append("file", file);
                    data.append("upload_preset", "upload");

                    const uploadRes = await axios.post(
                        "https://api.cloudinary.com/v1_1/<your_cloudinary_key>/image/upload",
                        data,
                        {
                            withCredentials: false
                        }
                    );

                    return {
                        url: uploadRes.data.url,
                        description: imageDescriptions[index]
                    };
                });

                const uploadedImages = await Promise.all(uploadPromises);

                const newUser = {
                    ...info,
                    images: uploadedImages,
                };

                await axios.post(
                    "http://localhost:5500/api/users/register",
                    newUser,
                    {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );

                navigate("/login");
            } catch (err) {
                console.error("Registration error:", err);
                alert(err.response?.data?.message || "Registration failed");
            }
        } else {
            try {
                await axios.post(
                    "http://localhost:5500/api/users/register",
                    info,
                    {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );

                navigate("/login");
            } catch (err) {
                console.error("Registration error:", err);
                alert(err.response?.data?.message || "Registration failed");
            }
        }
    };

    return (
        <div className="register">
            <Navbar />
            <div className="registerCard">
                <div className="center">
                    <h1>Join Us</h1>

                    <form>
                        <div className="image">
                            <div className="image-preview-container">
                                {files.length > 0 ? (
                                    files.map((file, index) => (
                                        <div key={index} className="image-preview-item">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`Preview ${index + 1}`}
                                                height="100px"
                                            />
                                            <textarea
                                                placeholder={`Description for image ${index + 1}`}
                                                value={imageDescriptions[index]}
                                                onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                                className="image-description"
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <img
                                        src="https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                                        alt="no content"
                                        height="100px"
                                    />
                                )}
                            </div>

                            <div className="txt_field_img">
                                <label htmlFor="file">
                                    Images 
                                    <FontAwesomeIcon className="icon" icon={faPlusCircle} />
                                </label>
                                <input
                                    type="file"
                                    id="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: "none" }}
                                />
                            </div>
                        </div>

                        <div className="formInput">
                            <div className="txt_field">
                                <input
                                    type="text"
                                    placeholder="username"
                                    name="username"
                                    onChange={handleChange}
                                    id="username"
                                    required
                                />
                            </div>
                            <div className="txt_field">
                                <input
                                    type="email"
                                    placeholder="email"
                                    name="email"
                                    onChange={handleChange}
                                    id="email"
                                    required
                                />
                            </div>
                            <div className="txt_field">
                                <input
                                    type="password"
                                    placeholder="password"
                                    name="password"
                                    onChange={handleChange}
                                    id="password"
                                    required
                                />
                            </div>
                        </div>
                        <div className="login_button">
                            <button className="button" onClick={handleClick}>
                                Register
                            </button>
                        </div>
                        <div className="signup_link">
                            <p>
                                Already Registered?
                                <Link to="/login">Login</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;