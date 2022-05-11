import React, { useEffect, useState } from 'react'
import { BACKEND_URL } from '../../../../globals'
import { TableBody, TableContainer, Typography, TableHead, TableRow, Table, TableCell, Paper, IconButton, Collapse, Button } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import dayjs from 'dayjs';

const TeacherPanelExpandable = ({row, setSelectedTeacher, setEvaluationMode, setSelectedPerformanceReview}) => {
    const [profilePic, setProfilePic] = useState('')
    const [collapseState, setCollapseState] = useState(false)

    useEffect(() =>
        fetch(BACKEND_URL + '/profiles/' + row.profilePicture, {
            headers: {
                'access-token': localStorage.getItem('accessToken')
            }
        })
        .then(res => res.blob())
        .then(res => setProfilePic(URL.createObjectURL(res)))
    , [])

    const teachSummary = row.teachingData.summary

    return (
        <>
        <TableRow>
            <TableCell>
                <img
                    src={profilePic}
                    style={{
                        width: '3em',
                        borderRadius: '5em'
                    }}
                    alt=''
                />
            </TableCell>
            <TableCell>
                {row.fullName}
            </TableCell>
            <TableCell>
                {row.NIP}
            </TableCell>
            <TableCell>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                    <CheckCircleIcon color='success' style={{display: row.performanceReview ? null : 'none'}}/>
                    <IconButton onClick={() => setCollapseState(!collapseState)}>
                        <KeyboardArrowDownIcon/>
                    </IconButton>
                </div>
            </TableCell>
        </TableRow>
        <TableRow style={{backgroundColor: 'white'}}>
            <TableCell colSpan={4} style={{
                margin: collapseState ? '1em': '0em',
                padding: collapseState ? '1em': '0em',
                transition: 'all 0.5s ease-in-out'
            }}>
                <Collapse in={collapseState} timeout='auto' unmountOnExit>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <img src={profilePic} style={{width: '6em', height: '6em', borderRadius: '5em', marginRight: '2em'}}/>

                        <div style={{width: '1px',backgroundColor: 'rgba(0,0,0,0.25)', height: '8em'}}>&nbsp;</div>

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            marginLeft: '2em',
                            marginRight: '2em',
                            width: '14em'
                        }}>
                            <Typography>Nama Lengkap : {row.fullName}</Typography>
                            <Typography>Jabatan : {row.occupation}</Typography>
                            <Typography>NIP : {row.NIP}</Typography>
                        </div>

                        <div style={{width: '1px',backgroundColor: 'rgba(0,0,0,0.25)', height: '8em'}}>&nbsp;</div>

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            marginLeft: '2em',
                            marginRight: '2em'
                        }}>
                            <Typography>Total Jadwal : {teachSummary.totalJadwal}</Typography>
                            <Typography>Hadir: {teachSummary.totalHadir} ({teachSummary.jumlahJamHadir} jam pelajaran)</Typography>
                            <Typography>Izin: {teachSummary.totalIzin} ({teachSummary.jumlahJamIzin} jam pelajaran)</Typography>
                            <Typography>Absen: {teachSummary.totalAbsen} ({teachSummary.jumlahJamAbsen} jam pelajaran)</Typography>
                        </div>

                        <div style={{width: '1px',backgroundColor: 'rgba(0,0,0,0.25)', height: '8em'}}>&nbsp;</div>

                        <div style={{flexGrow: 1}}></div>
                        <Button
                            disabled={row.performanceReview ? true : false}
                            variant='outlined'
                            onClick={() => {
                                setEvaluationMode('eval')
                                setSelectedTeacher(row)
                            }}
                        >
                            Beri Nilai
                        </Button>
                    </div>
                    {
                        row.performanceReview ?
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginTop: '1em'
                            }}>
                                <Typography variant='h6'>
                                    Telah dievaluasi pada tanggal {dayjs(row.performanceReview.date).format('DD-MM-YYYY')}
                                </Typography>
                                <div style={{flexGrow: 1}}></div>
                                <Button variant='contained' onClick={() => {
                                    setEvaluationMode('view')
                                    setSelectedTeacher(row)
                                    setSelectedPerformanceReview(row.performanceReview)
                                }}>
                                    Lihat Nilai
                                </Button>
                            </div> :
                            null
                    }
                </Collapse>
            </TableCell>
        </TableRow>
        </>
    )
}

function TeachersPickerPanel({selectedTeacher, setSelectedTeacher, setEvaluationMode, setSelectedPerformanceReview}) {
    const [teachersList, setTeachersList] = useState([])

    const getTeachersList = () =>
        fetch(BACKEND_URL + '/api/evaluation/getTeachersList', {
            method: 'GET',
            headers: {
                'access-token': localStorage.getItem('accessToken')
            },
        }).then(resp =>
            resp.status === 200 ?
            resp.json().then(data => setTeachersList(data.result)) :
            resp.json().then(error => {console.log(error); alert(error);})
        )
    
    useEffect(() => getTeachersList(), [])

    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <Typography variant='h6'>
                Evaluasi Kinerja Guru
            </Typography>

            <TableContainer component={Paper} style={{backgroundColor: 'rgba(156, 227, 255, 0.125)'}}>
                <Table>
                    <TableHead>
                        <TableRow style={{backgroundColor: 'rgba(156, 227, 255, 0.5)'}}>
                            <TableCell width={50}></TableCell>
                            <TableCell>Nama</TableCell>
                            <TableCell>NIP</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            teachersList.map(teacher => (
                                <TeacherPanelExpandable key={teacher.id} row={teacher} {...{setSelectedTeacher, setEvaluationMode, setSelectedPerformanceReview}}/>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default TeachersPickerPanel