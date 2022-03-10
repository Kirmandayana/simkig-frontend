import { AppBar, createTheme, ThemeProvider, Toolbar, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
const {BACKEND_URL} = require('../globals')

const theme = createTheme({
    palette: {
        primary: {
            main: '#ffffff'
        }
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    height: '4em',
                    display: 'flex',
                    flexDirection: 'column'
                }
            }
        },
        MuiToolbar: {
            styleOverrides: {
                root: {
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'start',
                },
            }
        }
    }
})

function NavBar({currentPage}) {
    const [profilePicture, setProfilePicture] = useState('')
    const [lastPage, setLastPage] = useState('')
    //get identifier from base64 encoded string in localStorage
    let identifier
    
    try {
        identifier = JSON.parse(atob(localStorage.getItem('accessToken').split('.')[0])).identifier
    } catch (err) {
        identifier = {
            name: '',
            occupation: ''
        }
    }

    /*function below will:
    1. get accessToken from localStorage
    2. get accessTokenIdentifier from accessToken
    3. if accessTokenIdentifier.profilePicture is not null, get profilePicture from server
    4. set profilePicture to state
    */
    const getLatestProfilePic = () => {
        //if no accessToken, do nothing
        if(!localStorage.getItem('accessToken'))
            return 
        
        //get accessTokenIdentifier from accessToken
        const accessTokenIdentifier = JSON.parse(atob(localStorage.getItem('accessToken').split('.')[0])).identifier 

        //if accessTokenIdentifier is null, do nothing
        if(!accessTokenIdentifier) return console.log("Unable to get accessTokenIdentifier") 

        //if accessTokenIdentifier.profilePicture is not null, get profilePicture from server
        if(accessTokenIdentifier.profilePicture) {
            fetch(BACKEND_URL + `/profiles/${accessTokenIdentifier.profilePicture}`, {
                method: 'GET',
                headers: {
                    'access-token': localStorage.getItem('accessToken')
                }
            })
            .then(res => res.blob())
            .then(blob => setProfilePicture(URL.createObjectURL(blob)))
        }
    }
    

    //keep track of last page visited
    useEffect(() => {
        setLastPage(currentPage)
    }, [currentPage])

    //triggers when user just left the previous page
    useEffect(() => {
        if(lastPage !== currentPage) {
            //check if user just left the Profil page
            if(lastPage === 'Profil') {
                //retrieve the latest profile picture from backend
                //just in case the user has changed it
                getLatestProfilePic()
            }
        }
    }, [lastPage, currentPage])

    //triggers when user just logged in
    useEffect(() => {
        getLatestProfilePic()
    }, []) 

    return (
        <ThemeProvider theme={theme}>
            <AppBar>
                <Toolbar>
                    {/* LogoArea */}
                    <div style={{width: '5em'}}>
                        <img src={require('../assets/logo.png')} alt="logo" style={{width: '60%'}}/>
                    </div>

                    <Typography style={{marginLeft: '2em', flexGrow: 1}} variant='h5'>Sistem Informasi Manajemen Kinerja Guru</Typography>

                    {
                        identifier.name !== '' &&
                        <div style={{
                            display: 'flex',
                            transform: currentPage === 'Profil' ? 'translateX(20em) scaleX(-1)' : 'translateX(0em) scaleX(1)',
                            opacity: currentPage === 'Profil' ? 0 : 1,
                            transition: currentPage === 'Profil' ? 'transform 0.5s ease-in-out, opacity 0.2s ease-in-out' : 'opacity 0.2s ease-in-out',
                        }}>
                            <div style={{width: '0.1em', backgroundColor: 'rgba(0, 0, 0, 0.25)'}}> </div>
                            <img src={profilePicture} alt="profilePicture" style={{width: '3em', height: '3em', borderRadius: '50%', marginLeft: '1em'}}/>
                            <div style={{width: '10em', display: 'flex', flexDirection: 'column', marginLeft: '2em'}}>
                                <Typography style={{fontWeight: 'bold'}}>{identifier.fullName}</Typography>
                                <Typography>{identifier.occupation}</Typography>
                            </div>
                        </div>
                    }
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    )
    
}

export default NavBar;
