import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import SideBar from "../SideBar/Sidebar";
import { User, Upload, FileText, Download, Check } from "lucide-react";
import useAuthCheck from "../../hooks/useAuthCheck";
import "./MenuExam.css";

const options = [
  {
    id: 1,
    label: "Crear examen",
    description: "Crear o modificar exámenes",
    icon: FileText,
    path: "/Exams",
  },
  {
    id: 2,
    label: "Cargar Examenes",
    description: "Cargar exámenes para revisión",
    icon: Upload,
    path: "/UploadExam",
  },
  {
    id: 3,
    label: "Revisar Examenes",
    description: "Revisar exámenes",
    icon: Check,
    path: "/ExamCheck",
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

const MenuExam = () => {
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

export default MenuExam;
