import React from 'react';

const Layout = ({ children, secondaryPanel }) => {
    return (
        <div style={{ display: 'flex', flex: 1, padding: '0 var(--space-4) 80px' }}>
            <div style={{ width: '70%', paddingRight: 'var(--space-4)' }}>
                {children}
            </div>
            <div
                style={{
                    width: '30%',
                    borderLeft: '1px solid var(--border-color)',
                    paddingLeft: 'var(--space-4)',
                    minHeight: 'calc(100vh - 200px)'
                }}
            >
                {secondaryPanel}
            </div>
        </div>
    );
};

export default Layout;
