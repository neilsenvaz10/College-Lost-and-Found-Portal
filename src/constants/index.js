export const CATEGORIES = [
  'Electronics',
  'Books & Notes',
  'ID / Cards',
  'Clothing',
  'Accessories',
  'Keys',
  'Other',
];

export const DEPARTMENTS = [
  'Computer Engineering',
  'Information Technology',
  'Electronics & TC',
  'AIDS',
  'ECS',
  'Automation & Robotics',
];

export const GRAD_YEARS = ['2026', '2027', '2028', '2029'];

// Mapping Graduation Year to Academic Year (assuming March 2026 current date)
// 2026 -> 4th Year
// 2027 -> 3rd Year
// 2028 -> 2nd Year
// 2029 -> 1st Year
export const CLASS_MAPPING = {
  'Computer Engineering': {
    '2029': ['D2A', 'D2B', 'D2C'],
    '2028': ['D7A', 'D7B', 'D7C'],
    '2027': ['D12A', 'D12B', 'D12C'],
    '2026': ['D17A', 'D17B', 'D17C'],
  },
  'AIDS': {
    '2029': ['D1ADA', 'D1ADB'],
    '2028': ['D6ADA', 'D6ADB'],
    '2027': ['D11ADA', 'D11ADB'],
    '2026': ['D16ADA', 'D16ADB'],
  },
  'ECS': {
    '2029': ['D1EC'],
    '2028': ['D6EC'],
    '2027': ['D11EC'],
    '2026': ['D16EC'],
  },
  'Electronics & TC': {
    '2029': ['D4A', 'D4B'],
    '2028': ['D9A', 'D9B'],
    '2027': ['D14A', 'D14B'],
    '2026': ['D19A', 'D19B'],
  },
  'Information Technology': {
    '2029': ['D5A', 'D5B', 'D5C'],
    '2028': ['D10A', 'D10B', 'D10C'],
    '2027': ['D15A', 'D15B', 'D15C'],
    '2026': ['D20A', 'D20B', 'D20C'],
  },
  'Automation & Robotics': {
    '2029': ['D3'],
    '2028': ['D8'],
    '2027': ['D13'],
    '2026': ['D18'],
  },
};
export const LOCATIONS = [
  'Library',
  'Canteen',
  'Auditorium',
  'Ground Floor',
  '1st Floor',
  '2nd Floor',
  '3rd Floor',
  '4th Floor',
  '5th Floor',
  'Girls Common Room',
  'Boys Common Room',
  'Gymkhana',
  'Other',
];
