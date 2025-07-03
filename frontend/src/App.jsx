import './App.css'
import Signup from './component/Signup'
import Login from './component/Login'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Home from './component/Home'
import Chat from './component/Chat'
import Users from './component/Users'
import Profile from './component/Profile'
import CreateGroup from './component/CreateGroup'
import ForgotPassword from './component/ForgotPassword'
function App() {
  
  return (

    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login/>}></Route>
     <Route path="/signup" element={<Signup/>}></Route>
     <Route path='/Home' element={<Home/>}>
     <Route path='/Home/getusers' element={<Users/>}></Route>
     <Route path='/Home/Chat/:sender_id/:chat_id/:name' element={<Chat />}></Route>
     <Route path='/Home/profile' element={<Profile/>}></Route>
     <Route path='/Home/createGroup' element={<CreateGroup/>}></Route>
     
     </Route>
     <Route path='/Login' element={<Login/>}></Route>
     <Route path='/ForgotPassword' element={<ForgotPassword/>}></Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
