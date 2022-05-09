import { Typography, TextField, Button, Tabs, Tab, Dialog, Paper, List, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import React, { createRef, useEffect } from 'react';
import { useState } from 'react';
import DateAdapter from '@mui/lab/AdapterDayjs';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import Collapse from '@mui/material/Collapse';
import { DatePicker, DateTimePicker } from '@mui/lab';
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const {BACKEND_URL} = require('../../../globals')
dayjs.extend(utc)

const TabPanel = ({children, value, index, ...other}) => {
   return (
      <>
         {value !== index ? 
            <></> :
            <>
               {children}
            </>
         }
      </>
   )
}

const ScheduleExpandableRow = ({rowData, keyData, setSelectedSchedule, selectedSchedule}) => {
   const [collapsibleState, setCollapsibleState] = useState(false)

   return (
      <>
         <ListItemButton onClick={() => {
            setCollapsibleState(!collapsibleState)
         }} style={{padding: '0em 0.5em 0em 0.5em', boxSizing: 'border-box'}}>
            <div style={{backgroundColor: 'rgba(0, 127, 255, 0.1)', display: 'flex', alignItems: 'center', flexGrow: 1, borderRadius: '0.5em', padding: '0em 1em 0em 1em', margin: '0.5em 0em 0.5em 0em'}}>
               <ListItemIcon>
                  <CalendarMonthOutlinedIcon/>
               </ListItemIcon>
               <ListItemText
                  primary={dayjs(keyData).format('dddd')}
                  secondary={dayjs(keyData).format('DD MMMM YYYY')}
               />
               {collapsibleState ? <ExpandLess/> : <ExpandMore/>}
            </div>
         </ListItemButton>

         <Collapse in={collapsibleState} unmountOnExit>
            <List component="div" disablePadding>
               {
                  rowData && rowData.map((data, idx) =>
                     <ListItemButton 
                        disabled={data.completed || data.absent}
                        key={idx} 
                        sx={{pl: 8}} 
                        onClick={() => selectedSchedule?.id !== data.id ? setSelectedSchedule(data) : setSelectedSchedule(null)}
                        selected={selectedSchedule && selectedSchedule.id === data.id}
                     >
                        <ListItemIcon>
                           <AssignmentOutlinedIcon/>
                        </ListItemIcon>
                        <ListItemText 
                           primary={data.classroom.className + (data.completed ? ' (Selesai)' : data.absent ? ' (Izin)' : '')}
                           secondary={`
                              ${data.mataPelajaran}
                              (${data.dateHour}.${data.dateMinute.toString().length < 2 ? '0' + data.dateMinute : data.dateMinute} - ${data.dateEndHour}.${data.dateEndMinute.toString().length < 2 ? '0' + data.dateEndMinute : data.dateEndMinute})
                           `}
                        />
                     </ListItemButton>
                  )
               }
            </List>
         </Collapse>
      </>
   )
}

const UnggahDokumenTab = () => {
   const [dateVal, setDateVal] = useState(null)
   const [namaKelasVal, setNamaKelasVal] = useState('')
   const [mapelVal, setMapelVal] = useState('')
   const [topikVal, setTopikVal] = useState('')
   const [jumlahSiswaVal, setJumlahSiswaVal] = useState('')
   const [totalSiswaVal, setTotalSiswaVal] = useState('')
   const [jumlahSiswaSakitVal, setJumlahSiswaSakitVal] = useState('')
   const [jumlahSiswaIzinVal, setJumlahSiswaIzinVal] = useState('')
   const [fileGambarVal, setFileGambarVal] = useState('')
   const [keluhanVal, setKeluhanVal] = useState('')
   const [schedules, setSchedules] = useState([])
   const [selectedSchedule, setSelectedSchedule] = useState(null)
   const [currentTab, setCurrentTab] = useState(0)
   let fileGambarRef = createRef()

   const getSchedules = () => {
      fetch(BACKEND_URL + '/api/scheduler/teacherGetSchedule', {
         method: 'GET',
         headers: {
            'access-token': localStorage.getItem('accessToken'),
         },
      }).then(resp => 
         resp.status === 200 ?
         resp.json().then(data => {
            const restructuredData = data.value.reduce((accumulator, currentValue) => {
                  accumulator[dayjs(currentValue.date).format('YYYY-MM-DD')] =
                     accumulator[dayjs(currentValue.date).format('YYYY-MM-DD')] || // if the date is already in the accumulator, then just add the current value to the existing array
                     [] // if the date is not in the accumulator, then create a new array for the date
                  
                  accumulator[dayjs(currentValue.date).format('YYYY-MM-DD')].push(currentValue) // add the current value to the array for the date
                  return accumulator
               }, {} // initial value for the accumulator
            )
            
            console.log(restructuredData)
            setSchedules(restructuredData)
         }) :
         resp.json().then(err => {console.log(err); alert(err.toString())})
      )
   }

   const uploadDataButtonHandler = () => {
      let data = new FormData()

      //check if all Val's is filled and valid
      if(
         dateVal === null || 
         namaKelasVal === '' || 
         mapelVal === '' || 
         topikVal === '' ||
         jumlahSiswaVal === '' || 
         // fileGambarVal === '' ||
         totalSiswaVal === '' ||
         jumlahSiswaSakitVal === '' ||
         jumlahSiswaIzinVal === ''
      ) {
         alert('Semua data harus diisi')
         return
      }

      //check if fileGambarRef is valid
      if(fileGambarVal === '') {
         alert('File gambar harus diisi')
         setFileGambarVal('')
         return
      }
      
      const date = dayjs(dateVal)

      //if the date is in future, show alert
      if(date.isAfter(dayjs())) {
         alert('Tidak dapat mengupload pada tanggal dan waktu di masa depan')
         return
      }

      data.append('date', date.format('YYYY-MM-DD'))
      data.append('dateHour', date.get('h'))
      data.append('dateMinute', date.get('m'))
      data.append('className', namaKelasVal)
      data.append('mataPelajaran', mapelVal)
      data.append('topik', topikVal)
      data.append('jumlahSiswaKelas', totalSiswaVal)
      data.append('jumlahSiswaAktif', jumlahSiswaVal)
      data.append('jumlahSiswaSakit', jumlahSiswaSakitVal)
      data.append('jumlahSiswaIzin', jumlahSiswaIzinVal)
      data.append('photo', fileGambarVal)
      data.append('keluhan', keluhanVal)

      //send data to server as multipart/form-data
      fetch(BACKEND_URL + '/api/document/uploadDocument', {
         method: 'POST',
         headers: {
            'access-token': localStorage.getItem('accessToken')
         },
         body: data
      })
      .then(resp => {
         if(resp.status === 200) {
            resp.json().then(res => alert(res.result))

            //reset all val
            setDateVal(null)
            setNamaKelasVal('')
            setMapelVal('')
            setTopikVal('')
            setJumlahSiswaVal('')
            setFileGambarVal('')
            setKeluhanVal('')
            setTotalSiswaVal('')
            setJumlahSiswaSakitVal('')
            setJumlahSiswaIzinVal('')

            setSelectedSchedule(null)
            getSchedules()
         } else {
            resp.json().then(res => alert(res.result))
         }
      })
   }

   const uploadAbsentButtonHandler = () => {
      //checkings
      if(!selectedSchedule)
         return alert("Pilih jadwal terlebih dahulu")

      if(keluhanVal === '')
         return alert("Alasan harus diisi")

      const data = {
         date: selectedSchedule.date,
         dateHour: selectedSchedule.dateHour,
         dateMinute: selectedSchedule.dateMinute,
         dateEndHour: selectedSchedule.dateEndHour,
         dateEndMinute: selectedSchedule.dateEndMinute,
         ClassScheduleId: selectedSchedule.id,
         reason: keluhanVal,
      }

      fetch(BACKEND_URL + '/api/absence/addAbsence', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'access-token': localStorage.getItem('accessToken')
         },
         body: JSON.stringify(data),
      })
      .then(resp =>
         resp.status === 200 ?
         (() => {
            alert('Izin berhasil ditambahkan!')

            setSelectedSchedule(null)
            setKeluhanVal('')
            getSchedules()
         })() :
         resp.json().then(err => {console.log(err); alert(err)})
      )
   }

   useEffect(() => {
      getSchedules()
   }, [])

   //only triggers when selectedSchedule is changed
   useEffect(() => {
      if(!selectedSchedule) {
         setDateVal(null)
         setNamaKelasVal('')
         setMapelVal('')
         setTopikVal('')
         setJumlahSiswaVal('')
         setFileGambarVal('')
         setKeluhanVal('')
         setTotalSiswaVal('')
         setJumlahSiswaSakitVal('')
         setJumlahSiswaIzinVal('')
         
         return
      }

      const scheduleDate = dayjs(selectedSchedule.date).set('hour', selectedSchedule.dateHour).set('minute', selectedSchedule.dateMinute)

      setDateVal(scheduleDate.toDate())
      setNamaKelasVal(selectedSchedule.classroom.className)
      setMapelVal(selectedSchedule.mataPelajaran)
      setTotalSiswaVal(selectedSchedule.classroom.totalStudents)
   }, [selectedSchedule])

   return (
      <>
         <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Typography variant='h6'>Unggah Dokumentasi Hasil Kegiatan Belajar Mengajar</Typography>
         </div>

         <div style={{display: 'flex', flexDirection:'column', width: '55em'}}>
            <Paper style={{margin:'0em 5em 0em 5em'}}>
               <List>
                  {
                     Object.keys(schedules).map((key, index) =>
                        <ScheduleExpandableRow key={index} rowData={schedules[key]} keyData={key} {...{setSelectedSchedule, selectedSchedule}}/>
                     )
                  }
               </List>
            </Paper>

            <div style={{display: 'flex', alignItems: 'center', margin: '1em 3em 0em 3em', flexDirection: 'row', flexGrow: 1}}>
               <Typography  style={{flexGrow: 1}}>Tanggal <span style={{color: 'red'}}>*</span></Typography>
               <LocalizationProvider dateAdapter={DateAdapter}>
                  <DateTimePicker
                     disabled
                     value={dateVal}
                     onChange={(newValue) => {
                        setDateVal(newValue);
                     }} renderInput={params => <TextField style={{width: '40em'}} {...params} />}  />
               </LocalizationProvider>
            </div>

            <div style={{display: 'flex', alignItems: 'center', margin: '1em 3em 0em 3em', flexDirection: 'row', flexGrow: 1}}>
               <Typography style={{flexGrow: 1}}>Nama Kelas <span style={{color: 'red'}}>*</span></Typography>
               <TextField
                  disabled
                  id='outline-basic' 
                  style={{width: '40em'}}
                  value={namaKelasVal}
                  onChange={e => setNamaKelasVal(e.target.value)}
               />
            </div>

            <Paper elevation={8} style={{padding: '0em 3em 2em 3em', marginTop: '1em'}}>
               <Tabs value={currentTab} onChange={(e, newVal) => setCurrentTab(newVal)}>
                  <Tab label="Hadir"/>
                  <Tab label="Izin"/>
               </Tabs>

               <TabPanel value={currentTab} index={0}>
                  <div style={{display: 'flex', alignItems: 'center', marginTop: '1em', flexDirection: 'row', flexGrow: 1}}>
                     <Typography style={{flexGrow: 1}}>Mata Pelajaran <span style={{color: 'red'}}>*</span></Typography> 
                     <TextField 
                        disabled
                        id='outline-basic' 
                        style={{width: '40em'}}
                        value={mapelVal}
                        onChange={e => setMapelVal(e.target.value)}
                     />
                  </div>

                  <div style={{display: 'flex', alignItems: 'center', marginTop: '1em', flexDirection: 'row', flexGrow: 1}}>
                     <Typography style={{flexGrow: 1}}>Topik <span style={{color: 'red'}}>*</span></Typography> 
                     <TextField 
                        id='outline-basic' 
                        style={{width: '40em'}}
                        value={topikVal}
                        onChange={e => setTopikVal(e.target.value)}
                     />
                  </div>

                  <div style={{
                     display: 'flex',
                     flexGrow: 1,
                  }}>
                     <div style={{display: 'flex', alignItems: 'center', marginTop: '1em', flexDirection: 'row', flexGrow: 1, marginRight: '1em'}}>
                        <Typography style={{flexGrow: 1}}>Jumlah Siswa Kelas <span style={{color: 'red'}}>*</span></Typography>
                        <TextField 
                           disabled
                           type='number' 
                           InputLabelProps={{ shrink: true, }} 
                           style={{width: '8em'}}
                           value={totalSiswaVal}
                           onChange={e => setTotalSiswaVal(e.target.value)}
                        />
                     </div>

                     <div style={{display: 'flex', alignItems: 'center', marginTop: '1em', flexDirection: 'row', flexGrow: 1, marginRight: '1em'}}>
                        <Typography style={{flexGrow: 1}}>Hadir <span style={{color: 'red'}}>*</span></Typography>
                        <TextField 
                           type='number' 
                           InputLabelProps={{ shrink: true, }} 
                           style={{width: '5em'}}
                           value={jumlahSiswaVal}
                           onChange={e => setJumlahSiswaVal(e.target.value)}
                        />
                     </div>

                     <div style={{display: 'flex', alignItems: 'center', marginTop: '1em', flexDirection: 'row', flexGrow: 1, marginRight: '1em'}}>
                        <Typography style={{flexGrow: 1, }}>Sakit <span style={{color: 'red'}}>*</span></Typography>
                        <TextField 
                           type='number' 
                           InputLabelProps={{ shrink: true, }} 
                           style={{width: '5em'}}
                           value={jumlahSiswaSakitVal}
                           onChange={e => setJumlahSiswaSakitVal(e.target.value)}
                        />
                     </div>

                     <div style={{display: 'flex', alignItems: 'center', marginTop: '1em', flexDirection: 'row', flexGrow: 1}}>
                        <Typography style={{flexGrow: 1}}>Izin <span style={{color: 'red'}}>*</span></Typography>
                        <TextField 
                           type='number' 
                           InputLabelProps={{ shrink: true, }} 
                           style={{width: '5em'}}
                           value={jumlahSiswaIzinVal}
                           onChange={e => setJumlahSiswaIzinVal(e.target.value)}
                        />
                     </div>
                  </div>


                  <div style={{display: 'flex', alignItems: 'center', marginTop: '1em', flexDirection: 'row', flexGrow: 1}}>
                     <Typography style={{flexGrow: 1}} >Bukti KBM <span style={{color: 'red'}}>*</span></Typography>
                     <div style={{width: '40em', display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <input 
                           type='file' 
                           ref={fileGambarRef}
                           style={{display: 'none'}}
                           onChange={event => {
                              console.log("fileGambar onchange")
                              setFileGambarVal(event.target.files[0])
                              event.target.value = null
                           }}
                        />
                        <Button 
                           variant='contained' 
                           color='primary' 
                           style={{height: '3em', marginRight: '1em'}}
                           onClick={() => {
                              fileGambarRef.current.click()
                           }}
                        >Unggah Foto Bukti KBM</Button>
                        <Typography>{fileGambarVal.name}</Typography>
                     </div>
                  </div>
                  
                  <div style={{display: 'flex', alignItems: 'center', marginTop: '1em', flexDirection: 'row', flexGrow: 1}}>
                     <Typography style={{flexGrow: 1}}>Keluhan</Typography>
                     <TextField 
                        id='outlined-multiline-static' 
                        multiline 
                        rows={5} 
                        style={{width: '40em'}}
                        value={keluhanVal}
                        onChange={e => setKeluhanVal(e.target.value)}
                     />
                  </div> 
               </TabPanel>

               <TabPanel value={currentTab} index={1}>
                  <div style={{display: 'flex', alignItems: 'center', marginTop: '1em', flexDirection: 'row', flexGrow: 1}}>
                     <Typography style={{flexGrow: 1}}>Alasan Izin <span style={{color: 'red'}}>*</span></Typography>
                     <TextField 
                        id='outlined-multiline-static' 
                        multiline 
                        rows={5} 
                        style={{width: '40em'}}
                        value={keluhanVal}
                        onChange={e => setKeluhanVal(e.target.value)}
                     />
                  </div> 
               </TabPanel>
            </Paper>

            <Button 
               variant='contained' 
               color='primary' 
               style={{
                  height: '4em', 
                  width: '10em', 
                  marginTop: '1em', 
                  alignSelf: 'end'
               }}
               onClick={currentTab === 0 ? uploadDataButtonHandler : uploadAbsentButtonHandler}
            >Kirim</Button>
         </div>
      </>
   );
}

function UploadDocument() {
   return (
      <div style={{display:'flex', flexDirection: 'column', flexGrow:1, alignItems: 'center'}}>
            <UnggahDokumenTab/>
      </div>
   );
}

export default UploadDocument;
