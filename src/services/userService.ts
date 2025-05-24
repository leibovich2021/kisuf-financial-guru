
import { User, UserData } from '@/types/user';
import { Transaction, Budget } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const USERS_KEY = 'finance_app_users';
const CURRENT_USER_KEY = 'finance_app_current_user';
const USER_DATA_PREFIX = 'finance_app_user_data_';

export const userService = {
  // קבלת כל המשתמשים
  getUsers(): User[] {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  },

  // שמירת משתמשים
  saveUsers(users: User[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  // יצירת משתמש חדש
  createUser(username: string, password: string, displayName: string): User {
    const users = this.getUsers();
    
    // בדיקה אם המשתמש כבר קיים
    if (users.find(u => u.username === username)) {
      throw new Error('שם משתמש כבר קיים');
    }

    const newUser: User = {
      id: uuidv4(),
      username,
      password,
      displayName,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);
    
    // יצירת נתונים ריקים למשתמש החדש
    this.saveUserData(newUser.id, { transactions: [], budgets: [] });
    
    return newUser;
  },

  // התחברות
  login(username: string, password: string): User | null {
    const users = this.getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    }
    
    return null;
  },

  // התנתקות
  logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // קבלת המשתמש הנוכחי
  getCurrentUser(): User | null {
    const currentUser = localStorage.getItem(CURRENT_USER_KEY);
    return currentUser ? JSON.parse(currentUser) : null;
  },

  // שמירת נתוני משתמש
  saveUserData(userId: string, data: UserData): void {
    localStorage.setItem(`${USER_DATA_PREFIX}${userId}`, JSON.stringify(data));
  },

  // קבלת נתוני משתמש
  getUserData(userId: string): UserData {
    const data = localStorage.getItem(`${USER_DATA_PREFIX}${userId}`);
    return data ? JSON.parse(data) : { transactions: [], budgets: [] };
  },

  // מחיקת משתמש (אופציונלי)
  deleteUser(userId: string): void {
    const users = this.getUsers();
    const filteredUsers = users.filter(u => u.id !== userId);
    this.saveUsers(filteredUsers);
    localStorage.removeItem(`${USER_DATA_PREFIX}${userId}`);
    
    // אם זה המשתמש הנוכחי, התנתק
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      this.logout();
    }
  }
};
