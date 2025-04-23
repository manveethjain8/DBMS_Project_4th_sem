import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css_files/LoginPage.css';
import { useNavigate } from'react-router-dom';
import api1 from '../api/axios1';
import { DataContext } from '../context/dataContext';

const LoginPage = () => {
    const{setLoggedInUser}=useContext(DataContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validEmail, setValidEmail] = useState(true);
    const [validPassword, setValidPassword] = useState(true);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        try{
            const response=await api1.post('/users/login',{email, password});

            if(response.data.msg==='Login successful'){
                setLoggedInUser(response.data.user);
                localStorage.setItem('loggedInUser', JSON.stringify(response.data.user));
                alert('Login successful');
                setEmail('');
                setPassword('');
                setValidEmail(true);
                setValidPassword(true);
                navigate('/');
            }
        }catch(err){
            console.error(err);
            if(err.response?.data?.msg==='Invalid Email'){
                setValidEmail(false);
            }else if(err.response?.data?.msg==='Invalid Password'){
                setValidPassword(false);
            }else{
                alert('Error logging in')
            }
        }
    }

    return (
        <div className='loginPageContainer'>
            <div className='overlay'></div>
            <div className='loginPageBox'>
                <div className='formContainer'>
                    <div className='welcomeBackTextContainer'>
                        <p className='welcomeBackText'>Welcome Back!</p>
                    </div>
                    <div className='subTextContainer'>
                        <p className='subText'>Login to your account</p>
                    </div>
                    <form onSubmit={handleLogin}>
                        <div className='emailContainer'>
                            <p className='emailText'>Email:</p>
                            <input
                                type='email'
                                placeholder='Email'
                                className={`emailInput ${!validEmail ? "invalidEmail" : ""}`}
                                required
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (!validEmail) {
                                        setValidEmail(true);
                                    }
                                }}
                            />
                        </div>
                        <div className='passwordContainer'>
                            <p className='passwordText'>Password:</p>
                            <input
                                type='password'
                                placeholder='Password'
                                className={`passwordInput ${!validPassword ? "invalidPassword" : ""}`}
                                required
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (!validPassword) {
                                        setValidPassword(true);
                                    }
                                }}
                            />
                        </div>
                        <div className='submitButtonContainer'>
                            <button className='submitButton' type='submit'>Login</button>
                        </div>
                        <div className='registerAccountContainer'>
                            <Link to='/register'><p className='registerAccountText'>Don't have an account?</p></Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
