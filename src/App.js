import './App.css';
import Home from './screens/Home';
import Insert from './screens/Insert';
import Login from './screens/Login';
import Products from './screens/Products';
import {
  BrowserRouter as Router, Routes, Route,
  Navigate, Outlet
} from 'react-router-dom';
import { useState } from 'react';
import Users from './screens/Users';


function App() {

  // đọc thông tin user từ localStorage
  const getUserInfoFromLocalStorage = () => {
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      return JSON.parse(userInfo);
    }
    return null;
  }
  // lưu thông tin user vào localStorage
  const saveUserInfoToLocalStorage = (userInfo) => {
    console.log('save user... ', user)
    if (!userInfo) {
      localStorage.removeItem('user');
      setUser(null);
    } else {
      localStorage.setItem('user', JSON.stringify(userInfo));
      setUser(userInfo);
    }
  }
  // state user
  const [user, setUser] = useState(getUserInfoFromLocalStorage());

  // các route không cần login
  const PublicRoute = () => {
    if (user) { // nếu đã login thì cho vào trang chủ
      return <Navigate to="/" />
    }
    return <Outlet /> // cho đi tiếp
  }

  // các route cần login
  const PrivateRoute = () => {
    if (!user) { // nếu chưa login thì cho vào trang login
      return <Navigate to="/login" />
    }
    return <Outlet />
  }
  return (
    <div className="App" >
      <Router>
        <Routes>
          <Route element={<PublicRoute />}>

            <Route path='/login' element={<Login saveUser={saveUserInfoToLocalStorage} />} />

          </Route>

          <Route element={<PrivateRoute />}>
            <Route path='/' element={<Home />} />
            <Route path='/users' element={<Users />} />
            <Route path='/insert-product' element={<Insert />} />
            <Route path='/products' element={<Products />} />
          </Route>

        </Routes>
      </Router>
    </div>
  );
}

export default App;
