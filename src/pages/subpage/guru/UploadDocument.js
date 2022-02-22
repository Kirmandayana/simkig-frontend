import { Typography, TextField, Button } from '@mui/material';
import React, { createRef } from 'react';
import { useState } from 'react';
import DateAdapter from '@mui/lab/AdapterDayjs';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import dayjs from 'dayjs'
import { DateTimePicker } from '@mui/lab';
const {BACKEND_URL} = require('../../../globals')

function UploadDocument() {
   const [dateVal, setDateVal] = useState(null)
   const [namaKelasVal, setNamaKelasVal] = useState('')
   const [mapelVal, setMapelVal] = useState('')
   const [jumlahSiswaVal, setJumlahSiswaVal] = useState('')
   const [fileGambarVal, setFileGambarVal] = useState('')
   const [keluhanVal, setKeluhanVal] = useState('')
   let fileGambarRef = createRef()

   const uploadDataButtonHandler = () => {
      let data = new FormData()

      //check if all Val's is filled and valid
      if(
         dateVal === null || 
         namaKelasVal === '' || 
         mapelVal === '' || 
         jumlahSiswaVal === '' || 
         fileGambarVal === ''
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

      //get date from dateVal and convert to format 'YYYY-MM-DD'
      data.append('date', dayjs(dateVal).format('DD-MM-YYYY HH:mm').toString())
      data.append('className', namaKelasVal)
      data.append('mataPelajaran', mapelVal)
      data.append('jumlahSiswaAktif', jumlahSiswaVal)
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
            setJumlahSiswaVal('')
            setFileGambarVal('')
            setKeluhanVal('')
         } else {
            resp.json().then(res => alert(res.result))
         }
      })
   }

   return (
      <div style={{display:'flex', flexDirection: 'column', flexGrow:1, alignItems: 'center'}}>
         
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
               <Typography variant='h6'>Unggah Dokumentasi Hasil Kegiatan Belajar Mengajar</Typography>
            </div>

            <div style={{display: 'flex', flexDirection:'column', width: '50em'}}>
               <div style={{display: 'flex', alignItems: 'center', marginTop: '1em', flexDirection: 'row', flexGrow: 1}}>
                  <Typography  style={{flexGrow: 1}}>Tanggal</Typography>
                  <LocalizationProvider dateAdapter={DateAdapter}>
                     <DateTimePicker 
                        value={dateVal}
                        onChange={(newValue) => {
                           setDateVal(newValue);
                        }} renderInput={params => <TextField style={{width: '40em'}} {...params} />}  />
                  </LocalizationProvider>
               </div>

               <div style={{display: 'flex', alignItems: 'center', marginTop: '1em', flexDirection: 'row', flexGrow: 1}}>
                  <Typography style={{flexGrow: 1}}>Nama Kelas</Typography>
                  <TextField 
                     id='outline-basic' 
                     style={{width: '40em'}}
                     value={namaKelasVal}
                     onChange={e => setNamaKelasVal(e.target.value)}
                  />
               </div>

               <div style={{display: 'flex', alignItems: 'center', marginTop: '1em', flexDirection: 'row', flexGrow: 1}}>
                  <Typography style={{flexGrow: 1}}>Mata Pelajaran</Typography> 
                  <TextField 
                     id='outline-basic' 
                     style={{width: '40em'}}
                     value={mapelVal}
                     onChange={e => setMapelVal(e.target.value)}
                  />
               </div>

               <div style={{display: 'flex', alignItems: 'center', marginTop: '1em', flexDirection: 'row', flexGrow: 1}}>
                  <Typography style={{flexGrow: 1}}>Jumlah Siswa</Typography>
                  <TextField 
                     type='number' 
                     InputLabelProps={{ shrink: true, }} 
                     style={{width: '40em'}}
                     value={jumlahSiswaVal}
                     onChange={e => setJumlahSiswaVal(e.target.value)}
                  />
               </div>

               <div style={{display: 'flex', alignItems: 'center', marginTop: '1em', flexDirection: 'row', flexGrow: 1}}>
                  <Typography style={{flexGrow: 1}}>Bukti KBM</Typography>
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

               <Button 
                  variant='contained' 
                  color='primary' 
                  style={{
                     height: '4em', 
                     width: '10em', 
                     marginTop: '1em', 
                     alignSelf: 'end'
                  }}
                  onClick={uploadDataButtonHandler}
               >Kirim</Button>
            </div>
      </div>
   );
}

export default UploadDocument;
