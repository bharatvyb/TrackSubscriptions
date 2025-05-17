// Format date to YYYY-MM-DD (for input elements)
export const formatDateForInput = (dateString: string): string => {
  const date = new Date(dateString);
  return isValidDate(date) 
    ? date.toISOString().split('T')[0]
    : '';
};

// Format date to display format (DD MMM YYYY)
export const formatDateForDisplay = (dateString: string): string => {
  const date = new Date(dateString);
  
  if (!isValidDate(date)) {
    return 'Invalid date';
  }
  
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// Check if date is valid
export const isValidDate = (date: Date): boolean => {
  return !isNaN(date.getTime());
};

// Calculate days remaining until expiry
export const daysRemaining = (expiryDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Get expiry status class for styling
export const getExpiryStatusClass = (expiryDate: string): string => {
  const days = daysRemaining(expiryDate);
  
  if (days < 0) {
    return 'expired';
  } else if (days <= 7) {
    return 'expiring-soon';
  } else if (days <= 30) {
    return 'upcoming';
  } else {
    return 'active';
  }
};

// Get human-readable expiry status
export const getExpiryStatusText = (expiryDate: string): string => {
  const days = daysRemaining(expiryDate);
  
  if (days < 0) {
    return `Expired ${Math.abs(days)} days ago`;
  } else if (days === 0) {
    return 'Expires today';
  } else if (days === 1) {
    return 'Expires tomorrow';
  } else {
    return `Expires in ${days} days`;
  }
};