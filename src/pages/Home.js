import { Paper, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import homeIcon from '../assets/homeIcon.png';
import documentIcon from '../assets/documentIcon.png';
import logOutIcon from '../assets/logOutIcon.png';
import uploadDocumentIcon from '../assets/uploadDocumentIcon.png';
import UploadDocument from './subpage/guru/UploadDocument';
import TableLaporanGuru from './subpage/wakilKepsek/TableLaporanGuru';
import DetailLaporanGuru from './subpage/wakilKepsek/DetailLaporanGuru';

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
                            <div style={{display: 'flex', flexDirection: 'column', margin: '0em 1em 0em 1em', paddingTop: '1em'}}>
                                <div style={{display: 'flex', flexDirection: 'row', height: '2.7em'}}>
                                    <img src={homeIcon} style={{width: '1.5em', height: '1.5em', marginRight: '0.5em'}}/>
                                    <Typography>Beranda</Typography>
                                </div>
                                <div style={{display: 'flex', flexDirection: 'row', height: '2.7em'}}>
                                    <img src={uploadDocumentIcon} style={{width: '1.5em', height: '1.5em', marginRight: '0.5em'}}/>
                                    <Typography>Unggah Dokumen</Typography>
                                </div>
                                <div style={{display: 'flex', flexDirection: 'row', height: '2.7em'}}>
                                    <img src={documentIcon} style={{width: '1.5em', height: '1.5em', marginRight: '0.5em'}}/>
                                    <Typography>Lihat Laporan</Typography>
                                </div>
                                <div style={{display: 'flex', flexDirection: 'row', height: '2.7em'}}>
                                    <img src={logOutIcon} style={{width: '1.5em', height: '1.5em', marginRight: '0.5em'}}/>
                                    <Typography>Keluar</Typography>
                                </div>
                            </div>
                        </div>
                    </Paper>
                </div>

                {/* konten */}
                <div style={{flexGrow: 1, minHeight: '32em', display: 'flex'}}>
                    <Paper elevation={10} style={{flexGrow: 1, padding: '1em', display: 'flex'}}>
                        <TableLaporanGuru/>
                    </Paper>
                </div>
            </div>
        </div>
    );
}

export default Home;
