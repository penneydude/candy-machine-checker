import React, { useState, useEffect } from "react";
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
`

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
  const [imageLoaded, setImageLoaded] = useState(false);

  const keyHandler = ({ key }) => {
    if (key === ' ') {
      setDarkMode(d => !d);
    }
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

    setImageLoaded(false);

    axios.get(items[index]?.link).then(response => setCurrItem(response.data));
  }, [index, items]);

  return (
    <>
      <GlobalStyle darkMode={darkMode} />
      <TopInfo>

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
    </>
  );
}

export default App;
