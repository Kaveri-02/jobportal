import React from 'react';
import Input from './Input';

const FilterBar = ({ filters, onFilterChange, showMatchesOnly, onToggleMatches }) => {
    return (
        <div style={{
            padding: 'var(--space-2) var(--space-4)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-2)',
            alignItems: 'flex-end',
            backgroundColor: 'white'
        }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
                <Input
                    label="Search Roles or Companies"
                    placeholder="e.g. React Developer"
                    value={filters.search}
                    onChange={(e) => onFilterChange('search', e.target.value)}
                />
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-1)', flexDirection: 'column' }}>
                <label style={{ fontSize: '13px', fontWeight: '500', opacity: 0.7 }}>Location</label>
                <select
                    style={{ padding: '8px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', fontSize: '14px' }}
                    value={filters.location}
                    onChange={(e) => onFilterChange('location', e.target.value)}
                >
                    <option value="">All Locations</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Pune">Pune</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Chennai">Chennai</option>
                </select>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-1)', flexDirection: 'column' }}>
                <label style={{ fontSize: '13px', fontWeight: '500', opacity: 0.7 }}>Job Status</label>
                <select
                    style={{ padding: '8px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', fontSize: '14px' }}
                    value={filters.status}
                    onChange={(e) => onFilterChange('status', e.target.value)}
                >
                    <option value="All">All Status</option>
                    <option value="Not Applied">Not Applied</option>
                    <option value="Applied">Applied</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Selected">Selected</option>
                </select>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-1)', flexDirection: 'column' }}>
                <label style={{ fontSize: '13px', fontWeight: '500', opacity: 0.7 }}>Sort By</label>
                <select
                    style={{ padding: '8px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', fontSize: '14px' }}
                    value={filters.sort}
                    onChange={(e) => onFilterChange('sort', e.target.value)}
                >
                    <option value="latest">Latest Feed</option>
                    <option value="match">Match Score</option>
                    <option value="salary">Highest Salary</option>
                </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '10px' }}>
                <label style={{ fontSize: '13px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                        type="checkbox"
                        checked={showMatchesOnly}
                        onChange={(e) => onToggleMatches(e.target.checked)}
                        style={{ accentColor: 'var(--accent-color)' }}
                    />
                    Only above my threshold
                </label>
            </div>
        </div>
    );
};

export default FilterBar;
