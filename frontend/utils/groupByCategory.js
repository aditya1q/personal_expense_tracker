export const groupByCategory = (data) => {
    const grouped = {};

    data.forEach(({ category, amount }) => {
        const numericAmount = parseFloat(amount) || 0;
        if (!grouped[category]) {
            grouped[category] = 0;
        }
        grouped[category] += numericAmount;
    });

    return Object.entries(grouped).map(([category, amount]) => ({ category, amount }));
};