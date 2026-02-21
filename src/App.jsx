import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Settings from './pages/Settings';
import { Dashboard, Saved, Digest, Proof, TestChecklist, Ship } from './pages/PlaceholderPages';
import ProofFooter from './components/ProofFooter';

function App() {
    const proofItems = [
        { label: 'UI Built', completed: true },
        { label: 'Logic Working', completed: false },
        { label: 'Test Passed', completed: false },
        { label: 'Deployed', completed: false },
    ];

    return (
        <div className="container">
            <Navbar />

            <main style={{ flex: 1, paddingBottom: '80px' }}>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/saved" element={<Saved />} />
                    <Route path="/digest" element={<Digest />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/jt/proof" element={<Proof />} />
                    <Route path="/jt/07-test" element={<TestChecklist />} />
                    <Route path="/jt/08-ship" element={<Ship />} />
                </Routes>
            </main>

            <ProofFooter items={proofItems} />
        </div>
    );
}

export default App;
