import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Upload, FileText, User } from 'lucide-react';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [resume, setResume] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Fetch fresh user data
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/users/${user.id}`);
                setProfile(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        if (user?.id) fetchProfile();
    }, [user]);

    const handleFileChange = (e) => {
        setResume(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!resume) return;

        const formData = new FormData();
        formData.append('resume', resume);
        setUploading(true);

        try {
            const res = await axios.post(`http://localhost:5000/api/users/${user.id}/resume`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // Update local state to show "success" UI basically
            setProfile(prev => ({ ...prev, hasResume: true }));
            setMessage('Resume uploaded successfully!');
            setResume(null); // Clear file input
        } catch (error) {
            setMessage('Upload failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setUploading(false);
        }
    };

    if (!profile) return <div className="text-center p-8">Loading profile...</div>;

    return (
        <div className="container">
            <div className="max-w-2xl mx-auto">
                <h1 className="mb-8 flex items-center gap-3">
                    <User size={32} /> My Profile
                </h1>

                <div className="card mb-8">
                    <h3 className="mb-4 text-xl">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-muted">
                        <div>
                            <label className="block text-sm font-bold mb-1">Username</label>
                            <p className="text-white">{profile.username}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Email</label>
                            <p className="text-white">{profile.email}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Role</label>
                            <p className="uppercase text-primary text-sm font-bold">{profile.role}</p>
                        </div>
                    </div>
                </div>

                {profile.role === 'applicant' && (
                    <div className="card">
                        <h3 className="mb-4 text-xl">Resume Management</h3>

                        {profile.hasResume ? (
                            <div className="mb-6 p-4 border border-green-500/30 bg-green-500/10 rounded flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FileText className="text-green-400" />
                                    <span>Current Resume Uploaded</span>
                                </div>
                                <a
                                    href={`http://localhost:5000/api/users/${user.id}/resume/download`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-green-400 hover:text-green-300 underline"
                                >
                                    View / Download
                                </a>
                            </div>
                        ) : (
                            <div className="mb-6 p-4 border border-yellow-500/30 bg-yellow-500/10 rounded">
                                <p className="text-yellow-400 flex items-center gap-2">
                                    <FileText size={16} /> No resume uploaded yet.
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleUpload}>
                            <div className="mb-4">
                                <label className="label">Upload New Resume (PDF/DOC)</label>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-violet-50 file:text-violet-700
                                hover:file:bg-violet-100"
                                />
                            </div>
                            {message && <p className={`text-sm mb-4 ${message.includes('failed') ? 'text-red-400' : 'text-green-400'}`}>{message}</p>}
                            <button
                                type="submit"
                                disabled={!resume || uploading}
                                className={`btn btn-primary ${(!resume || uploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {uploading ? 'Uploading...' : 'Upload Resume'} <Upload size={16} className="ml-2" />
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
