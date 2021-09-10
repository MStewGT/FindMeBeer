import React from "react";
import { useState, useCallback } from "react";
import { Header } from "./Header";
import "rsuite/dist/styles/rsuite-default.css";
import { Alert } from "rsuite";

function formatPhoneNumber(phoneNumberString) {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3]
  }
  return null
}

function App() {
  const [locData, setLocData] = useState("");
  const [brewData, setBrewData] = useState([]);

  const onLocChange = useCallback((event) => {
    console.log(event.target.value);
    setLocData(event.target.value);
  }, []);

  const formSubmitted = useCallback(
    (event) => {
      event.preventDefault();
      console.log("Form was submitted!");
      console.log(locData);
      getBreweries(locData);
    },
    [locData]
  );

  const clearOnInputClick = () => {
    setLocData("");
  };

  function getBreweries(location) {
    const transformedLocation = location.split(" ").join("_");
    fetchBrew();
    async function fetchBrew() {
      const res = await fetch(
        `https://api.openbrewerydb.org/breweries?by_city=${transformedLocation}`
      );
      const data = await res.json();

      //Sorting function
      data.sort((a, b) => {
        var nameA = a.name.toLowerCase(),
          nameB = b.name.toLowerCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });

      setBrewData(data);
      console.log(data);

      if (data.length === 0) {
        Alert.error("Sorry, no result for your location.", 5000);
      }
    }
  }

  return (
    <>
      <Header>
        <form className="search" onSubmit={formSubmitted}>
          <input
            type="search"
            className="formInput"
            placeholder="Search by City Name"
            value={locData}
            onChange={onLocChange}
            onClick={clearOnInputClick}
          />
          <button className="btn primary inside">GO</button>
        </form>
      </Header>
      <div className="list">
        {brewData.map((brewery) => (
          <div key={brewery.id} className="card">
            <h4 className="title">{brewery.name}</h4>
            <div className="info">
              {brewery.street}
              <br></br>
              {brewery.city}, {brewery.state} {brewery.postal_code}
              <br></br>
              {formatPhoneNumber(brewery.phone)}
              <br></br>
              <br></br>
            </div>
            {brewery.website_url != null && (
              <a href={brewery.website_url} className="link">
                Website
              </a>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
