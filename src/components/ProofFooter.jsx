import React from 'react';

const ProofFooter = ({ items }) => {
    return (
        <div
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: '64px',
                backgroundColor: 'white',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 var(--space-4)',
                gap: 'var(--space-4)',
                zIndex: 100,
            }}
        >
            {items.map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: '13px' }}>
                    <div style={{
                        width: '16px',
                        height: '16px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: item.completed ? 'var(--text-primary)' : 'transparent'
                    }}>
                        {item.completed && <div style={{ width: '6px', height: '6px', backgroundColor: 'white' }} />}
                    </div>
                    <span style={{ opacity: item.completed ? 1 : 0.5 }}>{item.label}</span>
                </div>
            ))}
        </div>
    );
};

export default ProofFooter;
