import React from 'react';

const Badge = ({ status = 'Not Started' }) => {
    const styles = {
        'Not Started': { backgroundColor: '#F0F0F0', color: '#666' },
        'In Progress': { backgroundColor: 'rgba(193, 140, 63, 0.1)', color: 'var(--warning-color)' },
        'Shipped': { backgroundColor: 'rgba(74, 103, 65, 0.1)', color: 'var(--success-color)' },
    };

    const currentStyle = styles[status] || styles['Not Started'];

    return (
        <span
            style={{
                padding: '2px 8px',
                borderRadius: '100px',
                fontSize: '11px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                ...currentStyle
            }}
        >
            {status}
        </span>
    );
};

export default Badge;
