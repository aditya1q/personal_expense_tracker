export const groupByDate = (data) => {
    const grouped = {};

    data.forEach(({ date, amount }) => {
        const localDate = new Date(date);
        const formattedDate = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, "0")}-${String(localDate.getDate()).padStart(2, "0")}`;

        const numericAmount = parseFloat(amount) || 0;

        if (!grouped[formattedDate]) {
            grouped[formattedDate] = { date: formattedDate, amount: 0 };
        }
        grouped[formattedDate].amount += numericAmount;
    });

    return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
};
