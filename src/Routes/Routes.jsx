import {
    createBrowserRouter,
   
  } from "react-router-dom";

import MainLayout from "../Layouts/MainLayout"
import Login from "../Pages/Login";
import Home from "../Components/Home";


  export const router = createBrowserRouter([
   
      {
        path: "/",
        element: <MainLayout></MainLayout>,
        children:[
          {
            path:"",
            element:<Home></Home>

          }
        ]
      },
      {
        path:'/login',
        element: <Login></Login>
      }
      
  ]);