import { Search, Filter } from 'lucide-react';

export function DormSeekerFilters({
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
  priceRange,
  setPriceRange,
  roomTypeFilter,
  setRoomTypeFilter,
  genderFilter,
  setGenderFilter,
  distanceFilter,
  setDistanceFilter,
  amenitiesFilter,
  toggleAmenityFilter,
  sortBy,
  setSortBy
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base cursor-pointer"
        >
          <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
          Filters
        </button>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price Range
            </label>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base cursor-pointer"
            >
              <option value="">All Prices</option>
              <option value="0-500">$0 - $500</option>
              <option value="500-750">$500 - $750</option>
              <option value="750+">$750+</option>
            </select>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Room Type
            </label>
            <select
              value={roomTypeFilter}
              onChange={(e) => setRoomTypeFilter(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base cursor-pointer"
            >
              <option value="">All</option>
              <option value="Single Room">Single Room</option>
              <option value="Shared Room">Shared Room</option>
            </select>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gender Preference
            </label>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base cursor-pointer"
            >
              <option value="">No Preference</option>
              <option value="same-only">Same Gender Only</option>
            </select>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Distance
            </label>
            <select
              value={distanceFilter}
              onChange={(e) => setDistanceFilter(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base cursor-pointer"
            >
              <option value="">All Distances</option>
              <option value="0-1">Under 1 km</option>
              <option value="1-3">1-3 km</option>
              <option value="3-5">3-5 km</option>
              <option value="5-10">5-10 km</option>
              <option value="10+">10+ km</option>
            </select>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amenities
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => toggleAmenityFilter("wifi")}
                className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                  amenitiesFilter.includes("wifi") ? "bg-blue-500 dark:bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                WiFi
              </button>
              <button
                onClick={() => toggleAmenityFilter("ac")}
                className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                  amenitiesFilter.includes("ac") ? "bg-blue-500 dark:bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                AC
              </button>
              <button
                onClick={() => toggleAmenityFilter("heating")}
                className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                  amenitiesFilter.includes("heating") ? "bg-blue-500 dark:bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Heating
              </button>
              <button
                onClick={() => toggleAmenityFilter("parking")}
                className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                  amenitiesFilter.includes("parking") ? "bg-blue-500 dark:bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Parking
              </button>
              <button
                onClick={() => toggleAmenityFilter("laundry")}
                className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                  amenitiesFilter.includes("laundry") ? "bg-blue-500 dark:bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Laundry
              </button>
              <button
                onClick={() => toggleAmenityFilter("kitchen")}
                className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                  amenitiesFilter.includes("kitchen") ? "bg-blue-500 dark:bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Kitchen
              </button>
              <button
                onClick={() => toggleAmenityFilter("bathroom")}
                className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                  amenitiesFilter.includes("bathroom") ? "bg-blue-500 dark:bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Private Bathroom
              </button>
              <button
                onClick={() => toggleAmenityFilter("furnished")}
                className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                  amenitiesFilter.includes("furnished") ? "bg-blue-500 dark:bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Furnished
              </button>
              <button
                onClick={() => toggleAmenityFilter("desk")}
                className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                  amenitiesFilter.includes("desk") ? "bg-blue-500 dark:bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Study Desk
              </button>
              <button
                onClick={() => toggleAmenityFilter("utilities")}
                className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                  amenitiesFilter.includes("utilities") ? "bg-blue-500 dark:bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Utilities
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base cursor-pointer"
            >
              <option value="compatibility">Compatibility Match</option>
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
              <option value="distance">Distance to Campus</option>
              <option value="newest">Newest Listings</option>
              <option value="oldest">Oldest Listings</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}