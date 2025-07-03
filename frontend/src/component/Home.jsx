import React, { useState } from 'react';
import './Home.css';
import { FaUserCircle, FaUsers, FaSearch, FaUserPlus, FaUser } from 'react-icons/fa'; // FaUserPlus for "Add User"
import { FaSignOutAlt } from 'react-icons/fa'; // Importing the logout icon
import axios from 'axios';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Home = () => {
    let nav = useNavigate();
    const url = 'https://chat-application-wrb2.onrender.com';

    const location = useLocation();
    
    useEffect(() => {
        getChatValeUsers(); // Fetch the chat users when the location changes
    }, [location]);
   

    const [users,setUsers] = useState([]);

    // State for search input
    let [searchTerm, setSearchTerm] = useState('');
    // let [user,setuser]= useState([])

    function logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('userId')

        alert('you are logged out')
        nav('/Login')


    }

    // Filter users based on search input
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const uniqueFilteredUsers = [
        ...new Map(filteredUsers.map(user => [`${user.name}_${user._id}`, user])).values()
    ];

    async function getChatValeUsers(){
        const userid = localStorage.getItem('userId')
        const result = await axios({
          url:url+'/getChatUser/'+userid,
          method:'get',
        })
        if(result.data.success){  
         setUsers(result.data.data);
        }else{
            console.log("error h kuch");
        }
    }

        useEffect(()=>{            
            getChatValeUsers();
            
        },[])
      
    return (
        <div className="home-container">
            {/* Sidebar */}
            <div className="sidebar">
                {/* Icons Section */}
                <div className="icon-section">
                    {/* Profile Icon */}
                    <FaUserCircle className="profile-icon" onClick={(e)=>{
                        e.preventDefault();
                        nav('/Home/profile')
                        }} title="Your Profile" />

                    {/* View All Users Icon */}
                    <FaUsers className="view-all-icon" onClick={(e) => {  e.preventDefault()
                        nav('/Home/getusers')}} title="View All Users" />

                    {/* Add User Icon */}
                    <FaUserPlus className="add-user-icon" onClick={(e)=>nav('/Home/createGroup')} title="Add User" />
                    <button className="logout-btn" onClick={logout}>
                        <FaSignOutAlt />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* User List */}

                <div className="user-list">
                {/* nav(`/Home/Chat/${sender_id}/${receiver_id}/${name}`); */}

                    {uniqueFilteredUsers.map(user => (
                        <div key={user._id} className="user-item"  onClick={()=>nav(`/Home/Chat/${localStorage.getItem('userId')}/${user.chat_id}/${user.name}`)}
                        >
                            <FaUser className="user-icon" />
                            <span  >{user.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Dashboard */}
            <div className="right-dashboard">
                {/* <h1>Dashboard</h1>
                <p>Welcome to the chat dashboard!</p> */}
                {/* <div>{user}</div> */}
                {/* <Users/> */}

                {/* <div>{user.map((u,i)=>
            <h4 key={i}>{u.name}</h4>
            )}</div> */}

                <Outlet />
            </div>
        </div>
    );
};

export default Home;
