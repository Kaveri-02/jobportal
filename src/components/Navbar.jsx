import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const links = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Saved', path: '/saved' },
        { name: 'Digest', path: '/digest' },
        { name: 'Settings', path: '/settings' },
        { name: 'Proof', path: '/jt/proof' },
        { name: 'Test', path: '/jt/07-test' },
        { name: 'Ship', path: '/jt/08-ship' },
    ];

    const handleToggle = () => setIsOpen(!isOpen);

    const linkStyle = ({ isActive }) => ({
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '500',
        color: 'var(--text-primary)',
        opacity: isActive ? 1 : 0.6,
        padding: 'var(--space-1) 0',
        borderBottom: isActive ? '2px solid var(--accent-color)' : '2px solid transparent',
        transition: 'var(--transition-base)',
        whiteSpace: 'nowrap',
    });

    return (
        <nav style={{
            borderBottom: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-color)',
            padding: '0 var(--space-4)',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <Link to="/" style={{
                fontWeight: '700',
                letterSpacing: '0.05em',
                color: 'var(--accent-color)',
                fontSize: '18px',
                fontFamily: 'var(--font-serif)',
                textDecoration: 'none'
            }}>
                KODNEST
            </Link>

            {/* Desktop Menu */}
            <div className="desktop-menu" style={{ display: 'flex', gap: 'var(--space-4)', height: '100%', alignItems: 'center' }}>
                {links.map((link) => (
                    <NavLink key={link.path} to={link.path} style={linkStyle}>
                        {link.name}
                    </NavLink>
                ))}
            </div>

            {/* Mobile Menu Icon */}
            <button
                onClick={handleToggle}
                style={{
                    display: 'none',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 'var(--space-1)'
                }}
                className="mobile-toggle"
            >
                <div style={{ width: '24px', height: '2px', backgroundColor: 'var(--text-primary)', marginBottom: '4px' }} />
                <div style={{ width: '24px', height: '2px', backgroundColor: 'var(--text-primary)', marginBottom: '4px' }} />
                <div style={{ width: '24px', height: '2px', backgroundColor: 'var(--text-primary)' }} />
            </button>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '64px',
                    left: 0,
                    right: 0,
                    backgroundColor: 'var(--bg-color)',
                    borderBottom: '1px solid var(--border-color)',
                    padding: 'var(--space-2) var(--space-4)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-2)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}>
                    {links.map((link) => (
                        <NavLink key={link.path} to={link.path} style={linkStyle} onClick={() => setIsOpen(false)}>
                            {link.name}
                        </NavLink>
                    ))}
                </div>
            )}

            <style>
                {`
                    @media (max-width: 768px) {
                        .desktop-menu { display: none !important; }
                        .mobile-toggle { display: block !important; }
                    }
                `}
            </style>
        </nav>
    );
};

export default Navbar;
