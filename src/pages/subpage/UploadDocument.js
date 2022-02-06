import { Typography, TextField, Button } from '@mui/material';
import { AdapterDateFns, LocalizationProvider, DatePicker } from;
import React from 'react';

function UploadDocument() {

   const [value, setValue] = React.useState(null);

  return (
      <div style={{display:'flex', flexDirection: 'column', flexGrow:1}}>
         
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
               <Typography variant='h6'>Unggah Dokumentasi Hasil Kegiatan Belajar Mengajar</Typography>
            </div>

            <div style={{backgroundColor:'green', display: 'flex', flexDirection:'column', padding: '1em 15em 1em 15em'}}>
               <div style={{display: 'flex', alignItems: 'center', marginTop: '1em', flexDirection: 'row', flexGrow: 1}}>
                  <Typography  style={{flexGrow: 1}}>Tanggal</Typography>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                     <DatePicker value={value} onChange={(newValue) => { setValue(newValue); }} renderInput={(params) => <TextField {...params} />} />
                  </LocalizationProvider>
               </div>

               <div style={{display: 'flex', alignItems: 'center', marginTop: '1em', flexDirection: 'row', flexGrow: 1}}>
                  <Typography style={{flexGrow: 1}}>Nama Kelas</Typography>
                  <TextField id='outline-select-currency' label='Masukan Nama Kelas' style={{width: '40em'}}/>
               </div>

               <div style={{display: 'flex', alignItems: 'center', marginTop: '1em', flexDirection: 'row', flexGrow: 1}}>
                  <Typography style={{flexGrow: 1}}>Mata Pelajaran</Typography> 
                  <TextField id='outline-select-currency' label='Masukan Mata Pelajaran' style={{width: '40em'}}/>
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
