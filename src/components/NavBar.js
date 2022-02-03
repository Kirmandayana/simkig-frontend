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
                    height: '6em',
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
    return (
        <ThemeProvider theme={theme}>
            <AppBar>
                <Toolbar>
                    {/* LogoArea */}
                    <div style={{width: '5em'}}>
                        Logo
                    </div>

                    <Typography style={{marginLeft: '2em', flexGrow: 1}} variant='h5'>Sistem Informasi Manajemen Kinerja Guru</Typography>

                    <div style={{width: '10em'}}>
                        RightPane
                    </div>
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    )
}

export default NavBar;
