import { createContext, useState } from "react";
import {
    createUserWithEmailAndPassword,
    getAuth,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
} from "firebase/auth";
import { app } from "../../firebase.config";
// import axios from "axios";
import { toast } from "react-toastify";

export const AuthContext = createContext(null);

const provider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const auth = getAuth(app);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDarkMode, setDarkMode] = useState(false);
   

    const toggleDarkMode = () => {
        setDarkMode((prevMode) => !prevMode);
    };

    const createAccount = async (email, password) => {
        setLoading(true);
        try {
            return await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            toast.error("Error creating account");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email, password) => {
        setLoading(true);
        try {
            return await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            toast.error("Error signing in");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const googleSignin = async () => {
        setLoading(true);
        try {
            return await signInWithPopup(auth, provider);
        } catch (error) {
            toast.error("Error signing in with Google");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logOut = async () => {
        setLoading(true);
        try {
            return await signOut(auth);
        } catch (error) {
            toast.error("Error logging out");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // useEffect(() => {
    //     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    //         setUser(currentUser);

    //         if (currentUser?.email) {
    //             const user = { email: currentUser.email };

    //             axios
    //                 .post("https://assignment-12-blue.vercel.app/jwt", user, { withCredentials: true })
    //                 .then((res) => {
    //                     setLoading(false);
    //                 });
    //         } else {
    //             axios
    //                 .post("https://assignment-12-blue.vercel.app/logout", {}, { withCredentials: true })
    //                 .then((res) => {
    //                     setLoading(false);
    //                 });
    //         }
    //     });

    //     return () => {
    //         unsubscribe();
    //     };
    // }, []);

 

    const userInfo = {
        createAccount,
        signIn,
        googleSignin,
        logOut,
        user,
        loading,
        setUser,
        toggleDarkMode,
        isDarkMode,
        setDarkMode,
        
    };

    return <AuthContext.Provider value={userInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;