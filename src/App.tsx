import { useState, useEffect } from 'react';
import './App.css';
import Form from './Components/Common/Form';
import Home from './Components/Home';
import {
  Routes,
  Route,
  useNavigate
} from "react-router-dom";
import { app } from './firebase-config';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OrderPage from './Components/OrderPage';
import Login from './Components/Common/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import PricePage from './Components/PricePage';
import RegionPage from './Components/RegionPage';

function App() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  let navigate = useNavigate();

  const handleAction = (id:any) => {
    const authentication = getAuth();
    if (id === 1) {
      signInWithEmailAndPassword(authentication, email, password)
        .then((response:any) => {
          navigate('/orders')
          sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken)
        })
        .catch((error:any) => {
          console.log(error.code)
          if (error.code === 'auth/wrong-password') {
            toast.error('Плжалуйста, проверьте пароль');
          }
          if (error.code === 'auth/user-not-found') {
            toast.error('Пожалуйста, проверьте Email');
          }
        })
    }
    if (id === 2) {
      createUserWithEmailAndPassword(authentication, email, password)
        .then((response:any) => {
          navigate('/orders')
          sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken)
        })
        .catch((error:any) => {
          if (error.code === 'auth/email-already-in-use') {
            toast.error('Email уже используется');
          }
        })
    }
  }

  useEffect(() => {
    let authToken = sessionStorage.getItem('Auth Token')

    if (!authToken) {
      navigate('/login');
    }
  }, [])

  return (
    <div className="App container-fluid">
      <ToastContainer />
      <Routes>
        <Route path='/login' element={
            <Login
              setEmail={setEmail}
              setPassword={setPassword}
              handleAction={() => handleAction(1)}
            />}
        />
        <Route path='/register' element={
            <Form
              title="Register"
              setEmail={setEmail}
              setPassword={setPassword}
              handleAction={() => handleAction(2)}
            />}
        />
        <Route path='/home' element={ <Home />} />
        <Route path='/orders' element={  <OrderPage />} />
        <Route path='/price' element={  <PricePage />} />
        <Route path='/region' element={ <RegionPage /> } />
      </Routes>
    </div>
  );
}

export default App;