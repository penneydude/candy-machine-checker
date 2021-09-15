import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from 'styled-components';

import "./App.css";

let genCm = require("./cm.json");

function App() {
  const [cm, setCm] = useState({});
  const [currItem, setCurrItem] = useState({});
  const [index, setIndex] = useState(0);

  const keyHandler = ({ key }) => {
    if (key === 'ArrowLeft') {
      setIndex(i => i - 1);
    }
    if (key === 'ArrowRight') {
      setIndex(i => i + 1);
    }
  }

  // Get CM config
  useEffect(() => {
    axios
      .get(`CANDY_MACHINE_CONFIG/${genCm["cm"]}`)
      .then(response => setCm(response.data));

    window.addEventListener("keydown", keyHandler);

    return () => {
      window.removeEventListener("keydown", keyHandler);
    };
  }, []);

  const items = cm.items;

  // Get CM item from Arweave
  useEffect(() => {
    if (!items) return;

    axios.get(items[index]?.link).then(response => setCurrItem(response.data));
  }, [index, items]);

  return (
    <div>
      {items && (
        <>
          <div>{Object.keys(items).length}</div>

          <img src={currItem.image} />
        </>
      )}
    </div>
  );
}

export default App;
