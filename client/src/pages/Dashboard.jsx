import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { MapPin, DollarSign, Briefcase } from 'lucide-react';

const Dashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const { user } = useContext(AuthContext);

    // Analysis Handler
    const handleAnalyze = async (jobId) => {
        try {
            setIsAnalyzing(true);
            const res = await axios.post(`http://localhost:5000/api/analysis/analyze/${jobId}`, {
                userId: user.id
            });
            setAnalysisResult(res.data);
        } catch (error) {
            alert('Analysis failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsAnalyzing(false);
        }
    };

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

                        <div className="mt-auto flex gap-2">
                            <button className="btn btn-primary flex-1">Apply Now</button>
                            <button
                                onClick={() => handleAnalyze(job._id)}
                                className="btn btn-outline"
                                title="Check AI Compatibility"
                                disabled={isAnalyzing}
                            >
                                {isAnalyzing ? 'Analyzing...' : '✨ Analyze'}
                            </button>
                        </div>
                    </div>
                ))}
                {jobs.length === 0 && <p className="text-center w-full">No jobs found.</p>}
            </div>

            {/* Analysis Modal */}
            {analysisResult && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="card max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                            <h2 className="text-2xl flex items-center gap-2">
                                ✨ Match Analysis
                            </h2>
                            <button onClick={() => setAnalysisResult(null)} className="hover:text-white text-muted">✕</button>
                        </div>

                        <div className="flex items-center justify-center mb-8">
                            <div className={`relative w-24 h-24 rounded-full flex items-center justify-center border-4 text-3xl font-bold ${analysisResult.score >= 80 ? 'border-green-500 text-green-500' :
                                analysisResult.score >= 50 ? 'border-yellow-500 text-yellow-500' :
                                    'border-red-500 text-red-500'
                                }`}>
                                {analysisResult.score}%
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="text-green-400 mb-2 font-bold">✅ Key Strengths</h4>
                                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-300">
                                    {analysisResult.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-red-400 mb-2 font-bold">⚠️ Missing Skills</h4>
                                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-300">
                                    {analysisResult.missingSkills.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>

                            <div className="bg-white/5 p-4 rounded-lg">
                                <h4 className="text-blue-400 mb-2 font-bold">💡 Summary</h4>
                                <p className="text-sm text-gray-300 leading-relaxed">{analysisResult.summary}</p>
                            </div>
                        </div>

                        <button onClick={() => setAnalysisResult(null)} className="btn btn-outline w-full mt-8">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
