import './App.css';
import Navbar from './components/Navbar';

import {Outlet, createBrowserRouter} from "react-router-dom"
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfieScreen';

function App() {
  return (
    <div>
     <Navbar/>
     <Outlet/>
    </div>
  );
}

export const appRouter = createBrowserRouter([
  {
    path:"/",
    element:<App/>,
    children:[
      {
        path:"/home",
        element:<HomeScreen/>
      },{
        path:"/login",
        element: <LoginScreen/>
      },
      {
        path:"/profile/:userId",
        element: <ProfileScreen/>
      }
    ]
  }
]);
