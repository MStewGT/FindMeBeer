import React from 'react';
import { BrowserRouter, Route} from "react-router-dom";
import Home from "./components/Home";
import Breweries from "./components/Breweries";
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Route component={Home} path="/" exact />
        <Route component={Breweries} path="/breweries" />
      </div>
    </BrowserRouter>
  );
}

export default App;
