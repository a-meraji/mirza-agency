import { Search } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  hasFaSubdomain: boolean;
}

export default function SearchBar({ 
  searchQuery, 
  setSearchQuery, 
  handleSearch, 
  hasFaSubdomain 
}: SearchBarProps) {
  return (
    <form onSubmit={handleSearch} className="relative flex-1">
      <Search className={`h-5 w-5 absolute ${hasFaSubdomain ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-gray-400`} />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={hasFaSubdomain ? "جستجوی مکالمات..." : "Search conversations..."}
        className={`${hasFaSubdomain ? 'pr-10' : 'pl-10'} py-2 mx-4 border border-gray-300 rounded-md text-sm focus:ring-iconic focus:border-iconic w-full`}
      />
      <button 
        type="submit" 
        className={`absolute inset-y-0 px-3 py-2 text-iconic ${hasFaSubdomain ? 'left-0 ' : 'right-0'}`}
      >
        {hasFaSubdomain ? 'جستجو' : 'Search'}
      </button>
    </form>
  );
} 