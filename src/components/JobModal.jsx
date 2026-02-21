import React from 'react';
import Button from './Button';

const JobModal = ({ job, onClose }) => {
    if (!job) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: 'var(--space-4)'
        }} onClick={onClose}>
            <div style={{
                backgroundColor: 'white',
                maxWidth: '600px',
                width: '100%',
                borderRadius: 'var(--radius)',
                padding: 'var(--space-4)',
                maxHeight: '80vh',
                overflowY: 'auto'
            }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                    <div>
                        <h2 style={{ fontSize: '24px', fontFamily: 'var(--font-serif)' }}>{job.title}</h2>
                        <p style={{ color: 'var(--accent-color)', fontWeight: '600' }}>{job.company}</p>
                    </div>
                    <Button variant="ghost" onClick={onClose}>✕</Button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', fontSize: '14px', opacity: 0.8 }}>
                    <span>{job.location} • {job.mode}</span>
                    <span>•</span>
                    <span>{job.experience}</span>
                    <span>•</span>
                    <span>{job.salaryRange}</span>
                </div>

                <div style={{ marginBottom: 'var(--space-4)' }}>
                    <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-1)', opacity: 0.6 }}>Description</h4>
                    <p style={{ lineHeight: '1.6', color: 'var(--text-primary)' }}>{job.description}</p>
                </div>

                <div style={{ marginBottom: 'var(--space-4)' }}>
                    <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-1)', opacity: 0.6 }}>Technical Stack</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {job.skills.map(skill => (
                            <span key={skill} style={{
                                padding: '4px 12px',
                                backgroundColor: 'var(--bg-color)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '4px',
                                fontSize: '13px'
                            }}>
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-2)', borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-3)' }}>
                    <Button variant="primary" style={{ flex: 1 }} onClick={() => window.open(job.applyUrl, '_blank')}>Apply Personally</Button>
                    <Button variant="secondary" onClick={onClose}>Close</Button>
                </div>
            </div>
        </div>
    );
};

export default JobModal;
