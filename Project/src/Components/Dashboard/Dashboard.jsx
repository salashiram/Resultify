import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import SideBar from "../SideBar/Sidebar";
import { User, Upload, FileText } from "lucide-react";
import useAuthCheck from "../../hooks/useAuthCheck";
import "./Dashboard.css";

const options = [
  {
    id: 1,
    label: "Usuarios",
    description: "Gestionar los usuarios del sistema",
    icon: User,
    path: "/Users",
  },
  {
    id: 2,
    label: "Exámenes",
    description: "Ver y administrar exámenes",
    icon: FileText,
    path: "/Exams",
  },
  {
    id: 3,
    label: "Cargar Examen",
    description: "Subir un nuevo examen",
    icon: Upload,
    path: "/UploadExam",
  },
];

const OptionItem = ({ label, description, icon: Icon, path }) => (
  <Link to={path} className="option-item">
    <Icon className="option-icon" />
    <div className="option-content">
      <h3 className="option-label">{label}</h3>
      <p className="option-description">{description}</p>
    </div>
  </Link>
);

const Dashboard = () => {
  useAuthCheck([1, 2]);
  return (
    <div>
      <SideBar />
      <div className="dashboard-content">
        <div className="option-list">
          {options.map((option) => (
            <OptionItem key={option.id} {...option} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
