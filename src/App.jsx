import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";


function App() {

  return (
    <div className="wrapper">
      <BrowserRouter>
        <Routes>
          <Route path="/login" Component={Login} />
          <Route path="/register" Component={Register} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
