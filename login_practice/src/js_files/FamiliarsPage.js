import React, { useContext, useEffect, useState } from 'react';
import '../css_files/FamiliarsPage.css';
import { Link } from 'react-router-dom';
import { DataContext } from '../context/dataContext';
import api1 from '../api/axios1';
import SideWindow from './SideWindow';


const FamiliarsPage = () => {
  const { familiars, credits, totalCreatures, setFamiliars,loggedInUser } = useContext(DataContext);
  const [userFamiliars, setUserFamiliars] = useState([]);
  
  useEffect(() => {
    setUserFamiliars(familiars);
  }, [familiars]);

  const handleDismiss=async(familiarId, familiarUserId)=>{
    console.log('Deactivating');
    try{
      const requiredCredentials={familiarId, familiarUserId}
      await api1.patch('/familiars/deactivate', requiredCredentials);

      const response=await api1.get(`/familiars/${loggedInUser.id}`);
      setFamiliars(response.data);
    }catch(err){
      console.log('Error deactivating the familiar ');
    }
  }

  const handleActivate=async(familiarId, familiarUserId)=>{
    try{
      const requiredCredentials={familiarId, familiarUserId}
      await api1.patch('/familiars/activate', requiredCredentials);

      const response=await api1.get(`/familiars/${loggedInUser.id}`);
      setFamiliars(response.data);
    }catch(err){
      console.log('Error activating the familiar ');
    }
  }

  const handleFamiliarDelete=async(familiarId, userId)=>{
    try{
      const requiredInfo={familiarId, userId}
      console.log(requiredInfo);
      await api1.delete('/familiars/delete-familiar', {data: requiredInfo});

      const response=await api1.get(`/familiars/${loggedInUser.id}`);
      setFamiliars(response.data);
    }catch(err){
      console.log('Error sending from the frontend',err);
    }
  }
  
  return (
    <div className='familiarsPageContainer'>
      <div className='familiarsPageBackground'>
        <div className='familiarsPageOverlay'></div>
        <div className='familiarsPageHeader'>
          <Link to='/mythicalCreatures'><p className='familiarsPageMythicalCreaturesText'>Mythical Creatures</p></Link>
          <Link to='/selected'><p className='familiarsPageShortListedCreaturesText'>Short Listed</p></Link>
          <Link to='/contracts'><p className='familiarsPageContractsText'>Contracts</p></Link>
          <p className='familiarsPageShortListedCreaturesNumber'>{totalCreatures}</p>
          <div className='familiarsPageCreditsBox'>
            <p className='familiarsPageCreditsText'>Credits: </p>
            <p className='familiarsPageCreditsNumber'>{credits ?? ''}</p>
          </div>
        </div>
      </div>
      <div className='familiarsPageDisplay'>
        {userFamiliars.length > 0 ? (
          userFamiliars.map((familiar) => (
            <div className='familiarsCard' key={familiar._id}>
              <button className='deleteFamiliarButton' onClick={()=>handleFamiliarDelete(familiar._id, familiar.userId)}>X</button>
              <div className='familiarsImageBox'>
                <img className='familiarsImage' src={familiar.image} alt={familiar.name} />
              </div>
              <div className='familiarsNameBox'>
                <p className='familiarsNameText'><span className='familiarHolder'>Name: </span> {familiar.name}</p>
              </div>
              <div className='summoningDateBox'>
                <p className='summoningDateText'><span className='familiarHolder'>Summoned: </span> {familiar.dateTime}</p>
              </div>
              <div className='contractIdBox'>
                <p className='familiarHolderContractId'>Contract Id: </p>
                <p className='contractIdText'>{familiar.orderId} </p>
              </div>
              <div className='familiarStatusBox'>
                <p className='familiarStatusText'><span className='familiarHolder'>Status: </span> {familiar.contract ? 'Active' : 'Deactive'}</p>
              </div>
              {familiar.contract ? (
                  <button className='dismissButton' onClick={() => handleDismiss(familiar._id, familiar.userId)}>Deactivate</button>
                ) : (
                  <button className='activateButton' onClick={() => handleActivate(familiar._id, familiar.userId)}>Activate</button>
              )}
            </div>
          ))
        ) : (
          <p className='familiarsPageDefaultText'>No Familiars yet</p>
        )}
      </div>
      <SideWindow/>
    </div>
  );
};

export default FamiliarsPage;