import { Typography, TextField, Button } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import DateAdapter from '@mui/lab/AdapterDayjs';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

function UploadDocument() {
   const [value, setValue] = useState(null);

   return (
      <div style={{display:'flex', flexDirection: 'column', flexGrow:1, alignItems: 'center'}}>
         
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
               <Typography variant='h6'>Unggah Dokumentasi Hasil Kegiatan Belajar Mengajar</Typography>
            </div>

            <div style={{display: 'flex', flexDirection:'column', width: '50em'}}>
               <div style={{display: 'flex', alignItems: 'center', marginTop: '1em', flexDirection: 'row', flexGrow: 1}}>
                  <Typography  style={{flexGrow: 1}}>Tanggal</Typography>
                  <LocalizationProvider dateAdapter={DateAdapter}>
                     <DatePicker 
                        value={value}
                        onChange={(newValue) => {
                           setValue(newValue);
                        }} renderInput={(params) => <TextField style={{width: '40em'}} {...params} />}  />
                  </LocalizationProvider>
               </div>

               <div style={{display: 'flex', alignItems: 'center', marginTop: '1em', flexDirection: 'row', flexGrow: 1}}>
                  <Typography style={{flexGrow: 1}}>Nama Kelas</Typography>
                  <TextField id='outline-basic' style={{width: '40em'}}/>
               </div>

               <div style={{display: 'flex', alignItems: 'center', marginTop: '1em', flexDirection: 'row', flexGrow: 1}}>
                  <Typography style={{flexGrow: 1}}>Mata Pelajaran</Typography> 
                  <TextField id='outline-basic' style={{width: '40em'}}/>
               </div>

               <div style={{display: 'flex', alignItems: 'center', marginTop: '1em', flexDirection: 'row', flexGrow: 1}}>
                  <Typography style={{flexGrow: 1}}>Jumlah Siswa</Typography>
                  <TextField id='outlined-number' type='number' InputLabelProps={{ shrink: true, }} style={{width: '40em'}}/>
               </div>

               <div style={{display: 'flex', alignItems: 'center', marginTop: '1em', flexDirection: 'row', flexGrow: 1}}>
                  <Typography style={{flexGrow: 1}}>Bukti KBM</Typography>
                  <div style={{width: '40em'}}>
                     <Button variant='contained' color='primary' style={{height: '3em'}}>Unggah Foto Bukti KBM</Button>
                  </div>
               </div>
               
               <div style={{display: 'flex', alignItems: 'center', marginTop: '1em', flexDirection: 'row', flexGrow: 1}}>
                  <Typography style={{flexGrow: 1}}>Keluhan</Typography>
                  <TextField id='outlined-multiline-static' multiline rows={5} style={{width: '40em'}}/>
               </div> 

               <Button variant='contained' color='primary' style={{height: '4em', width: '10em', marginTop: '1em', alignSelf: 'end'}}>Kirim</Button>
            </div>
      </div>
   );
}

export default UploadDocument;
