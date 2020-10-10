import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Home() {

    const [locData, setLocData] = useState(null);
    useEffect(() => {
        fetchLoc();
        async function fetchLoc() {
            const res = await fetch(
                "http://ip-api.com/json/"
            );
            const location = await res.json();
            setLocData(location);
        }
    }, []);


    if (!locData) return <div>The first step to finding beer is finding you, but you appear to be lost.</div>

    window.topicText = locData.regionName;

    return (
        <div>
            <p>Your location: {window.topicText}</p>
            <br></br>
            <Link to="/breweries">Find Me Beer!</Link>
        </div>
    )
}