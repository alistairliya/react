import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute = ({ children }) => {
  
    const { user } = useAuth();
    //console.log("user is: " + JSON.stringify(user))
    if (!user) {
        console.log("Not logged in!")
        // user is not authenticated
        return <Navigate to="/login" />;
    }
    return children;
};