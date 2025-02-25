// components/Search.js
import { Search as SearchIcon } from "lucide-react"; // Rename to avoid conflict
import { Input } from "@/components/ui/input"; // Adjust path to Shadcn Input

const Search = ({ placeholder = "Search transactions..." }) => {
    return (
        <div className="w-full bg-[#16171C] rounded-lg border border-[#2D2E33] relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#A1A1AA]" />
            <Input
                placeholder={placeholder}
                className="w-full bg-[#16171C] border-none pl-10 text-[#E4E4E7] placeholder:text-[#71717A] focus:ring-2 focus:ring-[#3B82F6] focus:ring-opacity-50"
            />
        </div>
    );
};

export default Search;