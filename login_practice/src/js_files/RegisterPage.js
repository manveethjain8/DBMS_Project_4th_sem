import React, { useState } from 'react';
import '../css_files/RegisterPage.css';
import { Link, useNavigate } from 'react-router-dom';
import api1 from '../api/axios1'; // This should be preconfigured with your backend base URL

const RegisterPage = () => {
    const navigate = useNavigate();

    const [fName, setFName] = useState('');
    const [lName, setLName] = useState('');
    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(true);
    const [password, setPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await api1.post('/users/register', {
                firstName: fName,
                lastName: lName,
                email,
                password,
            });

            alert('User successfully registered');
            setFName('');
            setLName('');
            setEmail('');
            setPassword('');
            setValidEmail(true);
            navigate('/login');
        } catch (err) {
            console.error(err);
            if (err.response?.data?.msg === 'User already exists') {
                setValidEmail(false);
                alert('Email already registered');
            } else {
                alert('Error registering user');
            }
        }
    };

    return (
        <div className='RegisterPageContainer'>
            <div className='overlay'></div>
            <div className='registerPageBox'>
                <div className='formContainer'>
                    <div className='registerTextBox'>
                        <p className='registerText'>Join us for your journey</p>
                    </div>
                    <div className='subTextContainer'>
                        <p className='subText'>Please provide details about yourself</p>
                    </div>
                    <form onSubmit={handleRegister}>
                        <div className='nameContainer'>
                            <div className='firstNameBox'>
                                <input
                                    type='text'
                                    placeholder='First Name'
                                    required
                                    value={fName}
                                    onChange={(e) => setFName(e.target.value)}
                                />
                            </div>
                            <div className='lastNameBox'>
                                <input
                                    type='text'
                                    placeholder='Last Name'
                                    required
                                    value={lName}
                                    onChange={(e) => setLName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='emailBox'>
                            <input
                                className={`${!validEmail ? 'invalidEmail' : ''}`}
                                type='email'
                                placeholder='Email'
                                required
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (!validEmail) setValidEmail(true);
                                }}
                            />
                        </div>
                        <div className='passwordBox'>
                            <input
                                type='password'
                                placeholder='Password'
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className='registerBox'>
                            <button type='submit'>Register</button>
                        </div>
                        <div className='loginLinkContainer'>
                            <Link to='/login'>
                                <p className='loginLink'>Already have an account? Login</p>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
