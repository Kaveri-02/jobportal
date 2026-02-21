import React from 'react';

const Card = ({ children, style, ...props }) => {
    return (
        <div
            style={{
                backgroundColor: 'white',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius)',
                padding: 'var(--space-3)',
                ...style
            }}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
