import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../Providers/AuthProvider";
import { useContext, useEffect, useState } from "react";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { motion } from "framer-motion";
import axios from "axios";
import { Helmet } from "react-helmet";

const MySwal = withReactContent(Swal);

const Login = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { signIn, setUser, googleSignin } = useContext(AuthContext);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleGoogleLogin = () => {
    setIsLoading(true);
    googleSignin()
      .then((res) => {
        const { displayName, photoURL, email } = res.user;
  
        // Prepare the user data to be sent to the backend
        const userData = {
          displayName,
          photoURL,
          email,
          role: "user",
        };
  
        // Send the user data to the backend using Axios
        axios.post('https://assignment-12-blue.vercel.app/users', userData)
          .then((response) => {
            MySwal.fire({
              title: "Welcome Back! 👋",
              text: "Login successful",
              icon: "success",
              timer: 1000,
              timerProgressBar: true,
              showConfirmButton: false,
              background: "#f8fafc",
              iconColor: "#4f46e5",
            });
            setTimeout(() => {
              navigate(location?.state ? location.state : "/");
            }, 500);
          })
          .catch((err) => {
            MySwal.fire({
              title: "Oops!",
              text: `Failed to save user data: ${err.message}`,
              icon: "error",
              background: "#f8fafc",
              confirmButtonColor: "#4f46e5",
            });
          });
      })
      .catch((err) => {
        MySwal.fire({
          title: "Oops!",
          text: `${err.message}`,
          icon: "error",
          background: "#f8fafc",
          confirmButtonColor: "#4f46e5",
        });
      })
      .finally(() => setIsLoading(false));
  };
  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    signIn(email, password)
      .then((res) => {
        setUser(res.user);
        MySwal.fire({
          title: "Welcome Back! 👋",
          text: "Login successful",
          icon: "success",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          background: "#f8fafc",
          iconColor: "#4f46e5",
        });
        setTimeout(() => {
          navigate(location?.state ? location.state : "/");
        }, 800);
      })
      .catch((err) => {
        MySwal.fire({
          title: "Oops!",
          text: `${err.message}`,
          icon: "error",
          background: "#f8fafc",
          confirmButtonColor: "#4f46e5",
        });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8"
    >
        <Helmet>
               
               <title>Login</title>
             
           </Helmet>
      <div className="max-w-7xl w-full mx-auto md:flex gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full md:w-1/2 justify-end md:flex items-center hidden"
        >
          <DotLottieReact
            src="https://lottie.host/3a441e2f-69c5-4ece-a230-35a36c98383e/KlzZq7oCvm.lottie"
            loop
            autoplay
            speed={1}
            style={{ width: "400px", height: "400px" }}
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full md:w-1/2 max-w-md"
        >
          <div className="text-center mb-8">
            <motion.h1 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-4xl font-bold text-gray-900 dark:text-white"
            >
              Welcome Back
            </motion.h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Please sign in to continue</p>
          </div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
          >
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-all"
                  name="email"
                  required
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Password
                </label>
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-all"
                  name="password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute right-4 top-10 text-gray-500 hover:text-gray-700 dark:text-gray-300"
                >
                  {passwordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 px-4 rounded-xl text-white font-medium ${
                  isLoading 
                    ? 'bg-indigo-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } transition-all duration-200 flex items-center justify-center`}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Sign In'
                )}
              </motion.button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleLogin}
                className="w-full py-3 px-4 rounded-xl bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center gap-2"
                type="button"
              >
                <FaGoogle className="text-red-500" />
                <span className="dark:text-white">Sign in with Google</span>
              </motion.button>
            </form>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center text-gray-600 dark:text-gray-300"
          >
            Don't have an account?{" "}
            <Link 
              to="/register" 
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Register now
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Login;
