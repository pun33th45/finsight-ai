export enum Category {
  FOOD = 'Food',
  RENT = 'Rent',
  TRAVEL = 'Travel',
  UTILITIES = 'Utilities',
  SUBSCRIPTIONS = 'Subscriptions',
  OTHER = 'Other',
  SHOPPING = 'Shopping',
  ENTERTAINMENT = 'Entertainment'
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: Category;
}

export interface FinancialInsights {
  summary: string;
  tips: string[];
  lastUpdated: number;
}

export interface TrendDataPoint {
  date: string;
  amount: number;
  fullDate: string;
}

export interface CategoryDataPoint {
  name: string;
  value: number;
  transactions: Transaction[];
}
