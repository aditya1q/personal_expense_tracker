import React from 'react';
import { Progress } from "@/components/ui/progress";

const ProgressBar = () => {
    const categoryProgress = [
        { category: "Food", value: 40, color: "bg-red-500" },
        { category: "Entertainment", value: 25, color: "bg-blue-500" },
        { category: "Shopping", value: 55, color: "bg-green-500" },
        { category: "Transport", value: 30, color: "bg-yellow-500" },
    ];

    return (
        <div className="w-full">
            <h1 className="text-[15px] font-semibold mb-4">Category-wise Spending</h1>
            {categoryProgress.map((item) => (
                <div key={item.category} className="mb-4">
                    <p className="text-sm mb-1">{item.category}</p>
                    <div className="relative w-full h-2 rounded-full overflow-hidden bg-gray-200">
                        <div className={`absolute top-0 left-0 h-full ${item.color}`} style={{ width: `${item.value}%` }}></div>
                    </div>
                    <p className="text-sm mt-1">{item.value}%</p>
                </div>
            ))}
        </div>
    );
};

export default ProgressBar;