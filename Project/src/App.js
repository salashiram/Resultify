import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Components/Login/Login";
import Home from "./Components/Home/Home";
import UserProfile from "./Components/UserProfile/UserProfile";
import Dashboard from "./Components/Dashboard/Dashboard";
import Users from "./Components/Users/Users";
import NewUser from "./Components/NewUser/NewUser";
import Exams from "./Components/Exams/Exams";
import NewExam from "./Components/NewExam/NewExam";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/UserProfile" element={<UserProfile />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Users" element={<Users />} />
        <Route path="/NewUser" element={<NewUser />} />
        <Route path="/Exams" element={<Exams />} />
        <Route path="/NewExam" element={<NewExam />} />
      </Routes>
    </Router>
  );
};

export default App;
