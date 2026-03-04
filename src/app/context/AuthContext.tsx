import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../lib/supabase";
import bcrypt from "bcryptjs";

interface User {
  id: string;
  email: string;
  name: string;
  balance: number;
  country?: string;
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
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  createAccount: (email: string, password: string, name: string) => Promise<boolean>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage (for session persistence)
    const storedUserId = localStorage.getItem("zynx_user_id");
    if (storedUserId) {
      loadUser(storedUserId);
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async (userId: string) => {
    try {
      // Fetch user from Supabase
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (userError || !userData) {
        console.error("Error loading user:", userError);
        localStorage.removeItem("zynx_user_id");
        setLoading(false);
        return;
      }

      // Fetch MT5 accounts
      const { data: mt5Data, error: mt5Error } = await supabase
        .from("mt5_accounts")
        .select("*")
        .eq("user_id", userId);

      const mt5Accounts = mt5Data?.map((account) => ({
        id: account.id,
        login: account.account_number || account.login || "",
        password: account.investor_password || account.password || "",
        server: account.broker_server || account.server || "",
        accountType: account.account_type || "MT5 Account",
      })) || [];

      const userObject = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        balance: userData.balance,
        country: userData.country,
        mt5Accounts,
      };

      setUser(userObject);
    } catch (error) {
      console.error("Error loading user:", error);
      localStorage.removeItem("zynx_user_id");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Find user by email
      const { data: userData, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (error) {
        console.error("Login error:", error);
        return false;
      }

      if (!userData) {
        // No user found
        return false;
      }

      // Compare password with hashed password
      const isPasswordValid = await bcrypt.compare(password, userData.password);
      
      if (!isPasswordValid) {
        console.log("Invalid password");
        return false;
      }

      // Fetch MT5 accounts
      const { data: mt5Data } = await supabase
        .from("mt5_accounts")
        .select("*")
        .eq("user_id", userData.id);

      const mt5Accounts = mt5Data?.map((account) => ({
        id: account.id,
        login: account.account_number || account.login || "",
        password: account.investor_password || account.password || "",
        server: account.broker_server || account.server || "",
        accountType: account.account_type || "MT5 Account",
      })) || [];

      const userObject = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        balance: userData.balance,
        country: userData.country,
        mt5Accounts,
      };

      setUser(userObject);
      localStorage.setItem("zynx_user_id", userData.id);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("zynx_user_id");
  };

  const createAccount = async (email: string, password: string, name: string) => {
    try {
      // Check if email already exists
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (existingUser) {
        return false;
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const { data: newUser, error: userError } = await supabase
        .from("users")
        .insert({
          email,
          password: hashedPassword,
          name,
          balance: 0,
        })
        .select()
        .single();

      if (userError || !newUser) {
        console.error("Error creating user:", userError);
        return false;
      }

      // Create demo MT5 account
      const { data: mt5Account, error: mt5Error } = await supabase
        .from("mt5_accounts")
        .insert({
          user_id: newUser.id,
          broker_server: "ZynxCapital-Demo",
          account_number: "MT5-" + Math.floor(Math.random() * 1000000),
          investor_password: "Demo" + Math.floor(Math.random() * 10000),
          status: "active",
        })
        .select()
        .single();

      if (mt5Error) {
        console.error("Error creating MT5 account:", mt5Error);
      }

      const mt5Accounts = mt5Account ? [{
        id: mt5Account.id,
        login: mt5Account.account_number || "",
        password: mt5Account.investor_password || "",
        server: mt5Account.broker_server || "",
        accountType: "Demo Account",
      }] : [];

      // Auto login
      const userObject = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        balance: newUser.balance,
        country: newUser.country,
        mt5Accounts,
      };

      setUser(userObject);
      localStorage.setItem("zynx_user_id", newUser.id);
      
      // Create welcome notification for new user
      try {
        await supabase.from("notifications").insert({
          user_id: newUser.id,
          type: "success",
          title: "Welcome to ZYNX CAPITAL!",
          message: "Your account has been successfully created. Start your trading journey today!",
          read: false,
        });
      } catch (notifError) {
        // Silently fail if notifications table doesn't exist
        console.log("Notification creation skipped (table may not exist)");
      }
      
      return true;
    } catch (error) {
      console.error("Error creating account:", error);
      return false;
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      // Remove mt5Accounts from updates as it's in a separate table
      const { mt5Accounts, ...userUpdates } = updates;

      // Update user in Supabase
      const { error } = await supabase
        .from("users")
        .update(userUpdates)
        .eq("id", user.id);

      if (error) {
        console.error("Error updating profile:", error);
        return;
      }

      // Update local state
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const refreshUser = async () => {
    if (!user) return;

    try {
      // Fetch user from Supabase
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (userError || !userData) {
        console.error("Error refreshing user:", userError);
        localStorage.removeItem("zynx_user_id");
        setUser(null);
        return;
      }

      // Fetch MT5 accounts
      const { data: mt5Data, error: mt5Error } = await supabase
        .from("mt5_accounts")
        .select("*")
        .eq("user_id", user.id);

      const mt5Accounts = mt5Data?.map((account) => ({
        id: account.id,
        login: account.account_number || account.login || "",
        password: account.investor_password || account.password || "",
        server: account.broker_server || account.server || "",
        accountType: account.account_type || "MT5 Account",
      })) || [];

      const userObject = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        balance: userData.balance,
        country: userData.country,
        mt5Accounts,
      };

      setUser(userObject);
    } catch (error) {
      console.error("Error refreshing user:", error);
      localStorage.removeItem("zynx_user_id");
      setUser(null);
    }
  };

  if (loading) {
    return null; // Or return a loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, createAccount, updateUserProfile, refreshUser }}>
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