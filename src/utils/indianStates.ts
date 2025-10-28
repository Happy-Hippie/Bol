export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

export const formatINR = (amount: number): string => {
  const numStr = amount.toString();
  const lastThree = numStr.substring(numStr.length - 3);
  const otherNumbers = numStr.substring(0, numStr.length - 3);

  if (otherNumbers !== '') {
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }
  return lastThree;
};

export const getINRDescription = (amount: number): string => {
  if (amount < 100000) {
    return `₹${formatINR(amount)} = ${(amount / 1000).toFixed(1)} Thousands`;
  } else if (amount < 10000000) {
    return `₹${formatINR(amount)} = ${(amount / 100000).toFixed(2)} Lakhs`;
  } else {
    return `₹${formatINR(amount)} = ${(amount / 10000000).toFixed(2)} Crores`;
  }
};

export const validatePinCode = (pinCode: string): boolean => {
  return /^\d{6}$/.test(pinCode);
};
