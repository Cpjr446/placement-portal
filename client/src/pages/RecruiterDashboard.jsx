import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RecruiterDashboard = () => {
    return (
        <div className="container">
            <h1 className="mb-8">Recruiter Dashboard</h1>
            <div className="card">
                <p className="text-muted">Welcome, Recruiter. Here you can post jobs and view applicants.</p>
                <br />
                <button className="btn btn-primary">Post a New Job</button>
            </div>
        </div>
    );
};

export default RecruiterDashboard;
