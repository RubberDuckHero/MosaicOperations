import { useEffect, useState, useCallback } from "react";
import { fetch } from "@tauri-apps/plugin-http";

function Lobby({ onStart, onBack }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [polling, setPolling] = useState(false);

  const getGames = useCallback(async () => {
    try {
      const resp = await fetch(
        "https://meridianframework.sam-morgan-sp1.workers.dev/lobby/list"
      );
      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }
      const data = await resp.json();
      console.log("Lobby data:", data);
      if (data && Array.isArray(data.games)) {
        setGames([...data.games]);
      } else {
        console.warn("Lobby data.games is not an array. Resetting to empty.");
        setGames([]);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    getGames();
  }, [getGames]);

  // Enable polling only when there are games
  useEffect(() => {
    if (games.length > 0 && !polling) {
      setPolling(true);
    }
  }, [games, polling]);

  // Polling effect
  useEffect(() => {
    if (!polling) return;
    const interval = setInterval(() => {
      getGames();
    }, 30000);
    return () => clearInterval(interval);
  }, [polling, getGames]);

  if (loading) return <p>Loading lobby...</p>;
  if (error) return <p>Error loading lobby: {error}</p>;

  return (
    <div>
      <h2>Lobby Screen</h2>
      {games.length > 0 ? (
        <ul>
          {games.map((game) => (
            <li key={game.id || JSON.stringify(game)}>
              {game.name || game.title || JSON.stringify(game)}
            </li>
          ))}
        </ul>
      ) : (
        <p>No active games.</p>
      )}
      <div>
          <button onClick={onStart}>Start New Match</button>
          <button onClick={() => getGames()}>Refresh</button>
          <button onClick={onBack}>Back</button>

      </div>
    </div>
  );
}

export default Lobby;
