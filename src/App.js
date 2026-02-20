import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import Dashboard from "./dashboard/Dashboard";
import Quiz from "./quiz/Quiz";
import MemoryGame from "./games/MemoryGame";
import MathChallenge from "./games/MathChallenge";
import WordScramble from "./games/WordScramble";
import ProtectedRoute from "./Error404/ProtectedRoote";
import NotFound from "./Error404/NotFound";

export default function App() {
  return (
    <Routes>

      {/* default page*/}
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/quiz"
        element={
          <ProtectedRoute>
            <Quiz />
          </ProtectedRoute>
        }
      />

      <Route
        path="/games/memory"
        element={
          <ProtectedRoute>
            <MemoryGame />
          </ProtectedRoute>
        }
      />

      <Route
        path="/games/math"
        element={
          <ProtectedRoute>
            <MathChallenge />
          </ProtectedRoute>
        }
      />

      <Route
        path="/games/word"
        element={
          <ProtectedRoute>
            <WordScramble />
          </ProtectedRoute>
        }
      />

      {/*error page*/}
      <Route path="*" element={<NotFound />} />
      
    </Routes>
  );
}
