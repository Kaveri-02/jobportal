export const calculateMatchScore = (job, userPrefs) => {
    if (!userPrefs) return null;

    let score = 0;

    // 1. Role Keywords (+25 Title, +15 Description)
    if (userPrefs.roleKeywords) {
        const keywords = userPrefs.roleKeywords.toLowerCase().split(',').map(k => k.trim());
        const hasKeywordInTitle = keywords.some(k => job.title.toLowerCase().includes(k));
        const hasKeywordInDesc = keywords.some(k => job.description.toLowerCase().includes(k));

        if (hasKeywordInTitle) score += 25;
        if (hasKeywordInDesc) score += 15;
    }

    // 2. Preferred Locations (+15) - assuming userPrefs.preferredLocations is an array
    if (userPrefs.preferredLocations && userPrefs.preferredLocations.length > 0) {
        if (userPrefs.preferredLocations.includes(job.location)) {
            score += 15;
        }
    }

    // 3. Preferred Mode (+10) - assuming userPrefs.preferredMode is an array
    if (userPrefs.preferredMode && userPrefs.preferredMode.length > 0) {
        if (userPrefs.preferredMode.includes(job.mode)) {
            score += 10;
        }
    }

    // 4. Experience Level (+10)
    if (userPrefs.experienceLevel && job.experience === userPrefs.experienceLevel) {
        score += 10;
    }

    // 5. Skills Overlap (+15)
    if (userPrefs.skills && job.skills) {
        const userSkills = userPrefs.skills.toLowerCase().split(',').map(s => s.trim());
        const jobSkills = job.skills.map(s => s.toLowerCase());
        const hasOverlap = userSkills.some(s => jobSkills.includes(s));
        if (hasOverlap) score += 15;
    }

    // 6. Recency (+5)
    if (job.postedDaysAgo <= 2) {
        score += 5;
    }

    // 7. Source (+5)
    if (job.source === 'LinkedIn') {
        score += 5;
    }

    return Math.min(100, score);
};

export const getScoreColor = (score) => {
    if (score === null) return '#888';
    if (score >= 80) return '#4A6741'; // Green
    if (score >= 60) return '#C18C3F'; // Amber
    if (score >= 40) return '#666';    // Neutral
    return '#A0A0A0';                 // Subtle Grey
};
