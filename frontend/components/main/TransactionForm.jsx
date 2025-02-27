"use client"

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

const TransactionForm = ({ setOpenForm }) => {
    const [formData, setFormData] = useState({
        amount: '',
        category: '',
        description: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Transaction Data:', formData);
    };

    return (
        <Card className="max-w-md w-full mx-auto">
            {/* for cross icon */}
            <CardHeader className="flex flex-row justify-between items-center w-full px-6 py-4">
                <CardTitle className="text-lg font-semibold">Add Transaction</CardTitle>
                <button onClick={() => setOpenForm(false)} aria-label="Close" className="text-gray-500 hover:text-gray-700">
                    <X className="w-6 h-6 cursor-pointer" />
                </button>
            </CardHeader>
            {/* <CardHeader>
                <CardTitle className='text-[20px]'>Add Transaction</CardTitle>
            </CardHeader> */}
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
                        />
                    </div>

                    <div>
                        <Label htmlFor="category">Category</Label>
                        <Select onValueChange={(value) => setFormData({ ...formData, category: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="income">Income</SelectItem>
                                <SelectItem value="expense">Expense</SelectItem>
                            </SelectContent>
                        </Select>
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
                        />
                    </div>

                    <Button type="submit" className="w-full">Add Transaction</Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default TransactionForm;