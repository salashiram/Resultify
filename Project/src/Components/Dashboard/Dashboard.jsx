import React from "react";
import { Link } from "react-router-dom";
import SideBar from "../SideBar/Sidebar";
import { User, FileText } from "lucide-react";
import useAuthCheck from "../../hooks/useAuthCheck";
import "./Dashboard.css";

const options = [
  {
    id: 1,
    label: "Usuarios",
    description: "Gestionar usuarios del sistema",
    icon: User,
    path: "/Users",
  },
  {
    id: 2,
    label: "Exámenes",
    description: "Administrar exámenes",
    icon: FileText,
    path: "/MenuExam",
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
