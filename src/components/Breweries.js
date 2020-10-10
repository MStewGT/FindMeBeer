import React from "react";
import { useState, useEffect } from "react";

export default function Breweries() {

    const [brewData, setBrewData] = useState(null);
    useEffect(() => {
        fetchBrew();
        async function fetchBrew() {
            const res = await fetch(
                `https://api.openbrewerydb.org/breweries?by_state=${window.topicText}`
            );
            const data = await res.json();
            setBrewData(data);
            console.log(data);
        }
    }, []);

    if (!brewData) return <div />;

    return(
        <div>
            <ul>
                {brewData.map((brewery, index) => (
                    <li key={brewery.id}>
                        <h4>{brewery.name}</h4>
                        City: {brewery.city}
                        <br></br>
                        Website: <a href={brewery.website_url}>{brewery.website_url}</a> 
                    </li>
                ))}
            </ul>
        </div>
    )
}