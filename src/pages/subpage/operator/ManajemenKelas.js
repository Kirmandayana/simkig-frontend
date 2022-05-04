import { Button, Dialog, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { BACKEND_URL } from '../../../globals'

const Toolbar = ({
    addClassroomButtonHandler
}) => {
    const [namaKelas, setNamaKelas] = useState('')
    const [jumlahSiswa, setJumlahSiswa] = useState('')

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                marginRight: '1em'
            }}>
                <Typography>Nama Kelas</Typography>
                <TextField 
                    id='outline-basic' 
                    // style={{width: '100%'}} 
                    value={namaKelas} 
                    onChange={e => setNamaKelas(e.target.value)}
                />
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                marginRight: '1em'
            }}>
                <Typography>Jumlah Siswa</Typography>
                <TextField 
                    type='number'
                    id='outline-basic' 
                    // style={{flexGrow: 1}} 
                    value={jumlahSiswa}
                    onChange={e => setJumlahSiswa(e.target.value)}
                />
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                width: '8em'
            }}>
                <Button
                    variant='contained'
                    style={{flexGrow: 1, marginTop: '1.7em'}}
                    onClick={() => {
                        if(namaKelas === '' || jumlahSiswa === '') {
                            alert('Nama Kelas dan Jumlah Siswa harus diisi')
                            return
                        }

                        addClassroomButtonHandler(namaKelas, jumlahSiswa)

                        setNamaKelas('')
                        setJumlahSiswa('')
                    }}
                >Tambah</Button>
            </div>
        </div>
    )
}

const SuntingClassroomDialog = ({
    open,
    selectedClassroom,
    updateClassroomHandler,
    setWarningHapusClassroom,
    onClose
}) => {
    const [className, setClassName] = useState(selectedClassroom?.className)
    const [totalStudents, setTotalStudents] = useState(selectedClassroom?.totalStudents)

    useEffect(() => {
        setClassName(selectedClassroom?.className)
        setTotalStudents(selectedClassroom?.totalStudents)
    }, [selectedClassroom])

    return (
        <Dialog onClose={onClose} open={open}>
            <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '0.5em'}}>
                <Typography variant='h6' style={{fontWeight: 'bold'}}>Sunting Kelas</Typography>
                <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                    <TextField
                        label='Nama Kelas'
                        value={className}
                        onChange={e => setClassName(e.target.value)}
                    />
                    <div style={{height: '0.5em'}}></div>
                    <TextField
                        type='number'
                        label='Total Jumlah Siswa'
                        value={totalStudents}
                        onChange={e => setTotalStudents(e.target.value)}
                    />
                </div>
                
                <div style={{height: '1em'}}></div>
                <Button 
                    variant='contained' 
                    color='primary'
                    onClick={() => {setWarningHapusClassroom(true); onClose()}}
                >Hapus</Button>
                <div style={{height: '0.5em'}}></div>
                <Button 
                    variant='contained' 
                    color='primary'
                    onClick={() => {
                        if(className === '' || totalStudents === '') {
                            alert('Nama Kelas dan Jumlah Siswa harus diisi')
                            return
                        }

                        updateClassroomHandler(selectedClassroom?.id, className, totalStudents)
                        onClose()
                    }}
                >Sunting User</Button>
            </div>
        </Dialog>
    )
}

const WarningHapusClassroom = ({open, selectedClassroom, onClose}) => {
    return (
        <Dialog onClose={onClose} open={open}>
            <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '0.5em'}}>
                <Typography variant='h6' style={{fontWeight: 'bold'}}>Hapus Kelas?</Typography>
                {
                selectedClassroom &&
                    <Typography>
                    Info Kelas: <br/>
                    Nama: {selectedClassroom.className} <br/>
                    ID: {selectedClassroom.id}
                    </Typography>
                }
                <div style={{height: '1em'}}></div>
                <Button 
                variant='contained' 
                color='primary'
                onClick={() => onClose(selectedClassroom)}
                >Hapus</Button>
            </div>
        </Dialog>
    )
}

function ManajemenKelas() {
    const [daftarKelas, setDaftarKelas] = useState([])
    const [selectedClassroom, setSelectedClassroom] = useState(null)
    const [warningHapusClassroom, setWarningHapusClassroom] = useState(false)
    const [suntingUserDialog, setSuntingUserDialog] = useState(false)

    const fetchClassroomList = () => {
        fetch(BACKEND_URL + '/api/scheduler/getAllClassrooms', {
            method: 'GET',
            headers: {
                'access-token': localStorage.getItem('accessToken')
            }
        }).then(resp =>
            resp.status === 200 ?
            resp.json().then(data => setDaftarKelas(data.value)) :
            resp.json().then(err => {console.log(err); alert(err.toString())})
        )
    }

    useEffect(() => 
        fetchClassroomList()
    , [])

    const updateClassroomHandler = (id, className, totalStudents) => {
        fetch(BACKEND_URL + '/api/scheduler/updateClassroom', {
            method: 'POST',
            headers: {
                'access-token': localStorage.getItem('accessToken'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id,
                className,
                totalStudents
            })
        }).then(resp =>
            resp.status === 200 ?
            fetchClassroomList() :
            resp.json().then(err => {console.log(err); alert(err.toString())})
        )
    }

    const deleteClassroomHandler = async chosenClassroom => {
        await fetch(BACKEND_URL + '/api/scheduler/deleteClassroom', {
            method: 'POST',
            headers: {
                'access-token': localStorage.getItem('accessToken'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: chosenClassroom.id
            })
        }).then(resp =>
            resp.status === 200 ?
            fetchClassroomList() :
            resp.json().then(err => {console.log(err); alert(err.toString())})
        )

        setSelectedClassroom(null)
        setWarningHapusClassroom(false)
    }

    const addClassroomButtonHandler = (className, totalStudents) => {
        fetch(BACKEND_URL + '/api/scheduler/addClassroom', {
            method: 'POST',
            headers: {
                'access-token': localStorage.getItem('accessToken'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                className,
                totalStudents
            })
        }).then(resp =>
            resp.status === 200 ?
            fetchClassroomList() :
            resp.json().then(err => {console.log(err); alert(err.toString())})
        )
    }

    return (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
    }}>
        <Toolbar addClassroomButtonHandler={addClassroomButtonHandler}/>

        <TableContainer sx={{maxHeight: '25em', marginTop: '1em'}} elevation={6} component={Paper}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell style={{width: '6em'}}>ID</TableCell>
                        <TableCell style={{width: '6em'}}>Nama Kelas</TableCell>
                        <TableCell style={{width: '6em'}}>Total Jumlah Siswa</TableCell>
                        <TableCell style={{width: '6em'}}></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        daftarKelas.map((row, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.className}</TableCell>
                                <TableCell>{row.totalStudents}</TableCell>
                                <TableCell style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                }}>
                                    <Button
                                        variant='contained'
                                        onClick={() => {
                                            setSelectedClassroom(row); 
                                            setSuntingUserDialog(true)
                                        }}
                                    >Sunting</Button>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>

        <SuntingClassroomDialog
            open={suntingUserDialog}
            selectedClassroom={selectedClassroom}
            onClose={() => {setSuntingUserDialog(false); fetchClassroomList()}}
            updateClassroomHandler={updateClassroomHandler}
            setWarningHapusClassroom={setWarningHapusClassroom}
        />
        <WarningHapusClassroom
            open={warningHapusClassroom}
            selectedClassroom={selectedClassroom}
            onClose={deleteClassroomHandler}
        />
    </div>
    )
}

export default ManajemenKelas