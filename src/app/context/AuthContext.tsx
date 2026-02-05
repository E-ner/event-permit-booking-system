import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "../types";
import api from "../utils/Axios";
import { authStore } from "../../stores/authStore";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("epvbs_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Try to populate from token
      const decoded = authStore.getUser();
      if (decoded) {
        setUser({
          id: decoded.id,
          name: decoded.username,
          email: "",
          role: decoded.role as any,
        });
      }
    }
    setIsLoading(false);
  }, []);

  const normalizeRole = (role: string | undefined) => {
    if (!role) return "organizer";
    const r = role.toUpperCase();
    if (r === "ADMIN") return "AUTHORITY";
    return r;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const token = res.data?.access_token || res.data?.token;
      if (!token) return false;

      authStore.setToken(token);

      // fetch profile
      const profileRes = await api.get("/users/me");
      const prof = profileRes.data;

      // normalize role names (map admin -> AUTHORITY)
      const normalizedRole = normalizeRole(prof.role || prof?.role);

      const userObj: User = {
        id: prof.id || prof.userId || "",
        name: prof.name || prof.username || prof.email || "",
        email: prof.email || email,
        role: normalizedRole.toLowerCase() as any as User["role"],
        organization: prof.organization || prof.org || "",
      };

      localStorage.setItem("epvbs_user", JSON.stringify(userObj));
      setUser(userObj);

      return true;
    } catch (err) {
      return false;
    }
  };

  const logout = () => {
    authStore.clear();
    setUser(null);
    localStorage.removeItem("epvbs_user");
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
