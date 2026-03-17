/**
 * Favorites/saved listings management utilities
 * Shared across Profile.jsx and DormSeekerDashboard.jsx
 */

/**
 * Toggles a favorite listing (add if not present, remove if present)
 * @param {string} id - Listing ID to toggle
 * @param {Array} favorites - Current favorites array
 * @param {Function} setFavorites - State setter for favorites
 * @param {string} storageKey - LocalStorage key (default: 'favoriteDorms')
 */
export const toggleFavorite = (id, favorites, setFavorites, storageKey = 'favoriteDorms') => {
  let updatedFavorites;
  if (favorites.includes(id)) {
    updatedFavorites = favorites.filter(favId => favId !== id);
  } else {
    updatedFavorites = [...favorites, id];
  }
  setFavorites(updatedFavorites);
  localStorage.setItem(storageKey, JSON.stringify(updatedFavorites));
  
  // Dispatch custom event to notify other components
  window.dispatchEvent(new Event('favoritesUpdated'));
};

/**
 * Removes a specific favorite listing
 * @param {string} id - Listing ID to remove
 * @param {Array} favorites - Current favorites array
 * @param {Function} setFavorites - State setter for favorites
 * @param {string} storageKey - LocalStorage key (default: 'favoriteDorms')
 */
export const removeFavorite = (id, favorites, setFavorites, storageKey = 'favoriteDorms') => {
  const updatedFavorites = favorites.filter(favId => favId !== id);
  setFavorites(updatedFavorites);
  localStorage.setItem(storageKey, JSON.stringify(updatedFavorites));
  
  // Dispatch custom event to notify other components
  window.dispatchEvent(new Event('favoritesUpdated'));
};

/**
 * Loads favorites from localStorage
 * @param {string} storageKey - LocalStorage key (default: 'favoriteDorms')
 * @returns {Array} Array of favorite IDs
 */
export const loadFavoritesFromStorage = (storageKey = 'favoriteDorms') => {
  const storedFavorites = localStorage.getItem(storageKey);
  return storedFavorites ? JSON.parse(storedFavorites) : [];
};
