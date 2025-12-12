import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, User, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="card !rounded-none !border-x-0 !border-t-0 !p-4 mb-8 sticky top-0 z-50 bg-[#1e293bdd]">
            <div className="container flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-2xl font-bold" style={{ background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    <Briefcase size={28} color="var(--color-primary)" />
                    <span>JobBoard</span>
                </Link>
                <div className="flex items-center gap-4">
                    <Link to="/" className="text-muted hover:text-white transition-colors">Home</Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" className="text-muted hover:text-white transition-colors">Dashboard</Link>
                            <div className="flex items-center gap-4 ml-4">
                                <span className="text-sm font-medium text-white flex items-center gap-1">
                                    <User size={16} /> {user.username}
                                </span>
                                <button onClick={handleLogout} className="btn btn-outline py-2 px-3 text-sm">
                                    <LogOut size={14} className="mr-1" /> Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-muted hover:text-white transition-colors">Login</Link>
                            <Link to="/register" className="btn btn-primary py-2 px-4 text-sm">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
