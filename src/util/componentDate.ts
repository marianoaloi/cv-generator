
export const convertDate = (start: string): React.ReactNode => {
    return new Date(start).toLocaleDateString('en-US', {
        year: '2-digit',
        month: '2-digit',
    });
}

export const calculateDateDifference = (startDate: string, endDate: string, languageCode: string): string => {
    // Normalize dates to first day of month
    const start = new Date(startDate.substring(0, 8) + '01');
    const end = new Date(endDate.substring(0, 8) + '01');
    
    // Calculate difference in months
    const yearDiff = end.getFullYear() - start.getFullYear();
    const monthDiff = end.getMonth() - start.getMonth();
    const totalMonths = yearDiff * 12 + monthDiff;
    
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    
    // Language-specific translations
    const translations = {
        'it': {
            year: 'anno',
            years: 'anni',
            month: 'mese',
            months: 'mesi',
            and: 'e'
        },
        'pt': {
            year: 'ano',
            years: 'anos',
            month: 'mês',
            months: 'meses',
            and: 'e'
        },
        'en': {
            year: 'year',
            years: 'years',
            month: 'month',
            months: 'months',
            and: 'and'
        }
    };
    
    // Default to English if language not supported
    const lang = translations[languageCode as keyof typeof translations] || translations.en;
    
    // Build the result string
    const parts: string[] = [];
    
    if (years > 0) {
        const yearText = years === 1 ? lang.year : lang.years;
        parts.push(`${years} ${yearText}`);
    }
    
    if (months > 0) {
        const monthText = months === 1 ? lang.month : lang.months;
        parts.push(`${months} ${monthText}`);
    }
    
    if (parts.length === 0) {
        return `0 ${lang.months}`;
    }
    
    return parts.join(` ${lang.and} `);
}
