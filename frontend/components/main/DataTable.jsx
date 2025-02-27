"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { headers, Expense_List } from "@/constants/constant";
import { PlusIcon } from "lucide-react";
import TransactionForm from "./TransactionForm";

const DataTable = ({ title, height }) => {
    const [currentRows, setCurrentRows] = useState([]);
    const [visibleRows, setVisibleRows] = useState(6);
    const [openForm, setOpenForm] = useState(false);
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

    const handleOpenForm = () => {
        setOpenForm(true);
    };

    return (
        <div style={{ height: `${height}` }} className="w-full rounded-lg border border-[#1F2937] bg-transparent relative">
            <div className="flex justify-between w-full p-6 items-center sticky top-0 z-20 bg-black">
                <h1 className="text-xl font-bold">{title}</h1>
                <button onClick={handleOpenForm} className="bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg transition duration-300 flex items-center gap-2">
                    <PlusIcon />Add Transaction
                </button>
            </div>

            <table className="w-full table-fixed" style={{ borderCollapse: "separate", borderSpacing: "0 0" }}>
                {headers && (
                    <thead className="sticky top-[84px] bg-[#1A1B20] z-10 whitespace-nowrap w-full">
                        <tr>
                            {headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="text-[12px] p-5 text-left border border-opacity-50 font-normal border-[#1F2937]"
                                    style={{ width: header.width || "auto" }}
                                >
                                    {header.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                )}
            </table>

            <div style={{ maxHeight: `calc(${height} - 150px)` }} className="overflow-hidden overflow-y-auto">
                <table className="w-full table-fixed" style={{ borderCollapse: "separate", borderSpacing: "0 0" }}>
                    <tbody className="text-[15px]">
                        {currentRows.map((row, rowIndex) => {
                            const isLastRow = rowIndex === currentRows.length - 1;
                            return (
                                <tr key={rowIndex} ref={isLastRow ? observeLastRow : null}>
                                    {headers.map((header) => (
                                        <td
                                            key={header.id}
                                            className="p-5 font-light hover:font-normal "
                                        >
                                            {header.id === "Amount" ? (
                                                <div className="text-left">${row[header.id]}</div>
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

            {openForm && (
                <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-30">
                    <TransactionForm setOpenForm={setOpenForm} />
                </div>
            )}
        </div>
    );
};

export default React.memo(DataTable);
