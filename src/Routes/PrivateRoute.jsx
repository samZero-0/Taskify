import { useContext } from "react";


import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../Providers/AuthProvider";


const PrivateRoute = ({children}) => {

    const {user,loading} = useContext(AuthContext);

    const location = useLocation();

    if(loading){
       return <div className="flex justify-center items-center py-[400px]">
        <span className="loading loading-bars loading-lg"></span>
       </div>
    }
    if(user && user?.email){
        return children;
    }
    return <Navigate state={location.pathname} to={`/login`}></Navigate>

    
   
};

export default PrivateRoute;