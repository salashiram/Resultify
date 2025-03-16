import React from "react";
import SideBar from "../SideBar/Sidebar";
import "./Dashboard.css";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div>
      <SideBar />
      <div className="dashboard-container">
        <div class="">
          <div class="cards">
            <a href="/Exams">
              <div class="card card-1">
                <div class="card__icon">
                  <i class="fas fa-bolt"></i>
                </div>
                <p class="card__exit">
                  <i class="fas fa-times"></i>
                </p>
                <h2 class="card__title card__link">Examenes</h2>
              </div>
            </a>
            <a href="/Users">
              <div class="card card-2">
                <div class="card__icon">
                  <i class="fas fa-bolt"></i>
                </div>
                <p class="card__exit">
                  <i class="fas fa-times"></i>
                </p>
                <h2 class="card__title">Usuarios</h2>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
