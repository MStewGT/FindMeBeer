import React from "react";
import { useState, useEffect, useCallback } from "react";
import { Header } from "./Header";
import "rsuite/dist/styles/rsuite-default.css";
import { Alert } from "rsuite";

function formatPhoneNumber(phoneNumberString) {
  var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return null;
}

function App() {
  const [locData, setLocData] = useState("");
  const [brewData, setBrewData] = useState([]);

  useEffect(() => {
    getBreweries("");
  }, []);

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
  function getbreweryTypeClass(brewery) {
    switch (brewery.brewery_type) {
      case "closed":
        return "p-close";
      default:
        return "";
    }
  }

  function getbreweryTypeText(brewery) {
    switch (brewery.brewery_type) {
      case "closed":
        return <span className="p-close-text">Permanently Closed</span>;
      default:
        return "";
    }
  }

  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "main dark-mode" : "main light-mode"}>
      <Header>
        <div class="inputBtn">
          <div className="left"></div>
          <div className="center">
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
          </div>
          <div className="right">
            <div className="container">
              <span style={{ color: darkMode ? "grey" : "yellow" }}>☀︎</span>
              <div className="switch-checkbox">
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={() => setDarkMode(!darkMode)}
                  />
                  <span className="slider round"> </span>
                </label>
              </div>
              <span style={{ color: darkMode ? "#c96dfd" : "grey" }}>☽</span>
            </div>
          </div>
        </div>
      </Header>
      <div className="content">
        <div className="list">
          {brewData.map((brewery) => (
            <div
              key={brewery.id}
              className={`card ${getbreweryTypeClass(
                brewery
              )}  align-items-center`}
            >
              {getbreweryTypeText(brewery) && getbreweryTypeText(brewery)}
              <h4
                className="title"
                style={{ color: darkMode ? "white" : "black" }}
              >
                {brewery.name}
              </h4>
              <div
                className="info"
                style={{ color: darkMode ? "white" : "#333" }}
              >
                {brewery.street}
                <br></br>
                {brewery.city}, {brewery.state} {brewery.postal_code}
                <br></br>
                {formatPhoneNumber(brewery.phone)}
                <br></br>
                <br></br>
              </div>
              {brewery.website_url != null && (
                <a
                  href={brewery.website_url}
                  className="button"
                  style={{
                    backgroundColor: darkMode ? "#cc8d08" : "#cc8d08",
                    color: darkMode ? "white" : "black"
                  }}
                >
                  Website
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
