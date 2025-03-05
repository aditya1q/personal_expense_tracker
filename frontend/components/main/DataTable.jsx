"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { headers } from "@/constants/constant";
import { PlusIcon } from "lucide-react";
import TransactionForm from "./TransactionForm";
import { fetchTransactionData } from "@/app/api";
import { format } from "date-fns";

const DataTable = ({ title, height, limit, initialData }) => {
    const [visibleRows, setVisibleRows] = useState(limit || 6);
    const [openForm, setOpenForm] = useState(false);
    const [data, setData] = useState(initialData || []);
    const [isLoading, setIsLoading] = useState(false);
    const observer = useRef();

    const loadMoreRows = useCallback(() => {
        if (!limit && visibleRows < data.length) {
            setVisibleRows((prev) => prev + 6);
        }
    }, [visibleRows, data.length, limit]);

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

    const getData = async () => {
        setIsLoading(true);
        try {
            const fetchedData = await fetchTransactionData();
            const transactions = limit ? fetchedData.slice(-limit) : fetchedData;
            setData(transactions);
        } catch (error) {
            console.error("Error fetching data:", error);
            setData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!initialData.length) getData(); // Fetch only if no initial data
    }, [limit]);

    const formatDate = (dateStr) => {
        if (!dateStr || isNaN(new Date(dateStr).getTime())) return "Invalid Date";
        return dateStr.includes(",") ? dateStr : format(new Date(dateStr), "EEE, dd MMM yyyy");
    };

    const handleNewTransaction = () => {
        getData(); // Refresh data after adding a transaction
        setOpenForm(false);
    };

    return (
        <div style={{ maxHeight: `${height}` }} className="w-full rounded-lg border border-[#1F2937] bg-transparent relative overflow-hidden">
            <div className="flex justify-between w-full p-6 items-center sticky top-0 z-20 bg-transparent">
                <h1 className="text-xl font-bold">{title}</h1>
                {!limit && (
                    <button
                        onClick={() => setOpenForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg transition duration-300 flex items-center gap-2"
                    >
                        <PlusIcon /> Add Transaction
                    </button>
                )}
            </div>
            <table className="w-full table-fixed" style={{ borderCollapse: "separate", borderSpacing: "0 0" }}>
                {headers && (
                    <thead className="sticky top-[84px] bg-[#1A1B20] z-10 whitespace-nowrap w-full">
                        <tr>
                            {headers.map((header) => (
                                <th key={header.id} className="text-[14px] p-5 text-left font-semibold">
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
                        {isLoading ? (
                            <tr>
                                <td colSpan={headers.length} className="p-5 text-center">Loading...</td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={headers.length} className="p-5 text-center">No data available</td>
                            </tr>
                        ) : (
                            data.slice(0, visibleRows).reverse().map((row, rowIndex) => {
                                const isLastRow = rowIndex === Math.min(visibleRows, data.length) - 1;
                                return (
                                    <tr
                                        key={rowIndex}
                                        ref={isLastRow ? observeLastRow : null}
                                        className="hover:bg-[#242528] hover:font-normal"
                                    >
                                        {headers.map((header) => (
                                            <td key={header.id} className="p-5 font-light text-left capitalize">
                                                {header.id === "date" ? formatDate(row[header.id]) : row[header.id]}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
            {openForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 w-screen h-screen">
                    <TransactionForm setOpenForm={setOpenForm} onAddTransaction={handleNewTransaction} />
                </div>
            )}
        </div>
    );
};

export default React.memo(DataTable);