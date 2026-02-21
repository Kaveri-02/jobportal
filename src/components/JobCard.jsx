import React, { useState, useEffect } from 'react';
import Card from './Card';
import Badge from './Badge';
import Button from './Button';
import { getScoreColor } from '../utils/scoring';

const JobCard = ({ job, onSave, onApply, onView, onStatusChange }) => {
    // Local status state for immediate UI feedback, though parent handles storage
    const [status, setStatus] = useState(job.status || 'Not Applied');

    useEffect(() => {
        setStatus(job.status || 'Not Applied');
    }, [job.status]);

    const handleStatusUpdate = (newStatus) => {
        setStatus(newStatus);
        if (onStatusChange) onStatusChange(job.id, newStatus);
    };

    const getStatusColor = (s) => {
        switch (s) {
            case 'Applied': return '#3B82F6';   // Blue
            case 'Rejected': return '#EF4444';  // Red
            case 'Selected': return '#10B981';  // Green
            default: return '#6B7280';         // Neutral Grey
        }
    };

    return (
        <Card style={{
            transition: 'var(--transition-base)',
            hover: { borderColor: 'var(--text-primary)' },
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
            position: 'relative'
        }}>
            {job.matchScore !== null && (
                <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: 'var(--space-2)',
                    backgroundColor: getScoreColor(job.matchScore),
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '700',
                    zIndex: 10
                }}>
                    {job.matchScore}% MATCH
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>{job.title}</h3>
                    <p style={{ fontSize: '15px', color: 'var(--accent-color)', fontWeight: '500' }}>{job.company}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <Badge status={job.source === 'LinkedIn' ? 'Shipped' : 'Not Started'} />
                    <span style={{
                        fontSize: '10px',
                        fontWeight: '700',
                        color: getStatusColor(status),
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        {status}
                    </span>
                </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)', fontSize: '13px', opacity: 0.7 }}>
                <span>{job.location} • {job.mode}</span>
                <span>•</span>
                <span>{job.experience}</span>
                <span>•</span>
                <span>{job.salaryRange}</span>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-1)', marginTop: 'var(--space-1)', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 'var(--space-1)', flex: 1 }}>
                    {job.skills.slice(0, 2).map(skill => (
                        <span key={skill} style={{
                            fontSize: '11px',
                            padding: '2px 8px',
                            backgroundColor: '#F0F0F0',
                            borderRadius: '100px',
                            opacity: 0.8
                        }}>
                            {skill}
                        </span>
                    ))}
                </div>

                <select
                    style={{
                        fontSize: '11px',
                        padding: '2px 4px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        backgroundColor: 'transparent',
                        cursor: 'pointer'
                    }}
                    value={status}
                    onChange={(e) => handleStatusUpdate(e.target.value)}
                >
                    <option value="Not Applied">Not Applied</option>
                    <option value="Applied">Applied</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Selected">Selected</option>
                </select>
            </div>

            <div style={{
                marginTop: 'var(--space-2)',
                paddingTop: 'var(--space-2)',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px'
            }}>
                <span style={{ fontSize: '12px', opacity: 0.5 }}>
                    {job.postedDaysAgo === 0 ? 'Posted today' : `Posted ${job.postedDaysAgo} days ago`}
                </span>
                <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                    <Button variant="ghost" style={{ fontSize: '12px', padding: '4px 8px' }} onClick={() => onView(job)}>View</Button>
                    <Button variant="secondary" style={{ fontSize: '12px', padding: '4px 8px' }} onClick={() => onSave(job)}>Save</Button>
                    <Button variant="primary" style={{ fontSize: '12px', padding: '4px 8px' }} onClick={() => onApply(job)}>Apply</Button>
                </div>
            </div>
        </Card>
    );
};

export default JobCard;
