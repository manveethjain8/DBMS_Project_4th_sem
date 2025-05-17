import React, { useContext } from 'react';
import '../css_files/ContractPage.css';
import { Link } from 'react-router-dom';
import { DataContext } from '../context/dataContext';
import api1 from '../api/axios1';
import SideWindow from './SideWindow';

const ContractPage = () => {
  const {credits,orders, totalCreatures, loggedInUser, setOrders}=useContext(DataContext);

  const handleDeleteContract = async(contractId, userId)=>{
    try{
      const requiredInfo={contractId, userId}
      console.log(requiredInfo);
      await api1.delete('/orders/delete-contract', {data:requiredInfo});

      const response=await api1.get(`/orders/${loggedInUser.id}`);
      setOrders(response.data);
    }catch(err){
      console.log('Error sending from frontend');
    }
  }

  return (
    <div className='contractPageContainer'>
      <div className='contractPageBackground'>
        <div className='contractPageOverlay'></div>
        <div className='contractPageHeader'>
          <Link to='/mythicalCreatures'><p className='contractPageMythicalCreaturesText'>Mythical Creatures</p></Link>
          <Link to='/selected'><p className='contractPageShortListedCreaturesText'>Short Listed</p></Link>
          <Link to='/familiars'><p className='contractPageFamiliarsText'>Familiars</p></Link>
          <p className='contractPageShortListedCreaturesNumber'>{totalCreatures}</p>
          <div className='contractPageCreditsBox'>
            <p className='contractPageCreditsText'>Credits: </p>
            <p className='contractPageCreditsNumber'>{credits??''}</p>
          </div>
        </div>
        <div className='contractPageDisplay'>
          {orders.length>0?(
            orders.map((order)=>(
              <div className='contractCard' key={order._id}>
              <button className='contractDeleteButton' onClick={()=>handleDeleteContract(order._id, order.userId)}>X</button>
              <div className='contractPageContractIdBox'>
                <p className='contractPageContractIdText'><span className='contractPageHolder'>Contract Id: </span> {order._id}</p>
              </div>
              <div className='contractItemsBox'>
                {order.familiars.map((familiar)=>(
                  <div className='contractItemsCard' key={familiar.familiarId}>
                    <div className='contractItemImageBox'>
                      <img className='contractItemImage' src={familiar.image}/>
                    </div>
                    <div className='contractItemNameBox'>
                      <p className='contractItemNameText'><span className='contractPageHolder'>Name:</span> {familiar.name}</p>
                    </div>
                    <div className='contractItemCostBox'>
                      <p className='contractItemCostText'><span className='contractPageHolder'>Cost:</span> {familiar.cost}</p>
                    </div>
                    <div className='contractItemQuantityBox'>
                    <p className='contractItemQuantityText'><span className='contractPageHolder'>Quantity:</span> {familiar.quantity}</p>
                    </div>
                    <div className='contractItemTotalCostBox'>
                      <p className='contractItemTotalCostText'><span className='contractPageHolder'>Total Unit Cost:</span> {familiar.quantity*familiar.cost}</p>
                    </div>
                    <div className='contractItemDateTimeBox'>
                      <p className='contractItemDateTimeText'><span className='contractPageHolder'>Date:</span> {familiar.dateTime}</p>
                    </div>
                 </div>
                ))}
              </div>
              <div className='contractTotalBox'>
                <p className='contractTotalText'><span className='contractPageHolder'>Total Cost: </span> {order.totalCost}</p>
                <p className='dateTimeText'><span className='contractPageHolder'>Contract Date: </span> {order.dateTime}</p>
              </div>
            </div>
            ))
          ):(<p className='contractPageDefaultText'>No contracts Yet</p>)}
        </div>
      </div>
      <SideWindow/>
    </div>
  )
}

export default ContractPage

