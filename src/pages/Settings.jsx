import React, { useState, useEffect } from 'react';
import ContextHeader from '../components/ContextHeader';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

const Settings = () => {
    const [prefs, setPrefs] = useState({
        roleKeywords: '',
        preferredLocations: [],
        preferredMode: [],
        experienceLevel: 'Fresher',
        skills: '',
        minMatchScore: 40
    });

    useEffect(() => {
        const savedPrefs = localStorage.getItem('jobTrackerPreferences');
        if (savedPrefs) {
            setPrefs(JSON.parse(savedPrefs));
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('jobTrackerPreferences', JSON.stringify(prefs));
        alert('Preferences saved successfully. Intelligent matching activated.');
    };

    const toggleMultiSelect = (key, value) => {
        setPrefs(prev => {
            const current = prev[key];
            const next = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [key]: next };
        });
    };

    return (
        <div style={{ flex: 1 }}>
            <ContextHeader
                title="Search Preferences"
                subtitle="Configure the deterministic match engine to prioritize the most relevant roles."
            />

            <div style={{ padding: '0 var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: '800px' }}>
                <Card>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                            <Input
                                label="Role Keywords (comma-separated)"
                                placeholder="e.g. React, Frontend, SDE"
                                value={prefs.roleKeywords}
                                onChange={(e) => setPrefs({ ...prefs, roleKeywords: e.target.value })}
                            />
                            <Input
                                label="Key Skills (comma-separated)"
                                placeholder="e.g. JavaScript, Go, AWS"
                                value={prefs.skills}
                                onChange={(e) => setPrefs({ ...prefs, skills: e.target.value })}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                            <label style={{ fontSize: '13px', fontWeight: '500', opacity: 0.7 }}>Preferred Locations</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
                                {['Bangalore', 'Hyderabad', 'Mumbai', 'Pune', 'Chennai', 'Gurgaon', 'Noida', 'Remote'].map(loc => (
                                    <button
                                        key={loc}
                                        onClick={() => toggleMultiSelect('preferredLocations', loc)}
                                        style={{
                                            padding: '4px 12px',
                                            borderRadius: '100px',
                                            fontSize: '12px',
                                            cursor: 'pointer',
                                            border: '1px solid var(--border-color)',
                                            backgroundColor: prefs.preferredLocations.includes(loc) ? 'var(--accent-color)' : 'white',
                                            color: prefs.preferredLocations.includes(loc) ? 'white' : 'inherit',
                                            transition: 'var(--transition-base)'
                                        }}
                                    >
                                        {loc}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                                <label style={{ fontSize: '13px', fontWeight: '500', opacity: 0.7 }}>Work Mode</label>
                                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                    {['Remote', 'Hybrid', 'Onsite'].map(mode => (
                                        <label key={mode} style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <input
                                                type="checkbox"
                                                checked={prefs.preferredMode.includes(mode)}
                                                onChange={() => toggleMultiSelect('preferredMode', mode)}
                                            />
                                            {mode}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                                <label style={{ fontSize: '13px', fontWeight: '500', opacity: 0.7 }}>Experience Level</label>
                                <select
                                    style={{ padding: '8px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', fontSize: '14px' }}
                                    value={prefs.experienceLevel}
                                    onChange={(e) => setPrefs({ ...prefs, experienceLevel: e.target.value })}
                                >
                                    <option value="Fresher">Fresher</option>
                                    <option value="0-1">0-1 Year</option>
                                    <option value="1-3">1-3 Years</option>
                                    <option value="3-5">3-5 Years</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <label style={{ fontSize: '13px', fontWeight: '500', opacity: 0.7 }}>Minimum Match Score Threshold</label>
                                <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--accent-color)' }}>{prefs.minMatchScore}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={prefs.minMatchScore}
                                onChange={(e) => setPrefs({ ...prefs, minMatchScore: parseInt(e.target.value) })}
                                style={{ accentColor: 'var(--accent-color)', cursor: 'pointer' }}
                            />
                            <p style={{ fontSize: '11px', opacity: 0.5 }}>Only jobs above this threshold will show when the "Matches Only" toggle is active.</p>
                        </div>
                    </div>

                    <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-2)' }}>
                        <Button variant="primary" onClick={handleSave}>Save Preferences</Button>
                        <Button variant="secondary" onClick={() => setPrefs({
                            roleKeywords: '',
                            preferredLocations: [],
                            preferredMode: [],
                            experienceLevel: 'Fresher',
                            skills: '',
                            minMatchScore: 40
                        })}>Reset Defaults</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Settings;
