import {
    createBrowserRouter,
   
  } from "react-router-dom";

import MainLayout from "../Layouts/MainLayout"
import Login from "../Pages/Login";
// import Home from "../Components/Home";
import PrivateRoute from "./PrivateRoute";
import TaskManagement from "../Pages/TaskManagement";
import Register from "../Pages/Register";


  export const router = createBrowserRouter([
   
      {
        path: "/home",
        element: <MainLayout></MainLayout>,
        children:[
          {
            path:"",
            element:<PrivateRoute><TaskManagement></TaskManagement></PrivateRoute>

          }
        ]
      },
      {
        path:'/',
        element: <Login></Login>
      },
      {
        path:'/register',
        element: <Register></Register>
      }
      
  ]);