import React, { useState ,useEffect} from "react";
import { useParams } from "react-router-dom";
import "./profile.css";
import axios from "axios";

const Profile = () => {
  const [name,setname] = useState('');
  const [email,setemail] = useState('');
  const [profile,setProfile] = useState('');
  const [tempProfile,setTempProfile] = useState('');
  const url = 'https://chat-application-xf9j.onrender.com';


  useEffect(()=>{
   async function fun(){

    const data = await axios({
      url:`${url}/getUserName/${localStorage.getItem('userId')}`,
        method:'get'
    })
    if(data){
      setname(data.data.data.name);
      setemail(data.data.data.email)
      setTempProfile(data.data.data.ProfileDetail.profilePhoto)
    }
  }
  fun()
  },[])



 async function editData(){


  ('name',name);
  ("email",email);
  
  
  const formData = new FormData();
  formData.append("name",name);
  formData.append("email",email);
  formData.append("profile",profile)
 
 const result =  await axios({
    url:`${url}/editUser/${localStorage.getItem('userId')}`,
    method:'post',
    data:formData,
    headers: { 'Content-Type': 'multipart/form-data' },

  })
}
const [isEditing, setIsEditing] = useState(false);
 
  const handleEditToggle = () => {
    if(isEditing){
      editData();
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile(file)
      setTempProfile(URL.createObjectURL(file));
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          {isEditing ? (
            <div>
               <img
            src={tempProfile}
            alt="Profile"
            className="profile-avatar"
          />
             <label >change profile photo</label>
            <input type="file" name="profile" onChange={handleInputChange}></input>
            </div>

          ):(
          <img
            src={tempProfile}
            alt="Profile"
            className="profile-avatar"
          />
          )}
          <h2>{name}</h2>
{/* <p className="profile-bio">{profile.bio}</p> */}
        </div>
        <div className="profile-details">
          <div className="detail-item">
            <strong>Name:</strong>
            {isEditing ? (
                        <input
                type="text"
                name="name"
                value={name}
                onChange={(e)=>{setname(e.target.value)}}
              />
            ) : (
              <span>{name}</span>
            )}
          </div>
         
        </div>
        <div className="profile-details">
          <div className="detail-item">
            <strong>Email:</strong>
            {isEditing ? (
                        <input
                type="email"
                name="email"
                value={email}
                onChange={(e)=>{setemail(e.target.value)}}
              />
            ) : (
              <span>{email}</span>
            )}
          </div>
         
        </div>
        <button className="edit-button" onClick={handleEditToggle} >
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
