import { useState } from "react";
import { useNavigate } from "react-router-dom";
import quizGame from "../dashboard/images/quizGame.png";

export default function Login() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  const handleLogin = () => {
    setError("");
    
    if (!formData.name.trim()) {
      setError("Please enter your name");
      return;
    }
    
    if (!formData.email.trim()) {
      setError("Please enter your email");
      return;
    }
    
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }
    
    if (!formData.age || formData.age < 1) {
      setError("Please enter a valid age");
      return;
    }
    
    localStorage.setItem("user", JSON.stringify(formData));
    navigate("/dashboard");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="center">
      <div className="card">
        <h1> <img className="quiz-img" src={quizGame} alt="" /> Quiz Master</h1>
        <p style={{textAlign: 'center', marginBottom: '30px', fontSize: '14px'}}>
          Join the ultimate quiz & gaming platform
        </p>
        
        <input 
          name="name"
          value={formData.name} 
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder="Full Name"
          type="text"
        />
        
        <input 
          name="email"
          value={formData.email} 
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder="Email Address"
          type="email"
        />
        
        <input 
          name="age"
          value={formData.age} 
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder="Age"
          type="number"
          min="1"
        />
        
        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}
        
        <button onClick={handleLogin}>Start Your Journey</button>
      </div>
    </div>
  );
}