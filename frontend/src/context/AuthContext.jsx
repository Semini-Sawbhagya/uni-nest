import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  const navigate = useNavigate();

  const isTokenValid = (token) => {
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  };

  const login = (token) => {
    if (!token) return;
    
    try {
      Cookies.set("accessToken", token, {
        secure: true,
        sameSite: "Strict",
        expires: 7
      });
      
      const decoded = jwtDecode(token);
      setUser(decoded.role);
    } catch (error) {
      console.error("Login error:", error);
      logout();
    }
  };

  const logout = () => {
    setUser(null);
    Cookies.remove("accessToken");
    navigate("/");
  };

  const loadUserFromToken = () => {
    setIsLoading(true);
    const token = Cookies.get("accessToken");

    if (token && isTokenValid(token)) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded.role);
      } catch (error) {
        console.error("Token validation error:", error);
        logout();
      }
    } else {
      logout();
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    loadUserFromToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);