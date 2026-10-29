import { useState } from "react";
import { exit } from "@tauri-apps/api/app";
import Lobby from "./Lobby.jsx";
import "./App.css";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [lobbyStarted, setLobbyStarted] = useState(false);

  const handleQuit = () => {
    exit(0);
  };

  const handleLobby = () => {
    setLobbyStarted(true);
  };

  const handleStartGame = () => {
    setGameStarted(true);
    setLobbyStarted(false);
  };

  const handleBack = () => {
    setLobbyStarted(false);
  };

  return (
    <main className="container">
      {!gameStarted && !lobbyStarted ? (
        <div className="menu">
          <h1>Arena Ball</h1>
          <button className="btn" onClick={handleLobby}>
            Lobby
          </button>
          <button className="btn" onClick={handleQuit}>
            Quit
          </button>
        </div>
      ) : lobbyStarted ? (
        <Lobby onStart={handleStartGame} onBack={handleBack} />
      ) : (
        <div className="game">
          <h2>Match In Progress</h2>
          <p>(Game logic yet to be implemented.)</p>
        </div>
      )}
    </main>
  );
}

export default App;



