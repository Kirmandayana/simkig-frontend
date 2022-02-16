import { AppBar, createTheme, ThemeProvider, Toolbar, Typography } from '@mui/material';
import React from 'react';

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

function NavBar() {
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

    return (
        <ThemeProvider theme={theme}>
            <AppBar>
                <Toolbar>
                    {/* LogoArea */}
                    <div style={{width: '5em'}}>
                        Logo
                    </div>

                    <Typography style={{marginLeft: '2em', flexGrow: 1}} variant='h5'>Sistem Informasi Manajemen Kinerja Guru</Typography>

                    {identifier.name != '' && <div style={{width: '0.1em', backgroundColor: 'rgba(0, 0, 0, 0.25)', height: '80%'}}> </div>}

                    <div style={{width: '10em', display: 'flex', flexDirection: 'column', marginLeft: '2em'}}>
                        <Typography>{identifier.name}</Typography>
                        <Typography>{identifier.occupation}</Typography>
                    </div>
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    )
}

export default NavBar;
