import { toast } from "react-toastify";

/**
 * @param {string} phoneNumber - Phone number (can include country code and formatting)
 * @param {string} message - Optional pre-filled message
 */
export const openWhatsAppChat = (phoneNumber, message = "") => {
  try {
    if (!phoneNumber) {
      console.error("No phone number provided:", phoneNumber);
      toast.error("Phone number not available");
      return false;
    }
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
  const message = `Hi ${carpool.driverName}, I'm interested in joining your carpool from ${carpool.pickupSpot} to ${userUniversity} on ${carpool.date} at ${carpool.time}.`;
  
  return openWhatsAppChat(
    carpool.driverPhone,
    message
  );
};

/**
 * Contact a dorm provider
 * @param {Object} listing - Dorm listing object
 * @param {string} seekerName - Name of the seeker
 * @param {string} seekerUniversity - University of the seeker
 */
export const contactDormProvider = (listing, seekerName, seekerUniversity) => {
  const isPhoneOnly = typeof listing === "string";

  const providerName = isPhoneOnly
    ? "there"
    : listing.posterName || listing.poster?.name || listing.poster || "there";

  const message = `Hi ${providerName}, I'm interested in your dorm listing on UniMate!

I'm ${seekerName}, a student at ${seekerUniversity}. Let's chat about the room!`;

  const phone = isPhoneOnly
    ? listing
    : listing.whatsapp ||
      listing.posterPhone ||
      listing.providerPhone ||
      listing.phone ||
      listing.poster?.phone ||
      listing.user?.phone;

  return openWhatsAppChat(phone, message);
};

/**
 * Contact a dorm seeker
 * @param {Object} seekerProfile - Seeker's profile object
 * @param {string} providerName - Name of the provider
 * @param {boolean} areRoommates - Whether the provider and seeker are already roommates (for different message content)
 */
export const contactDormSeeker = (seekerProfile, providerName, areRoommates=false) => {
  const seekerPhone = seekerProfile.phone;
  const seekerName = seekerProfile.name;
  
  if (!seekerPhone) {
    console.warn('[WhatsApp] No phone number found for seeker:', seekerName);
    toast.error('Phone number not available');
    return false;
  }

  
  let message;
  if (areRoommates) {
    message = `Hi ${seekerName}! I'm ${providerName}, your roommate. We're connected on UniMate. Looking forward to being roommates!`;
  } else {
    message = `Hi ${seekerName}, I saw your roommate request on UniMate. I'm interested in discussing!`;
  }
  
  return openWhatsAppChat(
    seekerPhone,
    message
  );
};