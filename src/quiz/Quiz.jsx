import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import correct_answer from "./audios/correct_answer.mp3";
import wrong_answer from "./audios/worng_answer.mp3";

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("any");
  const [difficulty, setDifficulty] = useState("medium");
  const [quizStarted, setQuizStarted] = useState(false);
  const navigate = useNavigate();
  const correctAudio = useRef(new Audio(correct_answer));
  const wrongAudio = useRef(new Audio(wrong_answer));



  const startQuiz = () => {
    setLoading(true);
    const categoryParam = category !== "any" ? `&category=${category}` : "";
    const difficultyParam = difficulty !== "any" ? `&difficulty=${difficulty}` : "";
    
    fetch(`https://opentdb.com/api.php?amount=10&type=multiple${categoryParam}${difficultyParam}`)
      .then(res => res.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          setQuestions(data.results);
          setQuizStarted(true);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading questions:", err);
        setLoading(false);
      });
  };

  if (loading && quizStarted) {
    return (
      <div className="page" style={{textAlign: 'center'}}>
        <div className="loading-spinner"></div>
        <h2>Loading Questions...</h2>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="page">
        <h2>⚙️ Configure Your Quiz</h2>
        <div className="quiz-card">
          <label style={{display: 'block', marginBottom: '10px', fontWeight: 600}}>
            Select Category
          </label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="any">Any Category</option>
            <option value="9">General Knowledge</option>
            <option value="21">Sports</option>
            <option value="23">History</option>
            <option value="22">Geography</option>
            <option value="18">Computers</option>
            <option value="17">Science</option>
            <option value="11">Movies</option>
            <option value="12">Music</option>
          </select>

          <label style={{display: 'block', marginTop: '20px', marginBottom: '10px', fontWeight: 600}}>
            Select Difficulty
          </label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="any">Any Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <button onClick={startQuiz} style={{marginTop: '30px'}} disabled={loading}>
          {loading ? "Loading..." : "QUIZ MASTER"}
        </button>
        {loading && (
          <div className="loading-spinner" style={{marginTop: '20px'}}></div>
        )}

        <button onClick={() => navigate("/dashboard")} className="secondary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="page" style={{textAlign: 'center'}}>
        <h2>❌ Error loading questions</h2>
        <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
      </div>
    );
  }

  const q = questions[index];
  const answers = [...(q.incorrect_answers || []), q.correct_answer].sort();
  const progress = ((index + 1) / questions.length) * 100;

//   const playSound = (sound) => {
//   const audio = new Audio(sound);
//   audio.play();
// };


  const handleAnswer = (a) => {
  if (answered) return;

  setSelectedAnswer(a);
  setAnswered(true);

  if (a === q.correct_answer) {
    setScore(score + 10);
    correctAudio.current.currentTime = 0;
    correctAudio.current.play();
  } else {
    wrongAudio.current.currentTime = 0;
    wrongAudio.current.play();
  }
};


  const nextQuestion = () => {
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    } else {
      finish();
    }
  };

  const finish = () => {
    const history = JSON.parse(localStorage.getItem("history") || "[]");
    const finalScore = score + (selectedAnswer === q.correct_answer ? 10 : 0);
    
    history.push({
      date: new Date().toLocaleDateString(),
      score: finalScore,
      category: q.category || 'General Knowledge'
    });
    
    localStorage.setItem("history", JSON.stringify(history));
    navigate("/dashboard");
  };

  return (
    <div className="page">
      <div style={{marginBottom: '30px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
          <h2>Question {index + 1}/{questions.length}</h2>
          <div style={{fontSize: '24px', fontWeight: 700, fontFamily: 'Space Mono, monospace'}}>
            {score} pts
          </div>
        </div>
        
        <div style={{
          height: '8px',
          background: 'var(--bg-card)',
          borderRadius: '10px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
            transition: 'width 0.3s'
          }}></div>
        </div>
      </div>

      <div className="quiz-card">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '20px',
          fontSize: '14px',
          opacity: 0.8
        }}>
          <span className={`badge ${q.difficulty === 'easy' ? 'success' : q.difficulty === 'medium' ? 'warning' : 'danger'}`}>
            {q.difficulty}
          </span>
          <span>{q.category}</span>
        </div>
        
        <p style={{
          fontSize: '22px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: 1.5,
          margin: 0
        }} dangerouslySetInnerHTML={{ __html: q.question }} />
      </div>

      <div style={{display: 'grid', gap: '15px', marginBottom: '20px'}}>
        {answers.map((a, i) => {
          let buttonStyle = {};
          let buttonClass = "";
          
          if (answered) {
            if (a === q.correct_answer) {
              buttonClass = "success";
            } else if (a === selectedAnswer) {
              buttonClass = "danger";
            } else {
              buttonStyle = {opacity: 0.4};
            }
          }

          return (
            <button 
              key={i} 
              onClick={() => handleAnswer(a)} 
              dangerouslySetInnerHTML={{ __html: a }}
              className={buttonClass}
              style={{
                ...buttonStyle,
                textAlign: 'left',
                textTransform: 'none',
                cursor: answered ? 'default' : 'pointer',
                letterSpacing: 0
              }}
              disabled={answered}
            />
          );
        })}
      </div>

      {answered && (
        <div>
          {selectedAnswer === q.correct_answer ? (
            <div className="success-message">
              ✅ Correct! +10 points
            </div>
          ) : (
            <div className="error-message">
              ❌ Wrong! The correct answer was: <strong dangerouslySetInnerHTML={{ __html: q.correct_answer }} />
            </div>
          )}
          
          <button onClick={nextQuestion} className="success" style={{marginTop: '15px'}}>
            {index + 1 < questions.length ? '➡️ Next Question' : '✅ Finish Quiz'}
          </button>
        </div>
      )}
    </div>
  );
}