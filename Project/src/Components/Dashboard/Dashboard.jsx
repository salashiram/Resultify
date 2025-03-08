import React from "react";
import SideBar from "../SideBar/Sidebar";
import "./Dashboard.css";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div>
      <SideBar />
      <div className="option-content">
        <Link to="/NewExam">
          <button>Nuevo examen</button>
        </Link>
      </div>
      <div className="dashboard-container">
        {/* <div className="dash-top-content">
          <h1>Dashboard</h1>
        </div> */}

        <div className="search-content">
          <div className="content-bx">
            <input type="text" />
            <button>Buscar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
