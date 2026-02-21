import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ContextHeader from '../components/ContextHeader';
import Card from '../components/Card';
import JobCard from '../components/JobCard';
import FilterBar from '../components/FilterBar';
import JobModal from '../components/JobModal';
import Button from '../components/Button';
import { jobs } from '../data/jobs';
import { calculateMatchScore, getScoreColor } from '../utils/scoring';

const EmptyState = ({ message }) => (
    <Card style={{
        padding: 'var(--space-5)',
        textAlign: 'center',
        borderStyle: 'dashed',
        backgroundColor: 'transparent',
        opacity: 0.8,
        marginTop: 'var(--space-4)'
    }}>
        <p style={{ fontSize: '18px', opacity: 0.6, fontFamily: 'var(--font-serif)' }}>
            {message}
        </p>
    </Card>
);

const Banner = ({ message }) => (
    <div style={{
        backgroundColor: 'rgba(139, 0, 0, 0.05)',
        border: '1px solid var(--accent-color)',
        padding: 'var(--space-2) var(--space-4)',
        margin: 'var(--space-2) var(--space-4)',
        borderRadius: 'var(--radius)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    }}>
        <span style={{ fontSize: '14px', fontWeight: '500' }}>{message}</span>
        <Link to="/settings" style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--accent-color)' }}>
            Configure Now
        </Link>
    </div>
);

const Toast = ({ message, onClear }) => {
    useEffect(() => {
        const timer = setTimeout(onClear, 3000);
        return () => clearTimeout(timer);
    }, [onClear]);

    return (
        <div style={{
            position: 'fixed',
            bottom: 'var(--space-4)',
            right: 'var(--space-4)',
            backgroundColor: 'var(--text-primary)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: 3000,
            fontSize: '14px',
            animation: 'slideIn 0.3s ease-out'
        }}>
            {message}
        </div>
    );
};

export const Dashboard = () => {
    const [userPrefs, setUserPrefs] = useState(null);
    const [processedJobs, setProcessedJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [filters, setFilters] = useState({ search: '', location: '', status: 'All', sort: 'latest' });
    const [showMatchesOnly, setShowMatchesOnly] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [toast, setToast] = useState(null);

    // Load Data & Preferences
    const loadState = useCallback(() => {
        const savedPrefs = localStorage.getItem('jobTrackerPreferences');
        const prefs = savedPrefs ? JSON.parse(savedPrefs) : null;
        setUserPrefs(prefs);

        const savedStatus = JSON.parse(localStorage.getItem('jobTrackerStatus') || '{}');

        const scored = jobs.map(job => ({
            ...job,
            matchScore: calculateMatchScore(job, prefs),
            status: savedStatus[job.id] || 'Not Applied'
        }));
        setProcessedJobs(scored);
    }, []);

    useEffect(() => {
        loadState();
    }, [loadState]);

    useEffect(() => {
        applyFiltersAndSort();
    }, [processedJobs, filters, showMatchesOnly]);

    const applyFiltersAndSort = () => {
        let results = processedJobs.filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                job.company.toLowerCase().includes(filters.search.toLowerCase());
            const matchesLocation = !filters.location || job.location === filters.location;
            const matchesStatus = filters.status === 'All' || job.status === filters.status;
            const aboveThreshold = !showMatchesOnly || (job.matchScore >= (userPrefs?.minMatchScore || 0));

            return matchesSearch && matchesLocation && matchesStatus && aboveThreshold;
        });

        const extractSalary = (range) => {
            const match = range.match(/(\d+)/);
            return parseInt(match ? match[0] : 0);
        };

        if (filters.sort === 'latest') {
            results.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
        } else if (filters.sort === 'match') {
            results.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
        } else if (filters.sort === 'salary') {
            results.sort((a, b) => extractSalary(b.salaryRange) - extractSalary(a.salaryRange));
        }

        setFilteredJobs(results);
    };

    const handleStatusChange = (jobId, newStatus) => {
        const savedStatus = JSON.parse(localStorage.getItem('jobTrackerStatus') || '{}');
        savedStatus[jobId] = newStatus;
        localStorage.setItem('jobTrackerStatus', JSON.stringify(savedStatus));

        // Log history
        const history = JSON.parse(localStorage.getItem('jobTrackerHistory') || '[]');
        const job = jobs.find(j => j.id === jobId);
        history.unshift({
            jobId,
            title: job.title,
            company: job.company,
            status: newStatus,
            date: new Date().toISOString()
        });
        localStorage.setItem('jobTrackerHistory', JSON.stringify(history.slice(0, 20))); // Keep last 20

        setToast(`Status updated: ${newStatus}`);
        loadState();
    };

    const handleSave = (job) => {
        const savedIds = JSON.parse(localStorage.getItem('savedJobs') || '[]');
        if (!savedIds.includes(job.id)) {
            localStorage.setItem('savedJobs', JSON.stringify([...savedIds, job.id]));
            setToast(`Job saved to shortlist`);
        }
    };

    return (
        <div style={{ flex: 1 }}>
            <ContextHeader title="Dashboard" subtitle="Intelligent job matching with persistent application tracking." />

            {!userPrefs && <Banner message="Set your preferences to activate intelligent matching." />}

            <FilterBar
                filters={filters}
                onFilterChange={(k, v) => setFilters(prev => ({ ...prev, [k]: v }))}
                showMatchesOnly={showMatchesOnly}
                onToggleMatches={setShowMatchesOnly}
            />

            <div style={{
                padding: 'var(--space-4)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: 'var(--space-3)'
            }}>
                {filteredJobs.length > 0 ? (
                    filteredJobs.map(job => (
                        <JobCard
                            key={job.id}
                            job={job}
                            onSave={handleSave}
                            onApply={(j) => window.open(j.applyUrl, '_blank')}
                            onView={setSelectedJob}
                            onStatusChange={handleStatusChange}
                        />
                    ))
                ) : (
                    <div style={{ gridColumn: '1 / -1' }}>
                        <EmptyState message={showMatchesOnly ? "No roles match your criteria. Adjust filters or lower threshold." : "No jobs found matching your criteria."} />
                    </div>
                )}
            </div>

            <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />
            {toast && <Toast message={toast} onClear={() => setToast(null)} />}
        </div>
    );
};

export const Saved = () => {
    const [savedJobs, setSavedJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [toast, setToast] = useState(null);

    const loadSaved = useCallback(() => {
        const savedIds = JSON.parse(localStorage.getItem('savedJobs') || '[]');
        const savedPrefs = localStorage.getItem('jobTrackerPreferences');
        const prefs = savedPrefs ? JSON.parse(savedPrefs) : null;
        const savedStatus = JSON.parse(localStorage.getItem('jobTrackerStatus') || '{}');

        const filtered = jobs
            .filter(job => savedIds.includes(job.id))
            .map(job => ({
                ...job,
                matchScore: calculateMatchScore(job, prefs),
                status: savedStatus[job.id] || 'Not Applied'
            }));
        setSavedJobs(filtered);
    }, []);

    useEffect(() => {
        loadSaved();
    }, [loadSaved]);

    const handleStatusChange = (jobId, newStatus) => {
        const savedStatus = JSON.parse(localStorage.getItem('jobTrackerStatus') || '{}');
        savedStatus[jobId] = newStatus;
        localStorage.setItem('jobTrackerStatus', JSON.stringify(savedStatus));

        const history = JSON.parse(localStorage.getItem('jobTrackerHistory') || '[]');
        const job = jobs.find(j => j.id === jobId);
        history.unshift({
            jobId,
            title: job.title,
            company: job.company,
            status: newStatus,
            date: new Date().toISOString()
        });
        localStorage.setItem('jobTrackerHistory', JSON.stringify(history.slice(0, 20)));

        setToast(`Status updated: ${newStatus}`);
        loadSaved();
    };

    const handleRemove = (job) => {
        const savedIds = JSON.parse(localStorage.getItem('savedJobs') || '[]');
        const newIds = savedIds.filter(id => id !== job.id);
        localStorage.setItem('savedJobs', JSON.stringify(newIds));
        setSavedJobs(prev => prev.filter(j => j.id !== job.id));
        setToast(`Removed from saved list`);
    };

    return (
        <div style={{ flex: 1 }}>
            <ContextHeader title="Saved Opportunities" subtitle="Review your curated shortlist of deterministic matches." />

            <div style={{
                padding: 'var(--space-4)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: 'var(--space-3)'
            }}>
                {savedJobs.length > 0 ? (
                    savedJobs.map(job => (
                        <JobCard
                            key={job.id}
                            job={job}
                            onSave={() => handleRemove(job)}
                            onApply={() => window.open(job.applyUrl, '_blank')}
                            onView={setSelectedJob}
                            onStatusChange={handleStatusChange}
                        />
                    ))
                ) : (
                    <div style={{ gridColumn: '1 / -1' }}>
                        <EmptyState message="Your saved jobs list is currently empty." />
                    </div>
                )}
            </div>

            <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />
            {toast && <Toast message={toast} onClear={() => setToast(null)} />}
        </div>
    );
};

export const Digest = () => {
    const [digest, setDigest] = useState(null);
    const [history, setHistory] = useState([]);
    const [hasPrefs, setHasPrefs] = useState(false);
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const savedPrefs = localStorage.getItem('jobTrackerPreferences');
        setHasPrefs(!!savedPrefs);

        const savedDigest = localStorage.getItem(`jobTrackerDigest_${today}`);
        if (savedDigest) setDigest(JSON.parse(savedDigest));

        const savedHistory = JSON.parse(localStorage.getItem('jobTrackerHistory') || '[]');
        setHistory(savedHistory);
    }, [today]);

    const generateDigest = () => {
        const savedPrefs = JSON.parse(localStorage.getItem('jobTrackerPreferences'));
        if (!savedPrefs) return;
        const savedStatus = JSON.parse(localStorage.getItem('jobTrackerStatus') || '{}');

        const scoredJobs = jobs.map(job => ({
            ...job,
            matchScore: calculateMatchScore(job, savedPrefs),
            status: savedStatus[job.id] || 'Not Applied'
        }));

        const topJobs = scoredJobs
            .filter(job => job.matchScore !== null)
            .sort((a, b) => {
                if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
                return a.postedDaysAgo - b.postedDaysAgo;
            })
            .slice(0, 10);

        if (topJobs.length > 0) {
            const newDigest = {
                date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
                jobs: topJobs
            };
            setDigest(newDigest);
            localStorage.setItem(`jobTrackerDigest_${today}`, JSON.stringify(newDigest));
        } else {
            setDigest({ empty: true });
        }
    };

    return (
        <div style={{ flex: 1, backgroundColor: 'var(--bg-color)', minHeight: '100%' }}>
            <ContextHeader title="Daily Digest" subtitle="Curated precision matches and recent application activity." />

            <div style={{ padding: 'var(--space-2) var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: '800px', margin: '0 auto' }}>

                {/* Status History Section */}
                {history.length > 0 && (
                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <h3 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)', opacity: 0.6 }}>Recent Status Updates</h3>
                        <Card style={{ backgroundColor: 'white', border: '1px solid var(--border-color)', padding: 'var(--space-3)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                {history.map((item, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingBottom: '8px',
                                        borderBottom: idx === history.length - 1 ? 'none' : '1px solid #F7F6F3'
                                    }}>
                                        <div>
                                            <span style={{ fontWeight: '600', fontSize: '14px' }}>{item.title}</span>
                                            <span style={{ fontSize: '12px', opacity: 0.5, marginLeft: '8px' }}>at {item.company}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{
                                                fontSize: '11px',
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                                backgroundColor: item.status === 'Rejected' ? '#FEE2E2' : (item.status === 'Selected' ? '#D1FAE5' : '#DBEAFE'),
                                                color: item.status === 'Rejected' ? '#B91C1C' : (item.status === 'Selected' ? '#065F46' : '#1E40AF'),
                                                fontWeight: '600'
                                            }}>{item.status}</span>
                                            <span style={{ fontSize: '11px', opacity: 0.4 }}>{new Date(item.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}

                {/* Digest Section */}
                {!hasPrefs ? (
                    <EmptyState message="Set preferences to generate a personalized digest." />
                ) : !digest ? (
                    <div style={{ textAlign: 'center', padding: 'var(--space-5)' }}>
                        <Button variant="primary" onClick={generateDigest}>Generate Today's 9AM Digest (Simulated)</Button>
                        <p style={{ fontSize: '12px', opacity: 0.5, marginTop: 'var(--space-2)' }}>Demo Mode: Daily 9AM trigger simulated manually.</p>
                    </div>
                ) : digest.empty ? (
                    <EmptyState message="No matching roles today. Check again tomorrow." />
                ) : (
                    <Card style={{ backgroundColor: 'white', padding: 'var(--space-5)', border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                        <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px' }}>Top 10 Jobs For You</h2>
                            <p style={{ fontSize: '14px', opacity: 0.6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>9AM Digest — {digest.date}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                            {digest.jobs.map((job, idx) => (
                                <div key={job.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 'var(--space-3)', borderBottom: idx === 9 ? 'none' : '1px solid #F0F0F0' }}>
                                    <div>
                                        <h4 style={{ fontSize: '16px', marginBottom: '2px' }}>{job.title}</h4>
                                        <p style={{ fontSize: '14px', color: 'var(--accent-color)', fontWeight: '500' }}>{job.company} • {job.location}</p>
                                    </div>
                                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                                        <span style={{ fontSize: '12px', fontWeight: '700', color: getScoreColor(job.matchScore) }}>{job.matchScore}% MATCH</span>
                                        <Button variant="ghost" style={{ fontSize: '12px', padding: '4px 12px' }} onClick={() => window.open(job.applyUrl, '_blank')}>Apply</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: 'var(--space-5)', paddingTop: 'var(--space-3)', borderTop: '2px solid var(--bg-color)', textAlign: 'center' }}>
                            <p style={{ fontSize: '12px', opacity: 0.5, fontStyle: 'italic' }}>
                                This digest was generated based on your preferences.
                            </p>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};

export const Proof = () => {
    const [links, setLinks] = useState(() => {
        return JSON.parse(localStorage.getItem('jobTrackerLinks') || '{"lovable": "", "github": "", "live": ""}');
    });

    const checkedTests = JSON.parse(localStorage.getItem('jobTrackerTests') || '[]');
    const testPassed = checkedTests.length === 10;

    const steps = [
        { name: 'Landing Page', status: 'Completed' },
        { name: 'User Preferences', status: 'Completed' },
        { name: 'Match Scoring Engine', status: 'Completed' },
        { name: 'Interactive Dashboard', status: 'Completed' },
        { name: 'Saved Opportunities', status: 'Completed' },
        { name: 'Daily 9AM Digest', status: 'Completed' },
        { name: 'Status Tracking', status: 'Completed' },
        { name: 'QA Test Checklist', status: testPassed ? 'Completed' : 'Pending' }
    ];

    const handleLinkChange = (key, value) => {
        const next = { ...links, [key]: value };
        setLinks(next);
        localStorage.setItem('jobTrackerLinks', JSON.stringify(next));
    };

    const copySubmission = () => {
        const text = `Job Notification Tracker — Final Submission\n\n` +
            `Lovable Project:\n${links.lovable}\n\n` +
            `GitHub Repository:\n${links.github}\n\n` +
            `Live Deployment:\n${links.live}\n\n` +
            `Core Features:\n` +
            `- Intelligent match scoring\n` +
            `- Daily digest simulation\n` +
            `- Status tracking\n` +
            `- Test checklist enforced`;
        navigator.clipboard.writeText(text);
        alert('Final submission copied to clipboard!');
    };

    const allLinksSet = links.lovable && links.github && links.live;
    const isShipped = allLinksSet && testPassed;

    return (
        <div style={{ flex: 1, backgroundColor: 'var(--bg-color)' }}>
            <ContextHeader title="Project Proof" subtitle="Project 1 — Job Notification Tracker submission summary." />

            <div style={{ padding: 'var(--space-2) var(--space-4)', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                            fontSize: '11px',
                            padding: '4px 12px',
                            borderRadius: '100px',
                            fontWeight: '700',
                            backgroundColor: isShipped ? '#D1FAE5' : (testPassed || allLinksSet ? '#DBEAFE' : '#F3F4F6'),
                            color: isShipped ? '#065F46' : (testPassed || allLinksSet ? '#1E40AF' : '#6B7280')
                        }}>
                            {isShipped ? 'SHIPPED' : (testPassed || allLinksSet ? 'IN PROGRESS' : 'NOT STARTED')}
                        </span>
                    </div>
                    {isShipped && <span style={{ fontSize: '13px', color: '#10B981', fontWeight: '500' }}>Project 1 Shipped Successfully.</span>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                    {/* Step Summary */}
                    <Card style={{ backgroundColor: 'white', padding: 'var(--space-4)' }}>
                        <h4 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-3)', opacity: 0.6 }}>Step Completion Summary</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {steps.map((step, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                    <span>{step.name}</span>
                                    <span style={{ color: step.status === 'Completed' ? '#10B981' : 'var(--accent-color)', fontWeight: '600', fontSize: '12px' }}>
                                        {step.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Artifact Collection */}
                    <Card style={{ backgroundColor: 'white', padding: 'var(--space-4)' }}>
                        <h4 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-3)', opacity: 0.6 }}>Artifact Collection</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '12px', fontWeight: '500' }}>Lovable Project Link</label>
                                <input
                                    type="url"
                                    placeholder="https://lovable.dev/projects/..."
                                    style={{ padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '13px' }}
                                    value={links.lovable}
                                    onChange={(e) => handleLinkChange('lovable', e.target.value)}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '12px', fontWeight: '500' }}>GitHub Repository Link</label>
                                <input
                                    type="url"
                                    placeholder="https://github.com/user/repo"
                                    style={{ padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '13px' }}
                                    value={links.github}
                                    onChange={(e) => handleLinkChange('github', e.target.value)}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '12px', fontWeight: '500' }}>Live Deployment URL</label>
                                <input
                                    type="url"
                                    placeholder="https://project.vercel.app"
                                    style={{ padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '13px' }}
                                    value={links.live}
                                    onChange={(e) => handleLinkChange('live', e.target.value)}
                                />
                            </div>
                        </div>
                    </Card>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--space-2)' }}>
                    <Button
                        variant="primary"
                        disabled={!isShipped}
                        onClick={copySubmission}
                        style={{ opacity: isShipped ? 1 : 0.5 }}
                    >
                        Copy Final Submission
                    </Button>
                </div>
            </div>
        </div>
    );
};

const TEST_ITEMS = [
    { id: '1', label: 'Preferences persist after refresh', desc: 'Set keywords, refresh settings, confirm they are still there.' },
    { id: '2', label: 'Match score calculates correctly', desc: 'Confirm "MATCH %" badge appears and values align with rules.' },
    { id: '3', label: '"Show only matches" toggle works', desc: 'Enable on Dashboard, confirm low-score jobs disappear.' },
    { id: '4', label: 'Save job persists after refresh', desc: 'Save a job, refresh, confirm it remains in "Saved" page.' },
    { id: '5', label: 'Apply opens in new tab', desc: 'Click "Apply", verify a new browser tab opens the URL.' },
    { id: '6', label: 'Status update persists after refresh', desc: 'Change to "Applied", refresh, confirm it stayed "Applied".' },
    { id: '7', label: 'Status filter works correctly', desc: 'Select "Applied" filter, confirm only blue-badged jobs show.' },
    { id: '8', label: 'Digest generates top 10 by score', desc: 'Generate digest, verify it selects the 10 highest matching roles.' },
    { id: '9', label: 'Digest persists for the day', desc: 'Refresh digest page, verify today\'s list is still there.' },
    { id: '10', label: 'No console errors on main pages', desc: 'Open F12 Console, browse app, confirm no red/yellow errors.' }
];

export const TestChecklist = () => {
    const [checkedItems, setCheckedItems] = useState(() => {
        return JSON.parse(localStorage.getItem('jobTrackerTests') || '[]');
    });

    const handleToggle = (id) => {
        const next = checkedItems.includes(id)
            ? checkedItems.filter(i => i !== id)
            : [...checkedItems, id];
        setCheckedItems(next);
        localStorage.setItem('jobTrackerTests', JSON.stringify(next));
    };

    const resetTests = () => {
        if (window.confirm('Are you sure you want to reset all test statuses?')) {
            setCheckedItems([]);
            localStorage.setItem('jobTrackerTests', '[]');
        }
    };

    const passedCount = checkedItems.length;
    const isReady = passedCount === 10;

    return (
        <div style={{ flex: 1, backgroundColor: 'var(--bg-color)' }}>
            <ContextHeader title="Quality Assurance" subtitle="Final verification of all intelligent job tracker features." />

            <div style={{ padding: 'var(--space-2) var(--space-4)', maxWidth: '700px', margin: '0 auto' }}>
                <div style={{
                    backgroundColor: isReady ? 'rgba(16, 185, 129, 0.05)' : 'rgba(139, 0, 0, 0.05)',
                    border: `1px solid ${isReady ? '#10B981' : 'var(--accent-color)'}`,
                    padding: 'var(--space-3) var(--space-4)',
                    borderRadius: 'var(--radius)',
                    marginBottom: 'var(--space-4)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <h4 style={{ fontSize: '18px', marginBottom: '4px' }}>Tests Passed: {passedCount} / 10</h4>
                        {!isReady && <p style={{ fontSize: '14px', color: 'var(--accent-color)' }}>Resolve all issues before shipping.</p>}
                        {isReady && <p style={{ fontSize: '14px', color: '#10B981' }}>System verified. Shipment lock released.</p>}
                    </div>
                    <Button variant="secondary" style={{ fontSize: '12px' }} onClick={resetTests}>Reset Test Status</Button>
                </div>

                <Card style={{ backgroundColor: 'white', padding: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {TEST_ITEMS.map(item => (
                            <div key={item.id} style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 'var(--space-3)',
                                paddingBottom: 'var(--space-2)',
                                borderBottom: '1px solid #F7F6F3'
                            }}>
                                <input
                                    type="checkbox"
                                    checked={checkedItems.includes(item.id)}
                                    onChange={() => handleToggle(item.id)}
                                    style={{ width: '20px', height: '20px', cursor: 'pointer', marginTop: '4px', accentColor: 'var(--accent-color)' }}
                                />
                                <div style={{ flex: 1 }}>
                                    <h5 style={{ fontSize: '16px', marginBottom: '2px', opacity: checkedItems.includes(item.id) ? 0.5 : 1 }}>
                                        {item.label}
                                    </h5>
                                    <p style={{ fontSize: '12px', opacity: 0.5 }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export const Ship = () => {
    const checkedItems = JSON.parse(localStorage.getItem('jobTrackerTests') || '[]');
    const links = JSON.parse(localStorage.getItem('jobTrackerLinks') || '{"lovable": "", "github": "", "live": ""}');

    const testsPassed = checkedItems.length === 10;
    const linksProvided = links.lovable && links.github && links.live;
    const isReady = testsPassed && linksProvided;

    return (
        <div style={{ flex: 1 }}>
            <ContextHeader title="Shipment Center" subtitle="Final deployment and release tracking." />

            <div style={{ padding: '0 var(--space-4)', maxWidth: '800px', margin: '0 auto' }}>
                {!isReady ? (
                    <Card style={{ textAlign: 'center', padding: 'var(--space-5)', border: '1px dashed var(--accent-color)', backgroundColor: 'rgba(139, 0, 0, 0.02)' }}>
                        <div style={{ fontSize: '48px', marginBottom: 'var(--space-3)' }}>🔒</div>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', marginBottom: 'var(--space-2)' }}>Shipment Locked</h2>
                        <p style={{ opacity: 0.6, maxWidth: '400px', margin: '0 auto var(--space-4)' }}>
                            The shipping route is restricted until the following conditions are met:
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left', maxWidth: '300px', margin: '0 auto var(--space-4)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                <span>10/10 Tests Passed</span>
                                <span style={{ color: testsPassed ? '#10B981' : 'var(--accent-color)', fontWeight: '700' }}>
                                    {testsPassed ? 'YES' : `${checkedItems.length}/10`}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                <span>3/3 Artifact Links Provided</span>
                                <span style={{ color: linksProvided ? '#10B981' : 'var(--accent-color)', fontWeight: '700' }}>
                                    {linksProvided ? 'YES' : 'NO'}
                                </span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <Link to="/jt/07-test"><Button variant="secondary">Check Tests</Button></Link>
                            <Link to="/jt/proof"><Button variant="primary">Provide Links</Button></Link>
                        </div>
                    </Card>
                ) : (
                    <Card style={{ textAlign: 'center', padding: 'var(--space-5)', border: '1px solid #10B981', backgroundColor: 'rgba(16, 185, 129, 0.02)' }}>
                        <div style={{ fontSize: '48px', marginBottom: 'var(--space-3)' }}>🚢</div>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', marginBottom: 'var(--space-2)' }}>Shipment Ready</h2>
                        <p style={{ opacity: 0.6, maxWidth: '500px', margin: '0 auto var(--space-4)' }}>
                            Project 1 Shipped Successfully. All verification items and artifact links have been captured.
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'center' }}>
                            <Button variant="primary" onClick={() => alert('Initiating Production Deployment...')}>Deploy to Production</Button>
                            <Button variant="secondary">Archive Artifacts</Button>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};
