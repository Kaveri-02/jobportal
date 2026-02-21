import React from 'react';
import Badge from './Badge';

const TopBar = ({ projectName, currentStep, totalSteps, status }) => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 var(--space-4)',
                height: '64px',
                borderBottom: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-color)',
            }}
        >
            <div style={{ fontWeight: '600', fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {projectName}
            </div>

            <div style={{ fontSize: '13px', color: 'var(--text-primary)', opacity: 0.6 }}>
                Step {currentStep} / {totalSteps}
            </div>

            <Badge status={status} />
        </div>
    );
};

export default TopBar;
