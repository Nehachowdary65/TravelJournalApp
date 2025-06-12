import React from 'react'
import Navbar from '../components/Navbar'
import useFetch from '../useFetch'
import {
    faCalendar,
    faMapLocationDot,
    faStar
} from "@fortawesome/free-solid-svg-icons";
import {
    useLocation,
    useNavigate
} from "react-router-dom";
import {
    FontAwesomeIcon
} from "@fortawesome/react-fontawesome";
import "../styles/view.css"
import axios from "axios";

const View = () => {
    const location = useLocation();
    const id = location.pathname.split("/")[2];
    const { data } = useFetch(`/entries/${id}`)
    console.log("Fetched data in View:", data);
    console.log("Rating in View:", data?.rating);
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5500/api/entries/${data._id}`)
            navigate('/')
        } catch (err) {
            console.log(err)
        }
    };

    const renderRating = (rating) => {
        console.log("Rendering rating in View:", rating);
        // Convert rating to number and ensure it's between 1-5
        const ratingNum = Math.min(Math.max(Number(rating) || 0, 0), 5);
        const filledStars = ratingNum;
        const emptyStars = 5 - filledStars;

        return (
            <div className="rating-display">
                {[...Array(filledStars)].map((_, i) => (
                    <FontAwesomeIcon key={`filled-${i}`} icon={faStar} className="star filled" />
                ))}
                {[...Array(emptyStars)].map((_, i) => (
                    <FontAwesomeIcon key={`empty-${i}`} icon={faStar} className="star empty" />
                ))}
                <span className="rating-value">({rating}/5)</span>
            </div>
        );
    };

    return (
        <div className='view'>
            <Navbar />
            <div className="postPageBG">
                <div className="upperContent">
                    <h1>{data.title}</h1>
                    <p>
                        Date <FontAwesomeIcon className="icon" icon={faCalendar} />: {data.date}
                    </p>
                    <p>
                        Location <FontAwesomeIcon className="icon" icon={faMapLocationDot} />: {data.location}
                    </p>
                    {data.rating > 0 && (
                        <p>
                            Rating:{renderRating(data.rating)}
                        </p>
                    )}
                </div>
            </div>

            <div className="postContainer">
                <div className="leftContainer">
                    {data.photos ? (
                        <div className="images">
                            <img 
                                src={data.photos[0]} 
                                height="200px" 
                                alt="Uploaded" 
                            />
                        </div>
                    ) : (
                        "No Images"
                    )}
                </div>

                <div className="rightContainer">
                    <p>" {data.text} "</p>
                    <div className="button-group">
                        <button className="edit_button" onClick={() => navigate(`/edit/${data._id}`)}>
                            Edit
                        </button>
                        <button className="del_button" onClick={handleDelete}>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default View;
