import { Paper, Typography} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import UploadDocument from './subpage/guru/UploadDocument'
import HasilDocument from './subpage/guru/HasilDocument'
import TabelLaporanGuruContainer from './subpage/wakilKepsek/TabelLaporanGuruContainer'
import WakilKepsekDashboard from './subpage/wakilKepsek/Dashboard'
import GuruDashboard from './subpage/guru/Dashboard'
import SidebarWakilKepsek from './subpage/wakilKepsek/SidebarWakilKepsek'
import SidebarGuru from './subpage/guru/SidebarGuru'
import SidebarOperator from './subpage/operator/SidebarOperator'
import OperatorDashboard from './subpage/operator/Dashboard'
import ManajemenUser from './subpage/operator/ManajemenUser'
import ManajemenServer from './subpage/operator/ManajemenServer'
import ProfilGuru from './subpage/guru/Profil';
import ProfilWakil from './subpage/guru/Profil';
import background from '../assets/background.jpg';
import ManajemenJadwal from './subpage/operator/ManajemenJadwal';
import ManajemenKelas from './subpage/operator/ManajemenKelas';
import { BACKEND_URL } from '../globals';
import ManajemenRubrikPenilaian from './subpage/operator/ManajemenRubrikPenilaian';
import EvalausiKinerjaGuru from './subpage/wakilKepsek/EvaluasiKinerjaGuru';

const pageAccessHandler = (role, page, handleClick, handleLogout) => {
    let contentPage = <div>Page not defined</div>
    let sidebar = <div>Sidebar not defined</div>

    switch(role) {
        case 0:
            sidebar = <SidebarGuru handleSidebarClick={handleClick} currentPage={page} handleLogout={handleLogout}/>

            switch(page) {
                case 'Dashboard':
                    contentPage = <GuruDashboard/>
                    break
                case 'UploadDocument':
                    contentPage = <UploadDocument/>
                    break
                case 'HasilDocument':
                    contentPage = <HasilDocument/>
                    break
                case 'Profil':
                    contentPage = <ProfilGuru/>
                    break
                default:
                    break
            }

            break
        case 1:
            sidebar = <SidebarWakilKepsek handleSidebarClick={handleClick} currentPage={page}  handleLogout={handleLogout}/>

            switch(page) {
                case 'Dashboard':
                    contentPage = <WakilKepsekDashboard/>
                    break
                case 'LihatLaporan':
                    contentPage = <TabelLaporanGuruContainer/>
                    break
                case 'EvaluasiKinerjaGuru':
                    contentPage = <EvalausiKinerjaGuru/>
                    break
                case 'Profil':
                    contentPage = <ProfilWakil/>
                    break
                default:
                    break
            }

            break
        case 2:
            sidebar = <SidebarWakilKepsek handleSidebarClick={handleClick} currentPage={page}  handleLogout={handleLogout}/>

            switch(page) {
                case 'Dashboard':
                    contentPage = <WakilKepsekDashboard/>
                    break
                case 'LihatLaporan':
                    contentPage = <TabelLaporanGuruContainer/>
                    break
                case 'EvaluasiKinerjaGuru':
                    contentPage = <EvalausiKinerjaGuru/>
                    break
                case 'Profil':
                    contentPage = <ProfilWakil/>
                    break
                default:
                    break
            }

            break
        case 3:
            sidebar = <SidebarOperator handleSidebarClick={handleClick} currentPage={page} handleLogout={handleLogout}/>

            switch(page) {
                case 'Dashboard':
                    contentPage = <OperatorDashboard/>
                    break
                case 'ManajemenUser':
                    contentPage = <ManajemenUser/>
                    break
                case 'ManajemenServer':
                    contentPage = <ManajemenServer/>
                    break
                case 'ManajemenJadwal':
                    contentPage = <ManajemenJadwal/>
                    break
                case 'ManajemenKelas':
                    contentPage = <ManajemenKelas/>
                    break
                case 'ManajemenRubrikPenilaian':
                    contentPage = <ManajemenRubrikPenilaian/>
                    break
                default:
                    break
            }
            
            break
        default:
            break
    }

    return {sidebar, contentPage}
}

function Home() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState('Dashboard')
    const handleSidebarClick = (selectedPage) => setCurrentPage(selectedPage)
    const handleLogout = () => {
        localStorage.removeItem('accessToken')
        navigate('/')
    }

    useEffect(async () => {
        !localStorage.getItem('accessToken') && navigate('/')

        //check if token expired
        await fetch(BACKEND_URL + '/api/auth/checkToken', {
            method: 'GET',
            headers: {
                'access-token': localStorage.getItem('accessToken'),
            }
        }).then(resp => {
            if(resp.status !== 200) {
                localStorage.removeItem('accessToken')
                navigate('/') //redirect to login page
            }
        })

    }, [])
    
    //redirect to login page if accessToken is not found
    !localStorage.getItem('accessToken') && navigate('/')

    //parse base64 string from localStorage as json
    const identifier = localStorage.getItem('accessToken') && JSON.parse(
        atob(localStorage.getItem('accessToken').split('.')[0])
    ).identifier

    //get sidebar and currentPage
    const {sidebar, contentPage} = pageAccessHandler(
        identifier && identifier.accessLevel, 
        currentPage, 
        handleSidebarClick, 
        handleLogout
    )
    
    return (
        <div style={{backgroundImage: `url(${background})`, overflowY: 'scroll', backgroundSize: 'cover', height: window.innerHeight}}>
            <div style={{backgroundColor: 'cyan', display: 'flex', flexDirection: 'column', height: '4em'}}>
                <NavBar currentPage={currentPage}/>
            </div>
            {/* kontainer yang se pisah antara sidebar sblah kanan, dgn konten sblh kiri */}
            <div style={{padding: '1em 2em 0em 2em', display: 'flex', flexDirection: 'row', justifyContent: 'center', minWidth: '75em', boxSizing: 'border-box'}}>
                {/* sidebar */}
                <div style={{width: '14em', marginRight: '1em', flexShrink: 0}}>
                    <Paper elevation={5}>
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '2.7em'}}>
                            <Typography variant='h6'>Akademis</Typography>
                        </div>
                        <div style={{backgroundColor: '#18A0FB'}}>
                            {sidebar}
                        </div>
                    </Paper>
                </div>

                {/* konten */}
                <div style={{flexGrow: 1, minHeight: '32em', display: 'flex', marginBottom: '2em'}}>
                    <Paper elevation={10} style={{flexGrow: 1, padding: '1em', display: 'flex', overflow: 'hidden'}}>
                        {contentPage}
                    </Paper>
                </div>
            </div>
        </div>
    );
}

export default Home;
