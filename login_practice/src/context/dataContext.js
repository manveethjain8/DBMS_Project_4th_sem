import { createContext, useState, useEffect } from "react";
import useAxiosFetch from "../hooks/useAxiosFetch";

const DataContext = createContext({});

const DataProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [mythicalCreatures, setMythicalCreatures] = useState([]);
    const [cart, setCart] = useState([]);
    const [totalCreatures, setTotalCreatures] = useState(0);
    const [loggedInUser, setLoggedInUser] = useState(() => {
        const savedUser = sessionStorage.getItem('loggedInUser');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [orders, setOrders] = useState([]);
    const [credits, setCredits] = useState(0);
    const [familiars, setFamiliars] = useState([]);
    const [familiarTrigger, setFamiliarTrigger] = useState(false);
    const [cartTrigger, setCartTrigger] = useState(false);
    const [usersTrigger, setUsersTrigger] = useState(false);
    const [creditsTrigger, setCreditsTrigger] = useState(false);
    const [familiarsTrigger,setFamiliarsTrigger] = useState(false); // Trigger for credits update

    const { data: usersData } = useAxiosFetch(loggedInUser ? `http://localhost:5000/users/${loggedInUser.id}` : null);
    const { data: mythicalCreaturesData } = useAxiosFetch('http://localhost:5000/creatures');
    const { data: cartData } = useAxiosFetch(loggedInUser ? `http://localhost:5000/cart/${loggedInUser.id}` : null);
    const { data: orderData } = useAxiosFetch(loggedInUser ? `http://localhost:5000/orders/${loggedInUser.id}` : null);
    const { data: familiarsData } = useAxiosFetch(loggedInUser ? `http://localhost:5000/familiars/${loggedInUser.id}` : null, familiarsTrigger);

    // Update loggedInUser and credits when usersData changes
    useEffect(() => {
        if (usersData && usersData.credits !== undefined) {
            // Update loggedInUser when usersData is received
            setLoggedInUser(prevUser => {
                return { ...prevUser, credits: usersData.credits };
            });

            // Trigger credits update
            setCreditsTrigger(prev => !prev);
        }
    }, [usersData]);

    // Handle credits update trigger
    useEffect(() => {
        if (loggedInUser) {
            setCredits(loggedInUser.credits); // Sync credits with loggedInUser
        }
    }, [loggedInUser, creditsTrigger]);

    // Update mythical creatures
    useEffect(() => {
        if (mythicalCreaturesData) {
            setMythicalCreatures(mythicalCreaturesData);
        }
    }, [mythicalCreaturesData]);

    // Update cart and total creatures count
    useEffect(() => {
        if (cartData) {
            setCart(cartData);
            const totalQty = cartData.reduce((sum, item) => sum + item.quantity, 0);
            setTotalCreatures(totalQty);
        }
    }, [cartData]);

    // Update orders and credits when orderData or loggedInUser changes
    useEffect(() => {
        if (loggedInUser && orderData) {
            setOrders(orderData);
            setCredits(loggedInUser.credits);  // Ensure credits are always in sync
        }
    }, [orderData, loggedInUser]);

    // Store loggedInUser in sessionStorage and update credits
    useEffect(() => {
        if (loggedInUser) {
            sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
            setCredits(loggedInUser.credits);  // Ensure credits are synced with sessionStorage
        } else {
            sessionStorage.removeItem('loggedInUser');
        }
    }, [loggedInUser]);

    // Update familiars
    useEffect(() => {
        if (loggedInUser && familiarsData) {
            const usersFamiliars = familiarsData.filter(familiar => familiar.userId === loggedInUser.id);
            setFamiliars(usersFamiliars);
        }
    }, [loggedInUser, familiarsData, familiarTrigger]);

    return (
        <DataContext.Provider value={{
            users, setUsers,
            mythicalCreatures, setMythicalCreatures,
            cart, setCart,
            totalCreatures, setTotalCreatures,
            loggedInUser, setLoggedInUser,
            orders, setOrders,
            credits, setCredits,
            familiars, setFamiliars,
            familiarTrigger, setFamiliarTrigger,
            cartTrigger, setCartTrigger,
            creditsTrigger, setCreditsTrigger,  // Expose the creditsTrigger
            familiarsTrigger, setFamiliarsTrigger
        }}>
            {children}
        </DataContext.Provider>
    );
};

export { DataContext, DataProvider };
