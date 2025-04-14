export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  memberId: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  color: string;
}

export interface Budget {
  transactions: Transaction[];
  categories: string[];
  members: FamilyMember[];
}