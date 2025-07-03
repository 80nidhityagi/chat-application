
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Users() {
  const nav = useNavigate();
  let [user, setuser] = useState([]);
  const url = 'https://chat-application-xf9j.onrender.com';

 async function getUserChat(id,name){

  //jo kisi user ke naam pr click krke ye getuserchat function chala hai chat page kholne se phele hum ye chat model mai jake save krenge ki kisse bat krne ke liye click kiya hai jisse jo home page pr search bar se niche show ho ske (serch bar se niche vo users aayenge jinse hum jayada tr baat krte hai) 

  let obj = {sender:localStorage.getItem('userId'),receiver:id}

 let res =  await axios({
    url:url+'/saveSimpleChat',
    method:'post',
    data:obj

  })
const sender_id = obj.sender;
  nav('/Home')

  }
  useEffect(()=>{ async function fun(){

      const data = await axios({
        url:url+'/allUsers',
        method:'get'
      })
  
    

    if(data){
      
      (data,'result');
      (data.data.users);
      
      
      setuser(data.data.users);
    }
    else{
      alert('data not comes')
    }
  }
    fun();
  },[])

  return (
    <>

<table style={{ width: '20%' }}>
      <thead>
        <tr>
          {/* <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Name</th> */}
        </tr>
      </thead>
      <tbody>
        {user.map((user, index) => (
          <tr key={index} style={{ backgroundColor: 'silver' }}>
            <td  onClick={()=>getUserChat(user._id,user.name)} style={{ border: '1px solid #ddd', padding: '8px', color: 'black',cursor: 'pointer' }}>{user.name}</td>
          </tr>
        ))}
      </tbody>
    </table>



    </>
  )
}
export default Users;