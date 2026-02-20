import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MathChallenge() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    generateQuestion();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver]);

  const generateQuestion = () => {
    const operations = ['+', '-', '×'];
    const op = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2, correctAnswer;

    switch (op) {
      case '+':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        correctAnswer = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 50) + 20;
        num2 = Math.floor(Math.random() * num1);
        correctAnswer = num1 - num2;
        break;
      case '×':
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        correctAnswer = num1 * num2;
        break;
      default:
        num1 = 0;
        num2 = 0;
        correctAnswer = 0;
    }

    setQuestion({ num1, num2, op, correctAnswer });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question || gameOver) return;

    const userAnswer = parseInt(answer);
    if (userAnswer === question.correctAnswer) {
      const points = streak >= 5 ? 15 : 10;
      setScore(score + points);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }

    setAnswer("");
    generateQuestion();
  };

  const resetGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
    setStreak(0);
    setAnswer("");
    generateQuestion();
  };

  return (
    <div className="page">
      <h2>🔢 Math Challenge</h2>

      <div className="stats" style={{marginBottom: '30px'}}>
        <div className="stat-item">
          <div className="stat-value">{score}</div>
          <div className="stat-label">Score</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{timeLeft}s</div>
          <div className="stat-label">Time Left</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{streak}</div>
          <div className="stat-label">Streak 🔥</div>
        </div>
      </div>

      {gameOver ? (
        <div className="quiz-card" style={{textAlign: 'center'}}>
          <h1 style={{fontSize: '64px', margin: '20px 0'}}>⏰</h1>
          <h3 style={{marginBottom: '10px'}}>Time's Up!</h3>
          <p style={{fontSize: '32px', fontWeight: 700, margin: '20px 0'}}>
            Final Score: {score}
          </p>
          <button onClick={resetGame} style={{marginTop: '20px'}}>
            Play Again
          </button>
          <button onClick={() => navigate("/dashboard")} className="secondary">
            Back to Dashboard
          </button>
        </div>
      ) : question ? (
        <>
          {streak >= 5 && (
            <div className="success-message" style={{marginBottom: '20px'}}>
              🔥 {streak} streak! Bonus points activated!
            </div>
          )}

          <div className="quiz-card" style={{textAlign: 'center', padding: '60px 40px'}}>
            <div style={{
              fontSize: '72px',
              fontWeight: 700,
              fontFamily: 'Space Mono, monospace',
              marginBottom: '40px',
              lineHeight: 1.2
            }}>
              {question.num1} {question.op} {question.num2} = ?
            </div>

            <form onSubmit={handleSubmit}>
              <input
                type="number"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Your answer"
                autoFocus
                style={{
                  fontSize: '32px',
                  textAlign: 'center',
                  fontFamily: 'Space Mono, monospace',
                  fontWeight: 700
                }}
              />
              <button type="submit" disabled={!answer}>
                Submit Answer
              </button>
            </form>
          </div>

          <button onClick={() => navigate("/dashboard")} className="secondary">
            Back to Dashboard
          </button>
        </>
      ) : null}
    </div>
  );
}