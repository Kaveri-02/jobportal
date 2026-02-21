import React from 'react';

const Input = ({ label, ...props }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            {label && <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)', opacity: 0.7 }}>{label}</label>}
            <input
                style={{
                    padding: 'var(--space-2)',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'white',
                    fontSize: '14px',
                    fontFamily: 'var(--font-sans)',
                    outline: 'none',
                    transition: 'var(--transition-base)',
                }}
                onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--text-primary)';
                }}
                onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
                {...props}
            />
        </div>
    );
};

export default Input;
