import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styled, { createGlobalStyle } from 'styled-components';

import "./App.css";

let genCm = require("./cm.json");

// Styled things
const GlobalStyle = createGlobalStyle`
  body {
    color: ${props => (props.darkMode ? '#fff' : '#222')};
    background-color: ${props => (props.darkMode ? '#111' : '#fff')};
  }
`

const TopInfo = styled.div`
  width: 100%;
  height: 72px;
  position: fixed;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-bottom: -72px;
  font-size: 18px;
  z-index: 10;

  & span {
    display: flex;
    flex-flow:row nowrap;
  }

  & input {
    text-align: center;
    border: none;
    border-bottom: 1px solid #000;
    font-size: 18px;
    transition: all 0.2s ease-in-out;
  }

  ${props => props.darkMode && `
    color: #fff;

    & input {
      color: #fff;
      background-color: #111;
      border-bottom-color: #fff;
    }
  `}
`;

const BottomInfo = styled.div`
  width: 100%;
  height: 48px;
  position: fixed;
  bottom: 0;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  margin-top: -48px;
  font-size: 12px;

  & span {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 4px 8px;
  }
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  align-items: center;
`;

const HalfCol = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 100%;

  & img {
    width: 80%;
  }
`;

const PreviewImg = styled.img`
  opacity: 0.2;
  transition: opacity 0.2s ease-in-out;

  ${props => props.imageLoaded && `
    opacity: 1;
  `}
`;

const InfoContainer = styled.div`
  width: 80%;
  padding: 24px;
  border: 1px solid #ccc;
  border-radius: 8px;

  & h1 {
    font-size: 18px;
    font-weight: 500;
  }

  & h2 {
    font-size: 16px;
    font-weight: 400;
  }

  & hr {
    margin: 24px 0;
  }

  & p span {
    background-color: #eee;
    font-size: 12px;
    padding: 2px 4px;
    border-radius: 4px;
    margin-right: 8px;
    transition: all 0.2s ease-out;
  }

  ${props => props.darkMode && `
    & p span {
      background-color: #444;
    }
  `}
`

// Where the meat is
function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [cm, setCm] = useState({});
  const [currItem, setCurrItem] = useState({});
  const [index, setIndex] = useState(0);
  const [textVal, setTextVal] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);

  const cmRef = useRef(cm);

  const keyHandler = ({ key }) => {
    const numItems = cmRef.current?.items ? Object.keys(cmRef.current.items).length : 0;

    if (key === ' ') {
      setDarkMode(d => !d);
    }
    if (key === 'ArrowLeft') {
      setIndex(i => i > 0 ? i - 1 : i);
    }
    if (key === 'ArrowRight') {
      setIndex(i => i < (numItems - 1) ? i + 1 : i);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (e.target?.[0]?.value)
      setIndex(Math.min(parseInt(e.target[0].value, 10) - 1, numItems - 1));
  }

  const handleBlur = (e) => {
    e.preventDefault();

    if (e.target?.value) {}
      setIndex(Math.min(parseInt(e.target.value, 10) - 1, numItems - 1));
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

  useEffect(() => {
    setTextVal(index + 1);
  }, [index]);

  const items = cm.items;
  cmRef.current = cm;

  const numItems = cm?.items ? Object.keys(cm.items).length : 0;

  // Get CM item from Arweave
  useEffect(() => {
    if (!items) return;

    setImageLoaded(false);

    axios.get(items[index]?.link).then(response => setCurrItem(response.data));
  }, [index, items]);

  return (
    <>
      <GlobalStyle darkMode={darkMode} />
      <TopInfo darkMode={darkMode}>
        <span>
          <form onSubmit={(e) => handleSubmit(e)}>
            <input
              type="number"
              value={textVal}
              min={1}
              max={numItems}
              onChange={(e) => setTextVal(Math.max(Math.min(e.target.value, numItems), 0))}
              onBlur={(e) => handleBlur(e)} />
          </form>
          /{numItems}
        </span>
      </TopInfo>

      <Container>
        {items && (
          <>
            <HalfCol>
              <PreviewImg imageLoaded={imageLoaded} src={currItem.image} onLoad={() => setImageLoaded(true)} />
            </HalfCol>

            <HalfCol>
              <InfoContainer darkMode={darkMode}>
                {currItem ? (
                  <>
                    <h1>{currItem.name}</h1>
                    <h2>{currItem.description}</h2>
                    <hr />
                    {currItem.attributes?.map(a => (
                      <p>
                        <span>{a.trait_type}</span>
                        <strong>{a.value}</strong>
                      </p>
                    ))}
                  </>
                ) : (
                  <div>No metadata</div>
                )}

              </InfoContainer>
            </HalfCol>
          </>
        )}
      </Container>

      <BottomInfo>
        <p><span>left</span> – prev</p>
        <p><span>space</span> – light/dark mode</p>
        <p><span>right</span> – next</p>
      </BottomInfo>
    </>
  );
}

export default App;
