import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from 'react-router-dom'; // Corregido: Navigate (mayúscula)

function ProtectedRoute(){
    const { token } = useAuth();
    
    if(!token){
        return <Navigate to="/login" replace/>;
    } else {
        return <Outlet/>;
    }
}
export default ProtectedRoute;