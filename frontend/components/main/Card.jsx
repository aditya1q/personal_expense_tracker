import { ArrowUpRight, IndianRupee } from 'lucide-react';

const Card = ({ title, value }) => {
    return (
        <div className="bg-gradient-to-br from-[#1F2128] to-[#2A2D37] rounded-2xl w-1/4 h-32 py-4 px-3 lg:px-6 flex flex-col items-center shadow-lg">
            <div className="flex items-center gap-1 w-full">
                <IndianRupee className="text-green-400" size={20} />
                <h1 className="text-sm font-medium text-[#9CA3AF]">{title}</h1>
            </div>
            <p className="text-2xl font-extrabold text-white mt-2 w-full">{value}</p>
            <div className="flex items-center gap-1 mt-1 w-full">
                <ArrowUpRight className="text-green-500" size={16} />
                <p className="text-xs font-medium text-green-400">+1.22% from last month</p>
            </div>
            <p className="text-xs font-medium text-gray-400 mt-1 w-full">
                Today's spending: <span className="text-red-400">$345.50</span>
            </p>
        </div>
    );
};

export default Card;