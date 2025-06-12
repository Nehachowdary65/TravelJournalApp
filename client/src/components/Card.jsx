// client/src/components/Card.jsx

import React from "react";
import { Link } from "react-router-dom";
import "../styles/card.css";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Card(props) {
    console.log("Card props:", props); // Log all props
    console.log("Rating in Card:", props.rating); // Log rating specifically

    const renderRating = (rating) => {
        console.log("Rendering rating:", rating); // Log rating being rendered
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
        <div className="card">
            <div className="content">
                <div className="image-container">
                    <img 
                        id="post-image" 
                        src={props.photos[0]} 
                        alt="no content" 
                    />
                </div>
                <h4>{props.title}</h4>
                <h6>
                    <span>Date : </span> {props.date}
                </h6>
                <h6>
                    <span>Location : </span> {props.location}
                </h6>
                {props.rating > 0 && (
                    <h6>
                        <span>Rating : </span> {renderRating(props.rating)}
                    </h6>
                )}
                <p>{props.text.slice(0, 60)}...</p>
                <Link to={`view/${props._id}`}>
                    <button>Read More</button>
                </Link>
            </div>
        </div>
    );
}

export default Card;