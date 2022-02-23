import { Paper, Typography} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import UploadDocument from './subpage/guru/UploadDocument'
import HasilDocument from './subpage/guru/HasilDocument'
import TableLaporanGuru from './subpage/wakilKepsek/TableLaporanGuru'
import DetailLaporanGuru from './subpage/wakilKepsek/DetailLaporanGuru'
import WakilKepsekDashboard from './subpage/wakilKepsek/Dashboard'
import GuruDashboard from './subpage/guru/Dashboard'
import SidebarWakilKepsek from './subpage/wakilKepsek/SidebarWakilKepsek'
import SidebarGuru from './subpage/guru/SidebarGuru'
import SidebarOperator from './subpage/operator/SidebarOperator'
import OperatorDashboard from './subpage/operator/Dashboard'
import ManajemenUser from './subpage/operator/ManajemenUser'
import ManajemenServer from './subpage/operator/ManajemenServer'

function Home() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState('Dashboard')
    const handleSidebarClick = (selectedPage) => setCurrentPage(selectedPage)
    const handleLogout = () => {
        localStorage.removeItem('accessToken')
        navigate('/')
    }

    let contentPage = <div>Page not defined</div>
    let sidebar = <div>Sidebar not defined</div>
    let currentUserType = undefined

    //parse base64 string from localStorage as json
    const identifier = JSON.parse(atob(localStorage.getItem('accessToken').split('.')[0])).identifier

    if(identifier.accessLevel === 0) {
        currentUserType = 'guru'
    } else if(identifier.accessLevel === 1) {
        currentUserType = 'wakilKepsek'
    } else if(identifier.accessLevel == 3) {
        currentUserType = 'admin'
    }

    if(currentUserType === 'wakilKepsek') {
        sidebar = <SidebarWakilKepsek handleSidebarClick={handleSidebarClick} handleLogout={handleLogout}/>
        switch(currentPage) {
            case 'Dashboard':
                contentPage = <WakilKepsekDashboard/>
                break
            case 'LihatLaporan':
                contentPage = <TableLaporanGuru/>
                break
            default:
                break
        }
    } else if(currentUserType === 'guru') {
        sidebar = <SidebarGuru handleSidebarClick={handleSidebarClick} handleLogout={handleLogout}/>
        switch(currentPage) {
            case 'Dashboard':
                contentPage = <GuruDashboard/>
                break
            case 'UploadDocument':
                contentPage = <UploadDocument/>
                break
            case 'HasilDocument':
                contentPage = <HasilDocument/>
                break
            default:
                break
        }
    } else if(currentUserType === 'admin') {
        sidebar = <SidebarOperator handleSidebarClick={handleSidebarClick} handleLogout={handleLogout}/>
        switch(currentPage) {
            case 'Dashboard':
                contentPage = <OperatorDashboard/>
                break
            case 'ManajemenUser':
                contentPage = <ManajemenUser/>
                break
            case 'ManajemenServer':
                contentPage = <ManajemenServer/>
                break
            default:
                break
        }
    }

    
    return (
        <div>
            <div style={{backgroundColor: 'cyan', display: 'flex', flexDirection: 'column', height: '4em'}}>
                <NavBar/>
            </div>
            {/* kontainer yang se pisah antara sidebar sblah kanan, dgn konten sblh kiri */}
            <div style={{padding: '1em 2em 0em 2em', display: 'flex', flexDirection: 'row'}}>
                {/* sidebar */}
                <div style={{width: '13em', marginRight: '1em', flexShrink: 0}}>
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
                <div style={{flexGrow: 1, minHeight: '32em', display: 'flex'}}>
                    <Paper elevation={10} style={{flexGrow: 1, padding: '1em', display: 'flex'}}>
                        {contentPage}
                    </Paper>
                </div>
            </div>
        </div>
    );
}

export default Home;
