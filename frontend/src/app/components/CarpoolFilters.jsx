import React from 'react';
import { Calendar, Clock, DollarSign, User, Info, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { getDayAbbreviation } from '../utils/carpoolHelpers';

/**
 * Carpool Filters Component
 * Reusable filter panel for carpool search
 */
export function CarpoolFilters({
  showFilters,
  setShowFilters,
  startDateFilter,
  setStartDateFilter,
  timeSort,
  setTimeSort,
  priceFilter,
  setPriceFilter,
  genderFilter,
  setGenderFilter,
  selectedDaysFilter,
  toggleDayFilter
}) {
  return (
    <div className="mb-6">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="ml-auto flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer rounded-lg border border-gray-200 dark:border-slate-700 m-4"
      >
        <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Filters</span>
        {showFilters ? (
          <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      {/* Collapsible Filter Content */}
      {showFilters && (
        <div className="border-t border-gray-200 dark:border-slate-700 p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date (From)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="date"
                  value={startDateFilter}
                  onChange={(e) => setStartDateFilter(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort by Depart Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <select
                  value={timeSort}
                  onChange={(e) => setTimeSort(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 appearance-none cursor-pointer"
                >
                  <option value="">No Sorting</option>
                  <option value="earliest-to-latest">Earliest to Latest</option>
                  <option value="latest-to-earliest">Latest to Earliest</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort by Price
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 appearance-none cursor-pointer"
                >
                  <option value="">No Sorting</option>
                  <option value="low-to-high">Low to High</option>
                  <option value="high-to-low">High to Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gender Preference
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 appearance-none cursor-pointer"
                >
                  <option value="both">Any Gender</option>
                  <option value="same">Same Gender Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Schedule Days Filter */}
          <div className="mt-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Filter by Class Days
            </label>
            <div className="flex flex-wrap gap-2">
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                <button
                  key={day}
                  onClick={() => toggleDayFilter(day)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                    selectedDaysFilter.includes(day)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {getDayAbbreviation(day)}
                </button>
              ))}
            </div>
            {selectedDaysFilter.length > 0 ? (
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 flex items-center gap-1">
                <Info className="w-3 h-3" />
                {selectedDaysFilter.length === 1 
                  ? `Showing rides that include ${getDayAbbreviation(selectedDaysFilter[0])} (and possibly other days)`
                  : `Showing rides that include ALL of: ${selectedDaysFilter.map(d => getDayAbbreviation(d)).join(', ')} (and possibly other days)`
                }
              </p>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                <Info className="w-3 h-3" />
                All displayed rides already match your class schedule
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}