'use client';

import React, { useEffect, useState } from 'react';
import { fetchExpenseOverview } from '@/app/api';

const ProgressBar = () => {
    const [categoryData, setCategoryData] = useState([]);

    const barColors = [
        '#FF5733',
        '#33A1FF',
        '#85E85C',
        '#FFC107',
        '#9B59B6',
        '#FF6347',
        '#4CAF50',
        '#E91E63'
    ];

    // Group data by category and sum amounts
    const groupByCategory = (data) => {
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

    useEffect(() => {
        const getChartData = async () => {
            try {
                const response = await fetchExpenseOverview();
                const groupedData = groupByCategory(response);
                setCategoryData(groupedData);
            } catch (error) {
                console.log('Error fetching data:', error);
                setCategoryData([]);
            }
        };
        getChartData();
    }, []);

    // Calculate the total amount for percentage calculation
    const totalAmount = categoryData.reduce((sum, item) => sum + item.amount, 0);

    return (
        <div className="w-full">
            <h1 className="text-[15px] font-semibold mb-4">Category-wise Spending</h1>
            {categoryData.map((item, index) => (
                <div key={item.id || `${item.category}-${index}`} className="mb-4">
                    <p className="text-sm mb-1">{item.category}</p>
                    <div className="relative w-full h-2 rounded-full overflow-hidden bg-gray-200">
                        <div
                            className="absolute top-0 left-0 h-full"
                            style={{ width: `${item.amount}%`, backgroundColor: barColors[index % barColors.length] }}
                        ></div>
                    </div>
                    <p className="text-sm mt-1">{item.amount}₹</p>
                </div>
            ))}
        </div>

    );
};

export default ProgressBar;