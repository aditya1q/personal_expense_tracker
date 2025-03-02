"use client"

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { fetchTransactionForm } from '@/app/api/transaction';
import { toast } from 'sonner';
import { DatePicker } from '../DatePicker';

const TransactionForm = ({ setOpenForm, onAddTransaction }) => {
    const [formData, setFormData] = useState({
        amount: '',
        category: '',
        description: '',
        payment_method: ''
    });
    const [date, setDate] = React.useState()
    const [isLoading, setIsLoading] = useState(false);
    // console.log(formData)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.amount || !formData.category || !formData.description || !formData.payment_method) {
            toast.error("Please fill in all required fields");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetchTransactionForm({
                date: date,
                ...formData
            });

            // Ensure new transaction structure matches the table structure
            // const newTransaction = {
            //     id: response.transaction.id, // Use the new ID from backend
            //     date: response.transaction.date,
            //     amount: response.transaction.amount,
            //     category: response.transaction.category,
            //     description: response.transaction.description,
            //     payment_method: response.transaction.payment_method,
            // };

            // Update table immediately without refreshing
            onAddTransaction(response);

            toast.success("Transaction successful", {
                description: response.message || "Transaction added successfully",
            });
            setOpenForm(false);
        } catch (error) {
            toast.error("Transaction Failed", {
                description: error.message || "An error occurred",
            });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <Card className="max-w-md w-full mx-auto">
            <CardHeader className="flex flex-row justify-between items-center w-full px-6 py-4">
                <CardTitle className="text-lg font-semibold">Add Transaction</CardTitle>
                <Button
                    aria-label="Close"
                    onClick={() => setOpenForm(false)}
                    className="text-gray-400 bg-transparent hover:bg-transparent hover:text-gray-200">
                    <X className="w-10 h-10 cursor-pointer" />
                </Button>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className='flex flex-col gap-1'>
                        <Label htmlFor="date">Date</Label>
                        <DatePicker date={date} setDate={setDate} />
                    </div>
                    <div>
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                            id="amount"
                            name="amount"
                            type="number"
                            placeholder="Enter amount"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <Label htmlFor="category">Category</Label>
                        <Input
                            id="category"
                            name="category"
                            placeholder="Enter category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            name="description"
                            placeholder="Enter description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <Label htmlFor="payment_method">Payment method</Label>
                        <Select onValueChange={(value) => setFormData({ ...formData, payment_method: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="Credit Card">Credit Card</SelectItem>
                                <SelectItem value="Debit Card">Debit Card</SelectItem>
                                <SelectItem value="gpay">Online Payment</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? "Transaction..." : "Add Transaction"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default TransactionForm;