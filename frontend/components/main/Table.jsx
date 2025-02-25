"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { headers, Expense_List } from "@/constants/constant";

const Table = () => {
    const [currentRows, setCurrentRows] = useState([]);
    const [visibleRows, setVisibleRows] = useState(6);
    const observer = useRef();

    const loadMoreRows = useCallback(() => {
        if (visibleRows < Expense_List.length) {
            setVisibleRows((prev) => prev + 6);
        }
    }, [visibleRows]);

    const observeLastRow = useCallback(
        (node) => {
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0]?.isIntersecting) {
                    loadMoreRows();
                }
            });

            if (node) observer.current.observe(node);
        },
        [loadMoreRows]
    );

    useEffect(() => {
        setCurrentRows(Expense_List.slice(0, visibleRows));
    }, [visibleRows]);

    return (
        <div className="max-h-[20%] w-full rounded-lg overflow-hidden hover:overflow-auto border border-[#E5E7EB]">
            <table className="w-full table-fixed" style={{ borderCollapse: "separate", borderSpacing: "0 0" }}>
                {headers && (
                    <thead className="sticky top-0 bg-transparent z-10 whitespace-nowrap w-full h-full">
                        <tr>
                            {headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="text-[12px] px-2 py-2 text-left border border-opacity-50 font-normal border-[#E5E7EB]"
                                    style={{ width: header.width || "auto" }}
                                >
                                    {header.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                )}
                <tbody className="text-[11px]">
                    {currentRows.map((row, rowIndex) => {
                        const isLastRow = rowIndex === currentRows.length - 1;
                        const bgClass = rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"; // Tailwind classes
                        return (
                            <tr key={rowIndex} ref={isLastRow ? observeLastRow : null}>
                                {headers.map((header) => (
                                    <td
                                        key={header.id}
                                        className={`${bgClass} px-1.5 py-1.5 border border-opacity-50 border-[#E5E7EB] font-light hover:font-normal leading-[1.8]`}
                                    >
                                        {header.id === "Amount" ? (
                                            <div className="text-right">${row[header.id]}</div> // Right-align Amount with $
                                        ) : (
                                            row[header.id]
                                        )}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default React.memo(Table);