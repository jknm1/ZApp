import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  balance: number;
  mt5Accounts: MT5Account[];
}

interface MT5Account {
  id: string;
  login: string;
  password: string;
  server: string;
  accountType: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  createAccount: (email: string, password: string, name: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("zynx_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, password: string) => {
    // Get all users from localStorage
    const usersData = localStorage.getItem("zynx_users");
    const users = usersData ? JSON.parse(usersData) : [];

    // Find user with matching credentials
    const foundUser = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (foundUser) {
      const userData = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        balance: foundUser.balance,
        mt5Accounts: foundUser.mt5Accounts,
      };
      setUser(userData);
      localStorage.setItem("zynx_user", JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("zynx_user");
  };

  const createAccount = (email: string, password: string, name: string) => {
    // Get existing users
    const usersData = localStorage.getItem("zynx_users");
    const users = usersData ? JSON.parse(usersData) : [];

    // Check if email already exists
    if (users.some((u: any) => u.email === email)) {
      return false;
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      balance: 0,
      mt5Accounts: [
        {
          id: "1",
          login: "MT5-" + Math.floor(Math.random() * 1000000),
          password: "Demo" + Math.floor(Math.random() * 10000),
          server: "ZynxCapital-Demo",
          accountType: "Demo Account",
        },
      ],
    };

    users.push(newUser);
    localStorage.setItem("zynx_users", JSON.stringify(users));

    // Auto login
    const userData = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      balance: newUser.balance,
      mt5Accounts: newUser.mt5Accounts,
    };
    setUser(userData);
    localStorage.setItem("zynx_user", JSON.stringify(userData));

    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, createAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}