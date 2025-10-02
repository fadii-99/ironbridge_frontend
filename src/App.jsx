import './App.css';
import { RouterProvider } from 'react-router-dom';
import router from '../routes/router';
import { UserProvider } from './../src/context/UserProvider';


function App() {

  return (
    <>
    <UserProvider>
      <RouterProvider router={router} />   
    </UserProvider>       
    </>
  )
}


export default App;
