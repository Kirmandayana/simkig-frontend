import { Paper, Typography} from '@mui/material';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import UploadDocument from './subpage/guru/UploadDocument'
import HasilDocument from './subpage/guru/HasilDocument'
import TableLaporanGuru from './subpage/wakilKepsek/TableLaporanGuru'
import DetailLaporanGuru from './subpage/wakilKepsek/DetailLaporanGuru'
import Dashboard from './subpage/wakilKepsek/Dashboard'
import SidebarWakilKepsek from './subpage/wakilKepsek/SidebarWakilKepsek'

function Home() {
    const navigate = useNavigate()
    
    useEffect(() => {
        // navigate('/login')
    }, [])

    return (
        <div>
            <div style={{backgroundColor: 'cyan', display: 'flex', flexDirection: 'column', height: '4em'}}>
                <NavBar/>
            </div>
            {/* kontainer yang se pisah antara sidebar sblah kanan, dgn konten sblh kiri */}
            <div style={{padding: '1em 2em 0em 2em', display: 'flex', flexDirection: 'row', }}>
                {/* sidebar */}
                <div style={{width: '13em', marginRight: '1em'}}>
                    <Paper elevation={5}>
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '2.7em'}}>
                            <Typography variant='h6'>Akademis</Typography>
                        </div>
                        <div style={{backgroundColor: '#18A0FB'}}>
                            <SidebarWakilKepsek />
                        </div>
                    </Paper>
                </div>

                {/* konten */}
                <div style={{flexGrow: 1, minHeight: '32em', display: 'flex'}}>
                    <Paper elevation={10} style={{flexGrow: 1, padding: '1em', display: 'flex'}}>
                        <Dashboard />
                    </Paper>
                </div>
            </div>
        </div>
    );
}

export default Home;
