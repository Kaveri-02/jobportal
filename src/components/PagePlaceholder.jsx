import React from 'react';
import ContextHeader from './ContextHeader';

const PagePlaceholder = ({ title }) => {
    return (
        <div style={{ flex: 1 }}>
            <ContextHeader
                title={title}
                subtitle="This section will be built in the next step."
            />
            <div style={{ padding: '0 var(--space-4)', marginTop: 'var(--space-2)' }}>
                <p style={{ opacity: 0.5, fontSize: '14px' }}>
                    Placeholder content for {title.toLowerCase()}. Generous whitespace and serif headings maintained.
                </p>
            </div>
        </div>
    );
};

export default PagePlaceholder;
