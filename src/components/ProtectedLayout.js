
import { Navigate, useOutlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Button from "@mui/material/Button";
//import { AppBar } from "./AppBar";

export const ProtectedLayout = () => {
  const { user, logout } = useAuth();
  const outlet = useOutlet();

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div>
          <Button
            key={"logout"}
            onClick={logout}
            sx={{ my: 2, color: "blue", display: "block" }}
            >Logout
          </Button>
      {outlet}
    </div>
  );
};