import React, { useState, useEffect } from 'react'
import axios from "axios"
import "../styles/create.css"
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { faPlusCircle, faCircleArrowLeft, faCircleArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useFetch from '../useFetch';

const Edit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [files, setFiles] = useState([]);
    const [info, setInfo] = useState({});
    const { data } = useFetch(`/entries/${id}`);
    const [slideNumber, setSlideNumber] = useState(0);

    useEffect(() => {
        if (data) {
            console.log("Data in Edit useEffect:", data);
            console.log("Rating in data:", data.rating);
            setInfo({
                title: data.title,
                location: data.location,
                date: data.date,
                text: data.text,
                rating: data.rating || ""
            });
        }
    }, [data]);

    const handleChange = (e) => {
        console.log("Input changed:", e.target.id, e.target.value);
        setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
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

            setFiles([selectedFile]); // Store as single-item array to maintain compatibility
            setSlideNumber(0);
        }
    }

    const handleMove = (direction) => {
        let newSlideNumber;
        let size = files.length || (data?.photos?.length || 0);
        if (direction === "l") {
            newSlideNumber = slideNumber === 0 ? size - 1 : slideNumber - 1;
        } else {
            newSlideNumber = slideNumber === size - 1 ? 0 : slideNumber + 1;
        }
        setSlideNumber(newSlideNumber);
    }

    const handleClick = async (e) => {
        e.preventDefault();

        try {
            let updatedEntry = {
                ...info
            };
            console.log("Updating entry with data:", updatedEntry); // Log update data

            // Only handle photo upload if new files are selected
            if (files.length > 0) {
                const list = await Promise.all(
                    files.map(async (file) => {
                        const data = new FormData();
                        data.append("file", file);
                        data.append("upload_preset", "upload");
                        const uploadRes = await axios.post(
                            "https://api.cloudinary.com/v1_1/dmxzcafrn/image/upload",
                            data,
                            { withCredentials: false }
                        );
                        const { url } = uploadRes.data;
                        return url;
                    })
                );
                updatedEntry.photos = list;
            } else {
                // Keep existing photos if no new files are uploaded
                updatedEntry.photos = data.photos;
            }

            console.log("Final update data:", updatedEntry); // Log final update data

            // Update the entry
            const response = await axios.put(
                `http://localhost:5500/api/entries/${id}`,
                updatedEntry,
                { withCredentials: true }
            );

            console.log("Update response:", response.data); // Log response
            navigate(`/view/${id}`);
        } catch (err) {
            console.error("Error updating entry:", err);
            if (err.message.includes('upload')) {
                alert("Failed to upload new images");
            } else {
                alert("Failed to update entry");
            }
        }
    }

    return (
        <div className='create'>
            <Navbar />
            <div className="createContainer">
                <div className="picsContainer">
                    <div className="formInput">
                        <h2>Upload New Image</h2>
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
                        {files.length > 0 ? (
                            <div className="images">
                                <img 
                                    src={files[slideNumber] ? URL.createObjectURL(files[slideNumber]) : ""} 
                                    alt="" 
                                    height="300px" 
                                />
                                <div className="image-count">
                                    Image {slideNumber + 1} of {files.length}
                                </div>
                                {files.length > 1 && (
                                    <div className="arrows">
                                        <FontAwesomeIcon
                                            icon={faCircleArrowLeft}
                                            className="arrow"
                                            onClick={() => handleMove("l")}
                                        />
                                        <FontAwesomeIcon
                                            icon={faCircleArrowRight}
                                            className="arrow"
                                            onClick={() => handleMove("r")}
                                        />
                                    </div>
                                )}
                            </div>
                        ) : (
                            data?.photos && (
                                <div className="images">
                                    <img 
                                        src={data.photos[slideNumber]} 
                                        alt="" 
                                        height="300px" 
                                    />
                                    <div className="image-count">
                                        Image {slideNumber + 1} of {data.photos.length}
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>

                <div className="input">
                    <label htmlFor="title">Title</label>
                    <input
                        onChange={handleChange}
                        type="text"
                        id="title"
                        value={info.title || ""}
                        placeholder="Enter Title"
                    />
                </div>
                <div className="input">
                    <label htmlFor="location">Location</label>
                    <input
                        onChange={handleChange}
                        type="text"
                        id="location"
                        value={info.location || ""}
                        placeholder="Enter Location"
                    />
                </div>

                <div className="input">
                    <label htmlFor="date">Date</label>
                    <input
                        onChange={handleChange}
                        type="date"
                        id="date"
                        value={info.date || ""}
                        placeholder="Choose Date"
                    />
                </div>
                <div className="input">
                    <h1>Select the rating</h1>
                    <select 
                        id="rating" 
                        onChange={handleChange}
                        value={info.rating || ""}
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
                    <label htmlFor="text">Write your thoughts..</label>
                    <textarea
                        name='text'
                        id='text'
                        cols="150"
                        rows='25'
                        value={info.text || ""}
                        onChange={handleChange}
                    ></textarea>
                </div>

                <button className='createBtn' onClick={handleClick}>
                    Update Entry
                </button>
            </div>
        </div>
    )
}

export default Edit; 