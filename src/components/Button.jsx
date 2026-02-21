import React from 'react';

const Button = ({ variant = 'primary', children, ...props }) => {
    const baseStyle = {
        padding: 'var(--space-1) var(--space-3)',
        borderRadius: 'var(--radius)',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'var(--transition-base)',
        border: '1px solid transparent',
        fontFamily: 'var(--font-sans)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-1)',
    };

    const variants = {
        primary: {
            backgroundColor: 'var(--accent-color)',
            color: 'white',
        },
        secondary: {
            backgroundColor: 'transparent',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
        },
        ghost: {
            backgroundColor: 'transparent',
            color: 'var(--text-primary)',
            padding: 'var(--space-1)',
        }
    };

    const hoverStyles = variant === 'primary'
        ? { opacity: 0.9 }
        : { backgroundColor: 'rgba(0,0,0,0.05)' };

    return (
        <button
            style={{
                ...baseStyle,
                ...variants[variant],
            }}
            onMouseOver={(e) => {
                Object.assign(e.currentTarget.style, hoverStyles);
            }}
            onMouseOut={(e) => {
                Object.assign(e.currentTarget.style, {
                    ...variants[variant],
                    backgroundColor: variants[variant].backgroundColor || 'transparent'
                });
            }}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
