import "./App.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Hooks
import { useAuth } from "./hooks/useAuth";

// Pages
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import CreateQuestions from "./pages/CreateQuestions/CreateQuestions";

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
          <Route path="/questions" element={<CreateQuestions />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
