import { toast } from "react-toastify";

/**
 * Opens WhatsApp chat with a phone number
 * @param {string} phoneNumber - Phone number (can include country code and formatting)
 * @param {string} message - Optional pre-filled message
 */
export const openWhatsAppChat = (phoneNumber, message = "") => {
  try {
    // Remove any non-digit characters from phone number
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // Build WhatsApp URL
    let whatsappUrl = `https://wa.me/${cleanPhone}`;
    
    // Add message if provided
    if (message) {
      whatsappUrl += `?text=${encodeURIComponent(message)}`;
    }
    
    // Open in new tab
    window.open(whatsappUrl, '_blank');
    
    return true;
  } catch (error) {
    console.error('Error opening WhatsApp:', error);
    toast.error('Could not open WhatsApp. Please try again.');
    return false;
  }
};

/**
 * Contact a carpool driver
 * @param {Object} carpool - Carpool object with driver details
 * @param {string} userUniversity - Current user's university
 */
export const contactCarpoolDriver = (carpool, userUniversity) => {
  const message = `Hi ${carpool.driverName}, I'm interested in joining your carpool from ${carpool.pickupLocation} to ${userUniversity} on ${carpool.date} at ${carpool.time}. Available seats: ${carpool.seats}`;
  
  return openWhatsAppChat(
    carpool.driverPhone,
    message
  );
};

/**
 * Contact a dorm provider (seeker contacting provider about a listing)
 * @param {Object} listing - Dorm listing object
 * @param {string} seekerName - Name of the seeker
 * @param {string} seekerUniversity - University of the seeker
 */
export const contactDormProvider = (listing, seekerName, seekerUniversity) => {
  const providerName = listing.posterName || listing.poster || 'there';
  const listingTitle = listing.title || 'your dorm listing';
  
  const message = `Hi ${providerName}, I'm interested in your dorm listing "${listingTitle}" on UniMate!

I'm ${seekerName}, a student at ${seekerUniversity}. Let's chat about the room!`;
  
  return openWhatsAppChat(
    listing.whatsapp || listing.posterPhone,
    message
  );
};

/**
 * Contact a dorm seeker (provider contacting a seeker)
 * @param {Object} seekerProfile - Seeker's profile object
 * @param {string} providerName - Name of the provider
 * @param {string} providerEmail - Email of the provider
 */
export const contactDormSeeker = (seekerProfile, providerName, providerEmail) => {
  const seekerPhone = seekerProfile.phone;
  const seekerName = seekerProfile.name;
  const seekerEmail = seekerProfile.email;
  
  if (!seekerPhone) {
    console.warn('[WhatsApp] No phone number found for seeker:', seekerName);
    toast.error('Phone number not available');
    return false;
  }
  
  // Check if they are already roommates (active relationship)
  const activeRoommates = JSON.parse(localStorage.getItem('activeRoommates') || '[]');
  const areRoommates = activeRoommates.some(rm => 
    (rm.userEmail === providerEmail && rm.roommateEmail === seekerEmail && rm.status === 'active') ||
    (rm.roommateEmail === providerEmail && rm.userEmail === seekerEmail && rm.status === 'active')
  );
  
  let message;
  if (areRoommates) {
    // Already roommates - different message
    message = `Hi ${seekerName}! I'm ${providerName}, your roommate. We're connected on UniMate. Looking forward to being roommates!`;
  } else {
    // Pending request or first contact
    message = `Hi ${seekerName}, I saw your roommate request on UniMate. I'm interested in discussing! 😊`;
  }
  
  return openWhatsAppChat(
    seekerPhone,
    message
  );
};