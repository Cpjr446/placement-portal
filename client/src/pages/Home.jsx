import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';

const Home = () => {
    return (
        <div className="container">
            <div className="flex flex-col items-center justify-center text-center py-20">
                <div className="badge mb-6">New: AI-Powered Matching</div>
                <h1 className="mb-6 max-w-3xl" style={{ fontSize: '4rem', lineHeight: '1.1' }}>
                    Find Your Dream Job <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400" style={{ background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Without the Hassle</span>
                </h1>
                <p className="text-muted text-xl max-w-2xl mb-10">
                    The most advanced placement portal for top talent. Connect with leading companies and launch your career today.
                </p>
                <div className="flex gap-4">
                    <Link to="/register" className="btn btn-primary text-lg px-8 py-4">
                        Get Started <ArrowRight size={20} className="ml-2" />
                    </Link>
                    <Link to="/login" className="btn btn-outline text-lg px-8 py-4">
                        Browse Jobs
                    </Link>
                </div>
            </div>

            <div className="grid-features py-20" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
                <div className="card">
                    <div className="mb-4 text-primary"><CheckCircle size={32} /></div>
                    <h3>Verified Companies</h3>
                    <p className="text-muted mt-2">Access valid job listings from trusted top-tier companies worldwide.</p>
                </div>
                <div className="card">
                    <div className="mb-4 text-primary"><CheckCircle size={32} /></div>
                    <h3>Smart Matching</h3>
                    <p className="text-muted mt-2">Our algorithm matches your profile with the perfect job opportunities.</p>
                </div>
                <div className="card">
                    <div className="mb-4 text-primary"><CheckCircle size={32} /></div>
                    <h3>Career Growth</h3>
                    <p className="text-muted mt-2">Tools and resources to help you advance your career path effectively.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
