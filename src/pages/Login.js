import { Button, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import loginArtwork from '../assets/loginArtwork.png';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const loginButtonHandler = () => {
        // fetch("https://localhost:8080/api/auth/login")
        // send post request to login endpoint
        fetch("http://localhost:8080/api/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(resp => {
            if(resp.status === 200) {
                // login success
                resp.json().then(data => {
                    console.log(data)
                    localStorage.setItem('accessToken', data.accessToken)
                    setUsername('')
                    setPassword('')

                    navigate('/home')
                })
            } else {
                // login failed
                resp.json().then(data => alert(data.result))
            }
        })
    }

    return (
        <div style={{width: '100%', height: window.innerHeight, display: 'flex', flexDirection: 'column'}}>
            {/* NavBar Area */}
            <div style={{backgroundColor: 'cyan', display: 'flex', flexDirection: 'column'}}>
                <NavBar/>
            </div>

            {/* Login Area */}
            <div style={{display: 'flex', flexGrow: 1, flexDirection: 'row'}}>
                {/* Background Element */}
                <div style={{flexGrow: 1, display: 'flex'}}>
                    <img src={loginArtwork} style={{width: '40em', margin: 'auto'}}/>
                </div>

                {/* Login Text and Form */}
                <div style={{width: '30em', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
                    <div style={{flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0em 3em 0em 5em'}}>
                        <Typography variant='h4'>Selamat Datang di</Typography>
                        <Typography variant='h4'>Sistem Informasi Manajemen Kinerja Guru</Typography>

                        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: '0em 5em 0em 0em'}}>
                            <TextField value={username} variant='outlined' label='Nama Pengguna' style={{margin: '2em 0em 0em 0em'}} onChange={(e) => setUsername(e.target.value)}/>
                            <TextField value={password} variant='outlined' label='Kata sandi' style={{margin: '1em 0em 0em 0em'}} onChange={(e) => setPassword(e.target.value)}/>
                            <Typography style={{margin: '0em 0em 1em 0em', alignSelf: 'end'}}>Lupa kata sandi?</Typography>
                            <Button 
                                variant='contained' 
                                color='primary' 
                                style={{height: '4em', width: '10em', alignSelf: 'end'}}
                                onClick={loginButtonHandler}>
                                Masuk
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>  
    );
}

export default Login;
