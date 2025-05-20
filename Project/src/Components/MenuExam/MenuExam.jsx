import React from "react";
import { Link } from "react-router-dom";
import SideBar from "../SideBar/Sidebar";
import { Upload, FileText, Check, Sheet } from "lucide-react";
import useAuthCheck from "../../hooks/useAuthCheck";
import "./MenuExam.css";
// import { path } from "../../../../server/src/app/app";

const options = [
  {
    id: 1,
    label: "Crear examen",
    description: "Crear o modificar examen",
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
    description: "Revisión de exámenes previamente cargados",
    icon: Check,
    path: "/ExamCheck",
  },
  {
    id: 4,
    label: "Hojas de respuestas",
    description: "Hojas de respuestas",
    icon: Sheet,
    path: "/AnswerSheets",
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
