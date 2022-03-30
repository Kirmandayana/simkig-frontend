import { Button, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import loginArtwork from '../assets/loginArtwork.png';
import { useNavigate } from 'react-router-dom';
const {BACKEND_URL} = require('../globals')

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        //if user already logged in
        //redirect to home
        if(localStorage.getItem('accessToken')) 
            navigate('/home') 
    }, [navigate])

    const loginButtonHandler = () => {
        // kirim request ke API Endpoint
        fetch(BACKEND_URL + "/api/auth/login", {
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
                // login sukses
                resp.json().then(data => {
                    console.log(data)
                    //simpan token JWT
                    localStorage.setItem('accessToken', data.accessToken)
                    setUsername('')
                    setPassword('')

                    navigate('/home')
                })
            } else {
                // login gagal
                resp.json().then(data => alert(data.result))
            }
        })
    }

    return (
        <div style={{width: '100%', height: window.innerHeight, display: 'flex', flexDirection: 'column'}}>
            {/* NavBar Area */}
            <div style={{backgroundColor: 'cyan', display: 'flex', flexDirection: 'column'}}>
                <NavBar currentPage={'Login'}/>
            </div>

            {/* Login Area */}
            <div style={{display: 'flex', flexGrow: 1, flexDirection: 'row'}}>
                {/* Background Element */}
                <div style={{flexGrow: 1, display: 'flex'}}>
                    <img src={loginArtwork} style={{width: '40em', margin: 'auto'}} alt=''/>
                </div>

                {/* Login Text and Form */}
                <div style={{width: '30em', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
                    <div style={{flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0em 5em 0em 2em'}}>
                        <Typography variant='h4' style={{textAlign: 'right'}}>Selamat Datang di</Typography>
                        <Typography variant='h4' style={{textAlign: 'right'}}><i>SIMKIG KBM</i> <br/><b>SMK Negeri 1 Ratahan</b></Typography>

                        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: '0em 0em 0em 5em'}}>
                            <TextField 
                                value={username} 
                                variant='outlined' 
                                label='Nama Pengguna' 
                                style={{margin: '2em 0em 0em 0em'}} 
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <TextField 
                                value={password} 
                                variant='outlined' 
                                label='Kata sandi' 
                                type='password' 
                                style={{margin: '1em 0em 0em 0em'}} 
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={(e) => {
                                    if(e.key === 'Enter')
                                        loginButtonHandler()
                                }}
                            />
                            {/* <Typography style={{margin: '0em 0em 1em 0em', alignSelf: 'end'}}>Lupa kata sandi?</Typography> */}
                            <div style={{height: '1em'}}></div>
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
