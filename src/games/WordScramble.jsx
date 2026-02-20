import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function WordScramble() {
  const navigate = useNavigate();
  const [words] = useState([
    { word: 'JAVASCRIPT', hint: 'Programming language' },
    { word: 'COMPUTER', hint: 'Electronic device' },
    { word: 'ALGORITHM', hint: 'Step-by-step procedure' },
    { word: 'DATABASE', hint: 'Data storage system' },
    { word: 'NETWORK', hint: 'Connected computers' },
    { word: 'PROGRAMMING', hint: 'Writing code' },
    { word: 'SOFTWARE', hint: 'Computer programs' },
    { word: 'HARDWARE', hint: 'Physical components' },
    { word: 'INTERNET', hint: 'Global network' },
    { word: 'SECURITY', hint: 'Protection system' }
  ]);
  
  const [currentWord, setCurrentWord] = useState(null);
  const [scrambled, setScrambled] = useState('');
  const [guess, setGuess] = useState('');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    nextWord();
  }, []);

  const scrambleWord = (word) => {
    return word.split('').sort(() => Math.random() - 0.5).join('');
  };

  const nextWord = () => {
    if (round >= 10) {
      setGameOver(true);
      return;
    }

    const word = words[round];
    setCurrentWord(word);
    setScrambled(scrambleWord(word.word));
    setGuess('');
    setFeedback('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentWord || !guess) return;

    if (guess.toUpperCase() === currentWord.word) {
      setScore(score + 10);
      setFeedback('correct');
      setTimeout(() => {
        setRound(round + 1);
        nextWord();
      }, 1000);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(''), 1000);
    }
  };

  const resetGame = () => {
    setScore(0);
    setRound(0);
    setGameOver(false);
    setGuess('');
    setFeedback('');
    nextWord();
  };

  return (
    <div className="page">
      <h2>📝 Word Scramble</h2>

      <div className="stats" style={{marginBottom: '30px'}}>
        <div className="stat-item">
          <div className="stat-value">{score}</div>
          <div className="stat-label">Score</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{round + 1}/10</div>
          <div className="stat-label">Round</div>
        </div>
      </div>

      {gameOver ? (
        <div className="quiz-card" style={{textAlign: 'center'}}>
          <h1 style={{fontSize: '64px', margin: '20px 0'}}>🎊</h1>
          <h3 style={{marginBottom: '10px'}}>Game Complete!</h3>
          <p style={{fontSize: '32px', fontWeight: 700, margin: '20px 0'}}>
            Final Score: {score}/100
          </p>
          {score >= 80 && <p style={{fontSize: '24px'}}>🏆 Excellent Work!</p>}
          {score >= 50 && score < 80 && <p style={{fontSize: '24px'}}>👍 Good Job!</p>}
          {score < 50 && <p style={{fontSize: '24px'}}>💪 Keep Practicing!</p>}
          
          <button onClick={resetGame} style={{marginTop: '20px'}}>
            Play Again
          </button>
          <button onClick={() => navigate("/dashboard")} className="secondary">
            Back to Dashboard
          </button>
        </div>
      ) : currentWord ? (
        <>
          {feedback === 'correct' && (
            <div className="success-message" style={{marginBottom: '20px'}}>
              ✅ Correct! +10 points
            </div>
          )}
          
          {feedback === 'wrong' && (
            <div className="error-message" style={{marginBottom: '20px'}}>
              ❌ Wrong! Try again
            </div>
          )}

          <div className="quiz-card" style={{textAlign: 'center'}}>
            <div style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              marginBottom: '10px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Hint: {currentWord.hint}
            </div>
            
            <div style={{
              fontSize: '56px',
              fontWeight: 700,
              fontFamily: 'Space Mono, monospace',
              margin: '30px 0',
              letterSpacing: '8px',
              color: 'var(--accent-primary)'
            }}>
              {scrambled}
            </div>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Unscramble the word"
                autoFocus
                style={{
                  fontSize: '24px',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  fontFamily: 'Space Mono, monospace',
                  fontWeight: 700,
                  letterSpacing: '2px'
                }}
              />
              <button type="submit" disabled={!guess}>
                Submit Answer
              </button>
            </form>

            <button 
              onClick={nextWord} 
              className="secondary"
              style={{marginTop: '10px'}}
            >
              Skip Word
            </button>
          </div>

          <button onClick={() => navigate("/dashboard")} className="secondary">
            Back to Dashboard
          </button>
        </>
      ) : null}
    </div>
  );
}