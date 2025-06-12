// client/src/pages/Home.jsx

import React, {
    useContext,
    useState
} from 'react'
import Navbar from '../components/Navbar'
import {
    faMagnifyingGlass
} from "@fortawesome/free-solid-svg-icons";
import {
    FontAwesomeIcon
} from "@fortawesome/react-fontawesome";
import useFetch from "../useFetch"
import {
    AuthContext
} from '../authContext';
import '../styles/home.css'
import Card from '../components/Card';

const Home = () => {
    const [query, setQuery] = useState("");
    const { user } = useContext(AuthContext)
    const { data, loading } = useFetch(
        `/entries/author/${user._id}`)

    console.log("Fetched data in Home:", data);

    const keys = ["title", "location", "date", "rating"];

    const search = (data) => {
        return data.filter((item) =>
            keys.some((key) => item[key] &&
                String(item[key]).toLowerCase().includes(query.toLowerCase()))
        );
    };


    return (
        <div>
            <Navbar />
            <div className="search">
                <div className="searchBar">
                    <h2>Explore</h2>
                    <div className="searchInput">
                        <input
                            type="text"
                            placeholder="Search places or dates"
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <FontAwesomeIcon
                            className="icon"
                            icon={faMagnifyingGlass} />
                    </div>
                </div>
            </div>

            <div className="searchedPosts">
                {loading ? (
                    <>
                        <div className="p"
                            style={{
                                color: "white", "fontFamily":
                                    "'Kaushan Script', cursive"
                            }}>
                            Loading...
                        </div>
                    </>
                ) : (
                    <>
                        {search(data)?.map((item, i) => {
                            console.log("Item in map:", item);
                            console.log("Rating value:", item.rating);
                            return (
                                <Card
                                    key={i}
                                    _id={item._id}
                                    photos={item.photos}
                                    title={item.title}
                                    date={item.date}
                                    location={item.location}
                                    text={item.text}
                                    rating={item.rating}
                                />
                            );
                        })}
                    </>
                )}
            </div>
        </div>
    )
}

export default Home