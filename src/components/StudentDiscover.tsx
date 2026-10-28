import React, { useState } from 'react';
import { InternshipListing, Application } from '../types/internship';
import { 
  Building2, 
  MapPin, 
  ExternalLink, 
  Plus, 
  CheckCircle, 
  Sparkles,
  Search
} from 'lucide-react';

interface StudentDiscoverProps {
  listings: InternshipListing[];
  categories: string[];
  applications: Application[];
  onAddFromListing: (listing: InternshipListing) => void;
}

export const StudentDiscover: React.FC<StudentDiscoverProps> = ({
  listings,
  categories,
  applications,
  onAddFromListing,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredListings = listings.filter((item) => {
    if (!item.isPublished) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.companyName.toLowerCase().includes(q) ||
        item.jobRole.toLowerCase().includes(q) ||
        item.requiredSkills.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-black text-black dark:text-white">
      {/* Search & Category Filter */}
      <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campus opportunities..."
            className="w-full pl-8 pr-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-black dark:text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-black text-white dark:bg-white dark:text-black font-bold'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredListings.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
            No published listings found in this category.
          </div>
        ) : (
          filteredListings.map((item) => {
            const isAlreadyTracked = applications.some(
              (a) => a.companyName.toLowerCase() === item.companyName.toLowerCase()
            );

            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-2.5 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-black dark:text-white">
                        {item.companyName}
                      </h4>
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-zinc-100 dark:bg-zinc-800 font-medium">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">{item.jobRole}</p>
                  </div>

                  <span className="text-[10px] font-mono text-zinc-400 shrink-0">
                    Deadline: {item.deadline}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-zinc-600 dark:text-zinc-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-zinc-400" />
                    <span>{item.location}</span>
                  </span>
                  <span>·</span>
                  <span className="font-semibold text-black dark:text-white">
                    {item.stipend}
                  </span>
                </div>

                <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {item.description}
                </p>

                {item.requiredSkills && (
                  <p className="text-[11px] text-zinc-500 bg-zinc-50 dark:bg-zinc-800/60 p-2 rounded-xl">
                    <span className="font-semibold text-black dark:text-white">Skills: </span>
                    {item.requiredSkills}
                  </p>
                )}

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <a
                    href={item.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-zinc-500 hover:text-black dark:hover:text-white flex items-center gap-1 font-medium"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  {isAlreadyTracked ? (
                    <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-black dark:text-white" />
                      <span>Already in Tracker</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => onAddFromListing(item)}
                      className="px-3.5 py-1.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-[11px] font-semibold flex items-center gap-1 active:scale-95 transition-transform"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Track this App</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
