import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapPin, DollarSign, Briefcase } from 'lucide-react';

const Dashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/jobs');
                setJobs(res.data);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    if (loading) return <div className="container p-8 text-center">Loading jobs...</div>;

    return (
        <div className="container">
            <div className="flex justify-between items-center mb-8">
                <h1>Job Dashboard</h1>
            </div>

            <div className="grid-jobs" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {jobs.map(job => (
                    <div key={job._id} className="card flex flex-col h-full">
                        <div className="mb-4">
                            <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                            <p className="text-primary font-medium mb-1">{job.company}</p>
                        </div>

                        <div className="flex flex-col gap-2 mb-4 text-sm text-muted">
                            <div className="flex items-center gap-2">
                                <MapPin size={16} /> {job.location}
                            </div>
                            <div className="flex items-center gap-2">
                                <Briefcase size={16} /> {job.type}
                            </div>
                            <div className="flex items-center gap-2">
                                <DollarSign size={16} /> {job.salaryRange || 'Competitive'}
                            </div>
                        </div>

                        <p className="text-muted text-sm mb-6 flex-grow" style={{ display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {job.description}
                        </p>

                        <button className="btn btn-primary w-full mt-auto">Apply Now</button>
                    </div>
                ))}
                {jobs.length === 0 && <p className="text-center w-full">No jobs found.</p>}
            </div>
        </div>
    );
};

export default Dashboard;
