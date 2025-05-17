import React, { useState, useEffect, useContext } from 'react';
import '../css_files/SelectedPage.css';
import { Link } from 'react-router-dom';
import api1 from '../api/axios1';
import { DataContext } from '../context/dataContext';
import { useNavigate } from 'react-router-dom';
import SideWindow from './SideWindow';


const SelectedPage = () => {
  const navigate = useNavigate();
  const {cart, setCart, loggedInUser, totalCreatures,setTotalCreatures, credits, setCredits, orders, setOrders, setLoggedInUser, familiars, setFamiliars, familiarTrigger, setFamiliarTrigger} = useContext(DataContext)
  const [cartCreatures, setCartCreatures]=useState([]);

  useEffect(() => {
    setCartCreatures(cart)
  },[cart, totalCreatures]);
  

  const handleIncrement= async (creatureId)=>{
    try{
      await api1.patch(`/cart/increment/${creatureId}`,{
        userId: loggedInUser.id,
        creatureId: creatureId
      });

      const response = await api1.get(`/cart/${loggedInUser.id}`);
      setCart(response.data);
      setTotalCreatures(response.data.reduce((total, creature) => total + creature.quantity, 0));
    }catch(err){
      console.log('Front End: Error incrementing the Item')
    }
  }

  const handleDecrement= async (creatureId)=>{
    try{
      await api1.patch(`/cart/decrement/${creatureId}`,{
        userId: loggedInUser.id,
        creatureId: creatureId
      });

      const response = await api1.get(`/cart/${loggedInUser.id}`);
      setCart(response.data);
      setTotalCreatures(response.data.reduce((total, creature) => total + creature.quantity, 0));
    }catch(err){
      console.log('Front End: Error decrementing the Item')
    }
  }
  const handleDelete= async (creatureId)=>{
    try{
      await api1.delete(`/cart/delete/${creatureId}`,{
        userId: loggedInUser.id,
        creatureId: creatureId
      });

      const response = await api1.get(`/cart/${loggedInUser.id}`);
      setCart(response.data);
      setTotalCreatures(response.data.reduce((total, creature) => total + creature.quantity, 0));
    }catch(err){
      console.log('Front End: Error deleting the Item')
    }
  }

  let TBT=cart.reduce((total, creature) => total + creature.cost * creature.quantity, 0);
  let TAT=TBT+TBT*0.10;

  const handleSummon = async () => {
    try {
      if (credits < TAT) {
        alert('You don\'t have enough credits. Deselect some familiars to summon.');
        return;
      }
  
      const newOrder = {
        userId: loggedInUser.id,
        familiars: cartCreatures.map(creature => ({
          familiarId: creature.creatureId,
          name: creature.name,
          quantity: creature.quantity,
          image: creature.image,
          cost: creature.cost,
          dateTime: getLocalDateTime(),
        })),
        totalCost: TAT,
        dateTime: getLocalDateTime(),
      };

      console.log('New Order',newOrder);
      console.log('New Order',newOrder.familiars);
  
      const response = await api1.post('/orders/summon', newOrder);
      const postedOrder = response.data;
      setOrders([...orders, postedOrder]);
  

      await handleFamiliars(postedOrder);
  
      const updatedCredits = credits - TAT;
      await api1.patch(`/users/update-credits/${loggedInUser.id}`, { credits: updatedCredits });
      setLoggedInUser({ ...loggedInUser, credits: updatedCredits });
      setCredits(updatedCredits);
  
      try{
        await api1.delete(`/cart/delete-cart/${loggedInUser.id}`);
        setCart([]);
        setTotalCreatures(0);
      }catch(err){
        console.log('Error reseting the cart');
      }
  
      alert('Summon Successful!');
    } catch (err) {
      console.error('Error placing the order:', err);
      alert('Error placing the order');
    }
  };
  

  const getLocalDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };


  const handleFamiliars = async (latestOrder) => {
    console.log('Before add the new familiars', familiars);
    try {
      const newFamiliars = latestOrder.familiars.map(fam => ({
        ...fam,
        userId: loggedInUser.id,
        orderId: latestOrder._id,
        familiarId: fam.familiarId,
        name:fam.name,
        image:fam.image,
        dateTime: fam.dateTime,
        contract: true,
      }));

      console.log('add to familiars db',newFamiliars);
      
      let updatedUserFamiliers=[...familiars];
      for (const fam of newFamiliars) {
        const response=await api1.post('/familiars/add-user-familiar', fam);
        updatedUserFamiliers=[...updatedUserFamiliers, response.data];
      }
      console.log(updatedUserFamiliers);
      setFamiliars(updatedUserFamiliers);
      console.log(familiars);
  
      // Trigger the refetch
      setFamiliarTrigger(prev => !prev);
  
    } catch (err) {
      console.log('Error updating familiars:', err);
    }
  };
  
  return (
    <div className='selectedPageContainer'>
      <div className='selectedPageOverlay'></div>
      <div className='selectedPageHeader'>
          <Link to='/mythicalCreatures'><p className='selectedPageMythicalCreaturesText'>Mythical Creatures</p></Link>
          <Link to='/contracts'><p className='selectedPageContractsText'>Contracts</p></Link>
          <Link to='/familiars'><p className='selectedPageFamiliarsText'>Familiars</p></Link>
          <div className='selectedPageCreditsBox'>
            <p className='selectedPageCreditsText'>Credits: </p>
            <p className='selectedPageCreditsNumber'>{credits??''}</p>
          </div>
      </div>
      <div className='selectedPageDisplay'>
        <div className='selectedCreaturesDisplay'>
          {cartCreatures.length>0?(cartCreatures.map((creature)=>(
              <div className='selectedCreatureCard' key={creature._id}>
              <div className='selectedCreatureImageBox'>
                <img className='selectedCreatureImage' src={creature.image}/>
              </div>
              <div className='selectedCreatureDetailsBox'>
                <div className='selectedCreatureNameBox'>
                  <p className='selectedCreatureNameText'>{creature.name}</p>
                </div>
                <div className='selectedCreatureDescriptionBox'>
                  <p className='selectedCreatureDescriptionText'>{creature.description}</p>
                </div>
                <div className='selectedCreatureCostBox'>
                  <p className='selectedCreatureCostText'>Cost: {creature.cost}</p>
                </div>
                <div className="selectedCreatureQuantityBox">
                      <p className="selectedCreatureQuantityText">Quantity: </p>
                      <button className="selectedCreatureDecreaseButton" onClick={()=>handleDecrement(creature._id)}>-</button>
                      <p className="selectedCreatureQuantityNumber">{creature.quantity} </p>
                      <button className="selectedCreatureIncreaseButton" onClick={()=>handleIncrement(creature._id)}>+</button>
                </div>
                <button className="selectedCreatureRemoveButton" onClick={()=>handleDelete(creature._id)}>Remove</button>
              </div>
            </div>
          ))):(<p className='addCreaturesText'>Add Creatures</p>)}
        </div>
      </div>
      {cartCreatures.length>0?(
        <div className='cartSummaryDisplay'>
        <div className='summaryTextBox'>
          <p className='summaryText'>Summary</p>
        </div>
        <div className='totalCreaturesBox'>
          <p className='totalCreaturesText'>Number of Familiars: </p>
          <p className='totalCreaturesNumber'>{cartCreatures.reduce((total, creature) => total + creature.quantity, 0)}</p>
        </div>
        <div className='totalCostBox'>
          <p className='totalCostText'>Familiar's Cost: </p>
          <p className='totalCostNumber'>{TBT.toFixed(2)}</p>
        </div>
        <div className='tavernFeeBox'>
          <p className='tavernFeeText'>Tavern's Fee: </p>
          <p className='tavernFeeNumber'>{(TBT*0.10).toFixed(2)}</p>
        </div>
        <div className='actualTotalCostBox'>
          <p className='actualTotalCostText'>Total: </p>
          <p className='actualTotalCostNumber'>{TAT.toFixed(2)}</p>
        </div>
        <button className='summonCreaturesButton' onClick={()=>handleSummon()}>Summon</button>
      </div>
      ):(<p className='addToCart'>Add to cart to view familiar summary</p>)}
      <SideWindow/>
    </div>
  )
}

export default SelectedPage
