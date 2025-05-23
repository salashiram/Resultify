import { Link } from "react-router-dom";
import SideBar from "../SideBar/Sidebar";
import { Upload, FileText, Check, Sheet, Verified } from "lucide-react";
import useAuthCheck from "../../hooks/useAuthCheck";
import "./MenuExam.css";

const options = [
  {
    id: 1,
    label: "Ver exámenes",
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
    description: "Hojas de respuestas generadas",
    icon: Sheet,
    path: "/AnswerSheets",
  },
  {
    id: 5,
    label: "Resultados",
    description: "Ver resultados de los examenes procesados",
    icon: Verified,
    path: "/Submits",
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
      <div className="header">
        <h1>Menú exámenes</h1>
      </div>
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
