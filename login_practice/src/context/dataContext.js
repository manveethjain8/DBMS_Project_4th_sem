import { createContext, useState, useEffect} from "react";
import useAxiosFetch from "../hooks/useAxiosFetch";

const DataContext=createContext({});

const DataProvider=({children})=>{
    const [users, setUsers]=useState([]);
    const [mythicalCreatures, setMythicalCreatures]=useState([]);
    const [cart, setCart]=useState([]);
    const [totalCreatures, setTotalCreatures]=useState(0)
    const [loggedInUser, setLoggedInUser] = useState(() => {
        const savedUser = sessionStorage.getItem('loggedInUser');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [orders, setOrders]=useState([]);
    const [credits, setCredits]=useState(0);
    const [familiars, setFamiliars]=useState([]);
    const [familiarTrigger, setFamiliarTrigger] = useState(false);
    const [cartTrigger, setCartTrigger] = useState(false);
    const [usersTrigger, setUsersTrigger]=useState(false);

    const {data: usersData}=useAxiosFetch(loggedInUser?`http://localhost:5000/users/${loggedInUser.id}`:null );
    const {data: mythicalCreaturesData}=useAxiosFetch('http://localhost:5000/creatures');
    const {data: cartData}=useAxiosFetch(loggedInUser?`http://localhost:5000/cart/${loggedInUser.id}`:null );
    const {data: orderData}=useAxiosFetch(loggedInUser?`http://localhost:5000/orders/${loggedInUser.id}`:null);
    const {data: familiarsData}=useAxiosFetch(loggedInUser?`http://localhost:5000/familiars/${loggedInUser.id}`:null, familiarTrigger);

    useEffect(() => {
        console.log(usersData);
        if (usersData && usersData.credits !== undefined) {
            setLoggedInUser(prevUser => ({
                ...prevUser,
                credits: usersData.credits
            }));
            console.log(loggedInUser);
        }
    }, [usersData]);
    
    

    useEffect(()=>{
        if(mythicalCreaturesData){
            setMythicalCreatures(mythicalCreaturesData);
        }
    },[mythicalCreaturesData]);

    useEffect(() => {
        console.log(cartData);
        if (cartData) {
            setCart(cartData);
            const totalQty = cartData.reduce((sum, item) => sum + item.quantity, 0);
            setTotalCreatures(totalQty);
        }
    }, [cartData, setTotalCreatures, loggedInUser]);

    useEffect(()=>{
        if(loggedInUser && orderData){
            setOrders(orderData);
            setCredits(loggedInUser.credits);
        }
    },[orderData, setOrders])

    useEffect(() => {
        if (loggedInUser) {
            sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
            setCredits(loggedInUser.credits);
        } else {
            sessionStorage.removeItem('loggedInUser');
        }
    }, [loggedInUser, setCredits]);


    useEffect(() => {
        if (loggedInUser && familiarsData) {
          const usersFamiliars = familiarsData.filter(familiar => familiar.userId === loggedInUser.id);
          setFamiliars(usersFamiliars);
        }
      }, [loggedInUser, familiarsData, familiarTrigger]);

    return(
        <DataContext.Provider value={{users,setUsers, mythicalCreatures, setMythicalCreatures, cart, setCart, totalCreatures, setTotalCreatures, loggedInUser, setLoggedInUser, orders, setOrders, credits, setCredits, familiars, setFamiliars, familiarTrigger, setFamiliarTrigger, cartTrigger, setCartTrigger}}>
            {children}
        </DataContext.Provider>
    );
};

export {DataContext, DataProvider};