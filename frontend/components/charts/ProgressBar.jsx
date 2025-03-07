import React from 'react';

const ProgressBar = ({ data }) => {
    const barColors = ['#FF5733', '#33A1FF', '#85E85C', '#FFC107', '#9B59B6', '#FF6347', '#4CAF50', '#E91E63'];
    const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

    return (
        <div className="w-full h-full p-4 rounded-lg shadow-sm">
            <div className="text-lg flex justify-between items-center font-semibold mb-6 sticky top-0 z-10">
                <h1>Category-wise Spending</h1>
                <p className='pr-4'>₹{totalAmount.toLocaleString('en-IN')}</p>
            </div>
            <div className="flex-1 h-full overflow-y-auto space-y-5 pr-4 pb-12">
                {data.map((item, index) => (
                    <div
                        key={item.id || `${item.category}-${index}`}
                        className="space-y-2"
                    >
                        <div className="flex justify-between items-center">
                            <p className="text-sm font-medium">
                                {item.category}
                            </p>
                            <p className="text-sm font-semibold">
                                ₹{item.amount.toLocaleString()}
                            </p>
                        </div>
                        <div className="relative w-full h-3 rounded-full overflow-hidden bg-gray-100">
                            <div
                                className="absolute top-0 left-0 h-full rounded-full transition-all duration-300"
                                style={{
                                    width: `${Math.min(item.amount, 100)}%`,
                                    backgroundColor: barColors[index % barColors.length]
                                }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
};

export default ProgressBar;