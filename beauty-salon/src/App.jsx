
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import Home from './components/Home';
import AdminLogin from './components/AdminLogin';
import AdminRegister from './components/AdminRegister';
import Adminpage from './components/Adminpage';
import CustomerRegistration from './components/CustomerRegistration';
import AdminServices from './components/AdminServices';
import CustomerPage from './components/CustomerPage';
import AdminBookings from './components/AdminBookings';
import EditService from './components/EditService';



function App() {
  return (
   <>
   <Router>
   <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/login" element={<AdminLogin/>}/>
    <Route path="/register" element={<AdminRegister/>}/>
    <Route path="/adminpage" element={<Adminpage/>}/>
    <Route path="/customerregister" element={<CustomerRegistration/>}/>
    <Route path="/adminservices" element={<AdminServices/>}/>
    <Route path="/customerpage" element={<CustomerPage/>}/>
    <Route path="/booking" element={<AdminBookings/>}/>
    <Route path="/editservice" element={<EditService/>}/>

    
   </Routes>
   </Router>
   </>
  )
}

export default App
