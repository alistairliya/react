import { createContext, useContext, useMemo } from "react";
import {  useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import {ROOT_URL} from '../constants'
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = async (data) => {
    // With User ID andd PW, get the token
    let formData = new FormData();
    formData.append('username', data['email']);
    formData.append('password', data['password']);
    const res = await fetch(ROOT_URL+'/api-token-auth/',{
        method:'POST',
        body:formData
    }) 
    const result = await res.json()
    const token = result['token'] // If success, store the token and navigate to sashboard.
    // Otherwise display login error.
    if(res.status === 200){
        setUser(result);
        //navigate("/dashboard");
        // Don't need above. ProtectedLayout and HomeLayout will
        //  eventually route based on if user is set.
}   else{
    }
  };

  // call this function to sign out logged in user
  const logout = () => {
    setUser(null);
    navigate("/", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    
    return useContext(AuthContext);
};