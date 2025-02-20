import { useContext } from "react";
import { AuthContext } from "../Providers/AuthProvider";

const Home = () => {

    const {user} = useContext(AuthContext)
    // console.log(user);
    


    return (
        <div>
           {user?.displayName}


           {/* <button className="p-3 border" onClick={handleLogout}>Log out</button> */}


        </div>

       
    );
};

export default Home;