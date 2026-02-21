import React from 'react';

const ContextHeader = ({ title, subtitle }) => {
    return (
        <div style={{ padding: 'var(--space-5) var(--space-4) var(--space-4)', textAlign: 'left' }}>
            <h1 style={{ fontSize: '48px', lineHeight: '1.1', marginBottom: 'var(--space-1)', fontWeight: '400' }}>
                {title}
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-primary)', opacity: 0.6, maxWidth: '720px' }}>
                {subtitle}
            </p>
        </div>
    );
};

export default ContextHeader;
