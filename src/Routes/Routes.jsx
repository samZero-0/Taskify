import {
    createBrowserRouter,
   
  } from "react-router-dom";

import MainLayout from "../Layouts/MainLayout"
import Login from "../Pages/Login";
// import Home from "../Components/Home";
import PrivateRoute from "./PrivateRoute";
import TaskManagement from "../Pages/TaskManagement";


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
      }
      
  ]);