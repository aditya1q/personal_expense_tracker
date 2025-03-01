"use client"

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { fetchTransactionForm } from '@/app/api/form';
import { toast } from 'sonner';

const TransactionForm = ({ setOpenForm }) => {
    const [formData, setFormData] = useState({
        amount: '',
        category: '',
        description: '',
        payment_method: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.amount || !formData.category || !formData.description || !formData.payment_method) {
            toast.error("Please fill in all required fields");
            setIsLoading(false);
            return;
        }

        try {
            const response = fetchTransactionForm({
                amount: formData.amount,
                category: formData.category,
                description: formData.description,
                payment_method: formData.payment_method
            })
            toast.success("Transaction successful", {
                description: response.message || "Trasaction added successfully",
            });
            // console.log('Transaction Data:', response.message);
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
                                <SelectItem value="credit_card">Credit Card</SelectItem>
                                <SelectItem value="debit_car">Debit Card</SelectItem>
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