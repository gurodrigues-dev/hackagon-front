import "./App.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Hooks
import { useAuth } from "./hooks/useAuth";

// Pages
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import CreateQuestions from "./pages/CreateQuestions/CreateQuestions";
import Ranking from "./pages/Ranking/Ranking";
import ForgotPasswordEmail from "./pages/ForgotPassword/ForgotPasswordEmail";
import ForgotPasswordCode from "./pages/ForgotPassword/ForgotPasswordCode";
import NewPassword from "./pages/ForgotPassword/NewPassword";
import ForgotPasswordMessage from "./pages/ForgotPassword/ForgotPasswordMessage";

// Components
import LoadingAnimation from "./components/LoadingAnimation/LoadingAnimation";

function App() {
  const { auth, loading } = useAuth();


  if(loading) {
    return <LoadingAnimation />
  }

  return (
    <div className="wrapper">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={auth ? <Home /> : <Navigate to="/login" />} />
          <Route path="/login" element={!auth ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!auth ? <Register /> : <Navigate to="/" />} />
          <Route path="/ranking" element={auth ? <Ranking /> : <Navigate to="/login" />} />
          <Route path="/forgot-password/email" element={<ForgotPasswordEmail />} />
          <Route path="/forgot-password/code" element={<ForgotPasswordCode />} />
          <Route path="/forgot-password/new-password" element={<NewPassword />} />
          <Route path="/forgot-password/message" element={<ForgotPasswordMessage />} />
          <Route path="/questions" element={<CreateQuestions />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
