import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Components/Login/Login";
import UserProfile from "./Components/UserProfile/UserProfile";
import Dashboard from "./Components/Dashboard/Dashboard";
import Users from "./Components/Users/Users";
import NewUser from "./Components/NewUser/NewUser";
import EditUser from "./Components/EditUser/EditUser";
import UserConfig from "./Components/UserConfig/UserConfig";
import MenuExam from "./Components/MenuExam/MenuExam";
import Exams from "./Components/Exams/Exams";
import NewExam from "./Components/NewExam/NewExam";
import EditExam from "./Components/EditExam/EditExam";
import UploadExam from "./Components/UploadExam/UploadExam";
import ExamCheck from "./Components/ExamCheck/ExamCheck";
import ExamResults from "./Components/ExamResults/ExamResults";
import AnswerSheets from "./Components/AnswerSheets/AnswerSheets";
import Submits from "./Components/Submits/Submits";
import SubmitsDetails from "./Components/SubmitsDetails/SubmitsDetails";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/UserProfile" element={<UserProfile />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Users" element={<Users />} />
        <Route path="/NewUser" element={<NewUser />} />
        <Route path="/EditUser" element={<EditUser />} />
        <Route path="/MenuExam" element={<MenuExam />} />
        <Route path="/Exams" element={<Exams />} />
        <Route path="/NewExam" element={<NewExam />} />
        <Route path="/EditExam" element={<EditExam />} />
        <Route path="/UploadExam" element={<UploadExam />} />
        <Route path="/ExamCheck" element={<ExamCheck />} />
        <Route path="/ExamResults" element={<ExamResults />} />
        <Route path="/UserConfig" element={<UserConfig />} />
        <Route path="/AnswerSheets" element={<AnswerSheets />} />
        <Route path="/Submits" element={<Submits />} />
        <Route path="/SubmitsDetails" element={<SubmitsDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
