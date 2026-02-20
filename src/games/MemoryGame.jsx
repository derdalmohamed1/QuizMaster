import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MemoryGame() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const emojis = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎸', '🎺', '🎵'];

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, flipped: false }));
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
  };

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      
      if (cards[first].emoji === cards[second].emoji) {
        setMatched([...matched, first, second]);
        setFlipped([]);
        
        if (matched.length + 2 === cards.length) {
          setTimeout(() => setGameWon(true), 500);
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div className="page">
      <h2>🧠 Memory Match</h2>
      
      <div className="stats" style={{marginBottom: '30px'}}>
        <div className="stat-item">
          <div className="stat-value">{moves}</div>
          <div className="stat-label">Moves</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{matched.length / 2}</div>
          <div className="stat-label">Matches</div>
        </div>
      </div>

      {gameWon ? (
        <div className="quiz-card" style={{textAlign: 'center'}}>
          <h1 style={{fontSize: '64px', margin: '20px 0'}}>🎉</h1>
          <h3 style={{marginBottom: '10px'}}>Congratulations!</h3>
          <p>You won in {moves} moves!</p>
          <button onClick={initGame} style={{marginTop: '20px'}}>Play Again</button>
          <button onClick={() => navigate("/dashboard")} className="secondary">
            Back to Dashboard
          </button>
        </div>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '15px',
            marginBottom: '30px'
          }}>
            {cards.map((card, index) => {
              const isFlipped = flipped.includes(index) || matched.includes(index);
              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(index)}
                  style={{
                    aspectRatio: '1',
                    background: isFlipped 
                      ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
                      : 'var(--bg-card)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    cursor: isFlipped ? 'default' : 'pointer',
                    transition: 'all 0.3s',
                    border: '2px solid',
                    borderColor: isFlipped ? 'var(--accent-primary)' : 'rgba(0, 255, 159, 0.1)',
                    transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(0deg)',
                    opacity: matched.includes(index) ? 0.6 : 1
                  }}
                >
                  {isFlipped ? card.emoji : '?'}
                </div>
              );
            })}
          </div>

          <button onClick={initGame} className="secondary">
            🔄 Restart Game
          </button>
          <button onClick={() => navigate("/dashboard")} className="secondary">
            Back to Dashboard
          </button>
        </>
      )}
    </div>
  );
}