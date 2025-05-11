const express=require('express');
const connectDB=require('./config/db');
const userRoutes=require('./routes/userRoutes');
const creaturesRoutes=require('./routes/creaturesRoutes');
const cartRoutes=require('./routes/cartRoutes');
const orderRoutes=require('./routes/orderRoutes');
const familiarsRoutes=require('./routes/familiarsRoutes');
const dragonGameRoutes = require('./routes/dragonGameRoutes');
const cors=require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app=express();

connectDB();

app.use(express.json());

app.use(cors());



app.get('/', (req, res)=>{
    res.send('MongoDB connected to familiarsTavern!');
});


app.use('/users', userRoutes);
app.use('/', creaturesRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/familiars', familiarsRoutes);
app.use('/game', dragonGameRoutes);



const PORT=process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server running on port${PORT}`);
});