import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: 'var(--space-5) var(--space-4)',
            minHeight: '60vh'
        }}>
            <h1 style={{
                fontSize: '64px',
                maxWidth: '800px',
                lineHeight: '1.1',
                marginBottom: 'var(--space-2)',
                color: 'var(--text-primary)'
            }}>
                Stop Missing The Right Jobs.
            </h1>
            <p style={{
                fontSize: '20px',
                opacity: 0.6,
                maxWidth: '600px',
                marginBottom: 'var(--space-4)',
                lineHeight: '1.6'
            }}>
                Precision-matched job discovery delivered daily at 9AM.
            </p>
            <Button
                variant="primary"
                style={{ scale: '1.2', padding: 'var(--space-2) var(--space-4)' }}
                onClick={() => navigate('/settings')}
            >
                Start Tracking
            </Button>
        </div>
    );
};

export default LandingPage;
