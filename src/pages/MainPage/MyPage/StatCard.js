import React from "react";

function StatCard({ stats }) {
    return (
        <div className="stat-card">
            <div className="stat-card-top">
                <span className="stat-icon">{stats.icon}</span>
                <p className="stat-title">{stats.title}</p>
            </div>
            <p className="stat-value">
                {stats.statistics.value}{stats.statistics.unit}
            </p>
        </div>
    );
}

export default StatCard;