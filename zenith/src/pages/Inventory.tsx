import React from 'react';
import { motion } from 'motion/react';
import { MOCK_CARS } from '../constants';
import { CarCard } from '../components/CarCard';
import { Search, Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

const CATEGORIES = ['All', 'Sedan', 'SUV', 'Coupe', 'Truck', 'Lux'];

export const Inventory = () => {
  const [activeCategory, setActiveCategory] = React.useState('All');
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredCars = MOCK_CARS.filter(car => {
    const matchesCategory = activeCategory === 'All' || car.type === activeCategory;
    const matchesSearch = car.make.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         car.model.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-surface-bg min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-primary-navy tracking-tight uppercase mb-4">
            Curated Inventory
          </h1>
          <p className="text-secondary-slate max-w-2xl">
            Explore our collection of the world's most sought-after vehicles, meticulously inspected and ready for immediate acquisition.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-surface-border mb-12">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-slate" size={18} />
              <input
                type="text"
                placeholder="Search make, model, or year..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-transparent rounded-lg text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary-navy outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all",
                    activeCategory === cat 
                      ? "bg-primary-navy text-white shadow-md active:scale-95" 
                      : "bg-slate-50 text-secondary-slate hover:bg-slate-100"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Advanced Toggle */}
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-surface-border rounded-lg text-xs font-bold uppercase tracking-widest text-primary-navy hover:bg-slate-50 transition-colors">
              <SlidersHorizontal size={14} />
              Advanced
              <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-sm font-medium text-secondary-slate">
            Showing <span className="text-primary-navy font-bold">{filteredCars.length}</span> outcomes
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-primary-navy">
            <span>SORT:</span>
            <select className="bg-transparent border-none outline-none cursor-pointer">
              <option>Newest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Mileage: Lowest</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car, index) => (
              <CarCard key={car.id} car={car} index={index} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white border border-surface-border rounded-2xl">
              <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-full mx-auto mb-6">
                <Search size={24} className="text-secondary-slate" />
              </div>
              <h3 className="text-xl font-bold text-primary-navy mb-2">No vehicles found</h3>
              <p className="text-secondary-slate">Try adjusting your filters or search query.</p>
              <button 
                onClick={() => {setSearchQuery(''); setActiveCategory('All');}}
                className="mt-6 text-accent-blue font-bold text-sm uppercase hover:underline"
              >
                Clear all filters
              </button>
          </div>
        )}
      </div>
    </div>
  );
};
