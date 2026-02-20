import { useNavigate } from "react-router-dom";
import { useState } from "react";
import math from "./images/math.png";
import wordScramble from "./images/wordScramble.png";
import memory from "./images/memory.png";
import logout from "./images/logout.png";
import clear from "./images/clear.png";


export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [history, setHistory] = useState( JSON.parse(localStorage.getItem("history") || "[]") );

  const clearHistory = () => {
  if (window.confirm("Are you sure you want to clear history?")) {
    localStorage.removeItem("history");
    setHistory([]);
  }
};



  const avgScore = history.length
    ? Math.round(history.reduce((a, b) => a + b.score, 0) / history.length)
    : 0;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const games = [
    {
      title: "Memory Match",
      description: "Test your memory skills with card matching",
      image: memory,
      path: "/games/memory"
    },
    {
      title: "Math Challenge",
      description: "Solve math problems against the clock",
      image: math,
      path: "/games/math"
    },
    {
      title: "Word Scramble",
      description: "Unscramble words as fast as you can",
      image: wordScramble,
      path: "/games/word"
    }
  ];

  const getBadge = (score) => {
    if (score >= 80) return <span className="badge success">Excellent</span>;
    if (score >= 60) return <span className="badge warning">Good</span>;
    return <span className="badge danger">Keep Trying</span>;
  };

  return (
    <div className="page">
      <div style={{ marginBottom: "30px" }}>
        <h2>Welcome Back, {user.name || user.email} 👋</h2>
        <p style={{ opacity: 0.8, margin: "5px 0", fontSize: "16px" }}>
          {user.email} • {user.age} years old
        </p>
      </div>

      <div className="stats">
        <div className="stat-item">
          <div className="stat-value">{history.length}</div>
          <div className="stat-label">Quizzes Taken</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{avgScore}%</div>
          <div className="stat-label">Average Score</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">
            {history.filter(h => h.score >= 80).length}
          </div>
          <div className="stat-label">Perfect Scores</div>
        </div>
      </div>

      <h3>🎮 Mini Games</h3>
      <div className="game-grid">
        {games.map((game, i) => (
          <div
            key={i}
            className="game-card"
            onClick={() => navigate(game.path)}
          >
            <div className="game-icon">
              <img src={game.image} alt="test" />
            </div>

            <div className="game-title">{game.title}</div>
            <div className="game-description">{game.description}</div>
          </div>
        ))}
      </div>

      <div className="history-header">
        <h3>📊 Quiz History</h3>

        {history.length > 0 && (
          <button onClick={clearHistory} className="clear-btn" style={{all: 'unset', cursor: 'pointer'}}>
            <img className="clear-img" src={clear} alt="clear history" />
          </button>
        )}
      </div>


      <div style={{ marginBottom: "30px" }}>
        {history.length === 0 && (
          <div className="quiz-card">
            <p style={{ opacity: 0.7, textAlign: "center", margin: 0 }}>
              No quizzes yet. Start your first challenge!
            </p>
          </div>
        )}

        {history
          .slice()
          .reverse()
          .map((h, i) => (
            <div key={i} className="history-item">
              <div>
                <div style={{ fontWeight: 600, marginBottom: "5px" }}>
                  {h.category || "General Knowledge"}
                </div>
                <div style={{ fontSize: "14px", opacity: 0.7 }}>
                  {h.date}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: 700,
                    fontFamily: "Space Mono, monospace"
                  }}
                >
                  {h.score}%
                </div>
                {getBadge(h.score)}
              </div>
            </div>
          ))}
      </div>

      <button onClick={() => navigate("/quiz")}>
         Start New Quiz
      </button>

      <button onClick={handleLogout} className="secondary">
        Logout
        <div className="logout"><img src={logout} alt="" /></div>
      </button>
    </div>
  );
}