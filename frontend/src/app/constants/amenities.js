import { Wifi, Wind, Flame, Car, Droplet, UtensilsCrossed, Bath, Armchair, Lamp, Zap } from 'lucide-react';

export const availableAmenities = [
  { id: 'wifi', label: 'WiFi', icon: Wifi },
  { id: 'ac', label: 'Air Conditioning', icon: Wind },
  { id: 'heating', label: 'Heating', icon: Flame },
  { id: 'parking', label: 'Parking', icon: Car },
  { id: 'laundry', label: 'Laundry', icon: Droplet },
  { id: 'kitchen', label: 'Kitchen Access', icon: UtensilsCrossed },
  { id: 'bathroom', label: 'Private Bathroom', icon: Bath },
  { id: 'furnished', label: 'Furnished', icon: Armchair },
  { id: 'desk', label: 'Study Desk', icon: Lamp },
  { id: 'utilities', label: 'Utilities Included', icon: Zap }
];
