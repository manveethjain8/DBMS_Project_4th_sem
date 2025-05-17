import React, { useContext, useState } from 'react';
import '../css_files/SideWindow.css';
import { Link } from 'react-router-dom';
import { DataContext } from '../context/dataContext';
import { useEffect } from 'react';
import api1 from '../api/axios1';

const SideWindow = () => {
  const {setLoggedInUser, loggedInUser}=useContext(DataContext);

  const [isOpen, setIsOpen] = useState(false);
  const [isUserDetailsOpen, setIsUserDetailsOpen]=useState(false);
  const [isEditCreditsClicked, setIsEditCreditsClicked]=useState(false);
  const [credits, setCredits] = useState('');

  const handleLogout=()=>{
    setLoggedInUser('');
  }

  useEffect(() => {
    if (loggedInUser && loggedInUser.credits !== undefined) {
      setCredits(loggedInUser.credits);
    }
  }, [loggedInUser]);
  

  const handleEditCredits=async(credits)=>{
    try{
      const response=await api1.patch(`/users/update-credits/${loggedInUser.id}`, {credits});
      setLoggedInUser(response.data.user);
      localStorage.setItem('loggedInUser', JSON.stringify(response.data.user));
    }catch(err){
      console.log('Error sending the updated credits from frontend');
    }
  }

  return (
    <>
      <button className="toggleButton" onClick={() => {
          setIsOpen(!isOpen); 
          setIsUserDetailsOpen(false);
        }}>
        {isOpen ? 'Close Panel' : 'Open Panel'}
      </button>
      {isOpen&&
        <div className='sideWindowUnderlay'></div>
      }
      <div className={`sideWindow ${isOpen ? 'open' : ''}`}>
        <div className='userProfilePictureBox'>
          <img className='userProfilePicture' src={loggedInUser?'/assets/profilePictures/shikimori.jpg':'/assets/profilePictures/noProfilePicture.png'} onClick={()=>setIsUserDetailsOpen(!isUserDetailsOpen)}/>
        </div>
        <div className='loginButtonBox'>
            <Link to='/'><button className='loginButton'>Login</button></Link>
        </div>
        <div className='logoutButtonBox'>
            <button className='logoutButton' onClick={()=>handleLogout()}>Logout</button>
        </div>
        <div className='playGameButtonBox'>
          <Link to='/dragon-game'><button className='playGameButton'>Play Game</button></Link>
        </div>
        <div className={`userDetailsWindow ${isUserDetailsOpen?'open':''}`}>
        {loggedInUser ? (
          <>
            <div className='userFirstNameBox'>
              <p><span className='userDetailsHolder'>First Name: </span>{loggedInUser.firstName}</p>
            </div>
            <div className='userLastNameBox'>
              <p><span className='userDetailsHolder'>Last Name: </span>{loggedInUser.lastName}</p>
            </div>
            <div className='userEmailBox'>
              <p><span className='userDetailsHolder'>Email: </span>{loggedInUser.email}</p>
            </div>
            <div className='userCreditsBox'>
              {!isEditCreditsClicked?(
                <>
                  <p><span className='userDetailsHolder'>Credits: </span>{loggedInUser.credits}</p>
                  <button className={`editButton ${isEditCreditsClicked?'red':'green'}`} onClick={()=>{setIsEditCreditsClicked(!isEditCreditsClicked)}}>{isEditCreditsClicked?'Back':'Edit'}</button>
                </>
              ):(
              <>
                <label className='userDetailsHolderLabel'>Credits: </label>
                <input className='creditsInput' type='Number' value={credits} onChange={(e)=>setCredits(e.target.value)}
                  onKeyDown={(e)=>{
                    if(e.key==='Enter'){
                      handleEditCredits(credits);
                      setIsEditCreditsClicked(false);
                    }
                  }}
                />
                <button className={`editButton ${isEditCreditsClicked?'red':'green'}`} onClick={()=>{setIsEditCreditsClicked(!isEditCreditsClicked)}}>{isEditCreditsClicked?'Back':'Edit'}</button>
              </>
              )}
            </div>
          </>
          ) : (
            <p className='userDetailsDefaultText'>Login to view user details</p>
          )}
        </div>
      </div>
    </>
  );
};

export default SideWindow;
