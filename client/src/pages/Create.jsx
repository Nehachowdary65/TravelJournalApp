// client/src/pages/Create.jsx

import React, { useContext, useState } from 'react'
import axios from "axios"
import { AuthContext } from '../authContext';
import "../styles/create.css"
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Create = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [file, setFile] = useState(null);
    const [info, setInfo] = useState({
        title: "",
        location: "",
        date: "",
        text: "",
        rating: ""
    });
    const [isUploading, setIsUploading] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        console.log(`Handling change for ${id}:`, value);
        setInfo(prev => {
            const newInfo = { ...prev, [id]: value };
            console.log("Updated info state:", newInfo);
            return newInfo;
        });
    }

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            
            // Validate file type
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(selectedFile.type)) {
                alert("Please select only image files (JPEG, PNG, GIF, WEBP)");
                e.target.value = null;
                return;
            }

            setFile(selectedFile);
        }
    }

    const handleClick = async (e) => {
        e.preventDefault();
        
        if (!file) {
            alert("Please select an image");
            return;
        }

        if (!info.title || !info.location || !info.date || !info.text || !info.rating) {
            alert("Please fill in all required fields including rating");
            return;
        }

        try {
            setIsUploading(true);
            console.log("Current info state before upload:", info);
            
            // Upload the image
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "upload");
            
            const uploadRes = await axios.post(
                "https://api.cloudinary.com/v1_1/dmxzcafrn/image/upload",
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            // Create the entry with the image URL and rating
            const newEntry = {
                ...info,
                author: user._id,
                photos: [uploadRes.data.url],
                rating: Number(info.rating) // Ensure rating is a number
            };

            console.log("Sending entry data:", newEntry);

            const response = await axios.post(
                'http://localhost:5500/api/entries/',
                newEntry,
                { withCredentials: true }
            );

            console.log("Server response:", response.data);
            navigate(`/view/${response?.data?._id}`);
        } catch (err) {
            console.error("Error in upload process:", err);
            if (err.response?.data?.message) {
                alert(err.response.data.message);
            } else {
                alert("Failed to create entry. Please try again and ensure all fields are filled.");
            }
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <div className='create'>
            <Navbar />
            <div className="createContainer">
                <div className="picsContainer">
                    <div className="formInput">
                        <h2>Upload Image</h2>
                        <label htmlFor="file">
                            <FontAwesomeIcon
                                className="icon" 
                                icon={faPlusCircle}
                                style={{ cursor: 'pointer' }}
                            />
                        </label>
                        <input
                            type="file"
                            id="file"
                            name="file"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                            accept="image/jpeg,image/png,image/gif,image/webp"
                        />
                    </div>
                    <div className="uploadedPictures">
                        {file && (
                            <div className="image-container">
                                <img 
                                    src={URL.createObjectURL(file)} 
                                    alt="Upload preview" 
                                    height="200px"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="input">
                    <label htmlFor="title">Title <span className="required">*</span></label>
                    <input
                        onChange={handleChange}
                        type="text"
                        id="title"
                        placeholder="Enter Title"
                        required
                    />
                </div>
                <div className="input">
                    <label htmlFor="location">Location <span className="required">*</span></label>
                    <input
                        onChange={handleChange}
                        type="text"
                        id="location"
                        placeholder="Enter Location"
                        required
                    />
                </div>

                <div className="input">
                    <label htmlFor="date">Date <span className="required">*</span></label>
                    <input
                        onChange={handleChange}
                        type="date"
                        id="date"
                        placeholder="Choose Date"
                        required
                    />
                </div>
                <div className="input">
                    <h1>Select the rating <span className="required">*</span></h1>
                    <select 
                        id="rating" 
                        onChange={handleChange}
                        value={info.rating}
                        required
                    >
                        <option value="">Select Rating</option>
                        <option value="1">1 - 😞</option>
                        <option value="2">2 - 😐</option>
                        <option value="3">3 - 🙂</option>
                        <option value="4">4 - 😃</option>
                        <option value="5">5 - 🤩</option>
                    </select>
                </div>
                <div className="input">
                    <label htmlFor="text">Write your thoughts.. <span className="required">*</span></label>
                    <textarea
                        name='text'
                        id='text'
                        cols="150"
                        rows='25'
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>

                <button 
                    className='createBtn' 
                    onClick={handleClick}
                    disabled={isUploading}
                >
                    {isUploading ? 'Uploading...' : 'Create Entry'}
                </button>
            </div>
        </div>
    )
}

export default Create;