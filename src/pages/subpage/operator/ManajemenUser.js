import { Button, Dialog, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import React, { useEffect, useState } from 'react'
const { BACKEND_URL } = require('../../../globals')

const tingkatAksesToJabatan = {
  0: 'Guru',
  1: 'Wakil Kepala Sekolah',
  2: 'Kepala Sekolah',
  3: 'Administrator',
}

const SuntingUserDialog = ({open, selectedUser, gantiPasswordHandler, gantiTingkatAksesHandler, setWarningHapusUser, onClose}) => {
  const [username, setUsername] = useState(selectedUser?.username)
  const [nama, setNama] = useState(selectedUser?.fullName)
  // const [jabatan, setJabatan] = useState(selectedUser.occupation)
  const [tingkatAkses, setTingkatAkses] = useState(selectedUser?.accessLevel)
  const [NIP, setNIP] = useState(selectedUser?.NIP)
  const [password, setPassword] = useState('')

  useEffect(() => {
    setUsername(selectedUser?.username)
    setNama(selectedUser?.fullName)
    setTingkatAkses(selectedUser?.accessLevel)
    setNIP(selectedUser?.NIP)
  }, [selectedUser])

  const suntingUserHandler = () => {
    if(password.length > 0) gantiPasswordHandler({password})
    
    gantiTingkatAksesHandler({tingkatAkses})

    fetch(BACKEND_URL + '/api/user/editInfo', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'access-token': localStorage.getItem('accessToken')
      },
      body: JSON.stringify({
        id: selectedUser.id,
        username,
        fullName: nama,
        NIP
      })
    }).then(res => 
      res.status === 200 ? 
      res.json().then(data => {
        alert("Informasi pengguna berhasil diubah")

        onClose()
        setUsername('')
        setNama('')
        setTingkatAkses('')
        setNIP('')
        setPassword('')
      }) : 
      res.json().then(err => {
        console.log(err)
      })
    ).catch(err => console.log(err))

  }

  return (
    <Dialog onClose={onClose} open={open}>
      <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '0.5em'}}>
        <Typography variant='h6' style={{fontWeight: 'bold'}}>Sunting User</Typography>
        <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
          <TextField
            label='Username'
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <div style={{height: '0.5em'}}></div>
          <TextField
            label='Nama'
            value={nama}
            onChange={e => setNama(e.target.value)}
          />
          <div style={{height: '0.5em'}}></div>
          <TextField
            label='NIP'
            value={NIP}
            //make sure only numeric character is inputted
            onChange={e => setNIP(e.target.value.replace(/[^0-9]/g, ''))}
          />
          <div style={{height: '0.5em'}}></div>
          <TextField
            label='Password'
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <div style={{height: '0.5em'}}></div>
          <FormControl>
            <InputLabel id="select-tingkat-akses">Tingkat Akses</InputLabel>
            <Select 
              label="Tingkat Akses" 
              id='select-tingkat-akses'
              value={tingkatAkses}
              onChange={(e) => setTingkatAkses(e.target.value)}>
              <MenuItem value={0}> 0 - Guru </MenuItem>
              <MenuItem value={1}> 1 - Wakil Kepala Sekolah </MenuItem>
              <MenuItem value={2}> 2 - Kepala Sekolah </MenuItem>
              <MenuItem value={3}> 3 - Admin </MenuItem>
            </Select>
          </FormControl>
        </div>
        <div style={{height: '1em'}}></div>
        <Button 
          variant='contained' 
          color='primary'
          onClick={() => {setWarningHapusUser(true); onClose()}}
        >Hapus</Button>
        <div style={{height: '0.5em'}}></div>
        <Button 
          variant='contained' 
          color='primary'
          onClick={suntingUserHandler}
        >Sunting User</Button>
      </div>
    </Dialog>
  )
}

const WarningHapusUser = ({open, selectedUser, onClose}) => {
  return (
    <Dialog onClose={onClose} open={open}>
      <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '0.5em'}}>
        <Typography variant='h6' style={{fontWeight: 'bold'}}>Hapus User?</Typography>
        {
          selectedUser &&
            <Typography>
              User Info: <br/>
              Nama: {selectedUser.fullName} <br/>
              ID: {selectedUser.id}
            </Typography>
        }
        <div style={{height: '1em'}}></div>
        <Button 
          variant='contained' 
          color='primary'
          onClick={() => onClose(selectedUser)}
        >Hapus</Button>
      </div>
    </Dialog>
  )
}

function ManajemenUser() {
  const [namaUser, setNamaUser] = useState('')
  const [password, setPassword] = useState('')
  const [namaLengkap, setNamaLengkap] = useState('')
  const [tingkatAkses, setTingkatAkses] = useState('')
  const [NIP, setNIP] = useState('')
  const [daftarUser, setDaftarUser] = useState([])
  const [suntingUserDialog, setSuntingUserDialog] = useState(false)
  const [warningHapusUser, setWarningHapusUser] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const fetchUserList = () => 
    fetch(BACKEND_URL + '/api/user/getUserList', {
      method: 'POST',
      headers: {
        'access-token': localStorage.getItem('accessToken'),
      }
    }).then(resp => 
      resp.status === 200 ?
      resp.json().then(data => setDaftarUser(data)) :
      resp.json().then(err => {console.log(err); alert(err.toString())})
    )

  useEffect(() => {
    fetchUserList()
  }, [])

  const gantiPasswordHandler = pw => {
    if(!pw.password) return
    else if(pw.password.length < 1) {
      alert("Password tidak boleh kosong")
      return
    } else
      fetch(BACKEND_URL + '/api/user/changePassword', {
        method: 'POST',
        headers: {
          'access-token': localStorage.getItem('accessToken'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: selectedUser.id,
          password: pw.password
        })
      }).then(resp => {
        if(resp.status === 200)
          resp.json().then(data => alert("Password berhasil diganti"))
        else
          resp.json().then(data => alert("Password gagal diganti: " + data.result))
      })
  }

  const gantiTingkatAksesHandler = ta => {
    if(ta.tingkatAkses.length < 1) {
      alert("Tingkat Akses tidak boleh kosong")
      return
    } else
      fetch(BACKEND_URL + '/api/user/promote', {
        method: 'POST',
        headers: {
          'access-token': localStorage.getItem('accessToken'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: selectedUser.id,
          accessLevel: ta.tingkatAkses,
          occupation: tingkatAksesToJabatan[ta.tingkatAkses]
        })
      }).then(resp => {
        if(resp.status === 200)
          resp.json().then(data => alert("Tingkat Akses berhasil diganti"))
        else
          resp.json().then(data => alert("Tingkat Akses diganti: " + data.result))
      })
  }

  const buatUserBaruHandler = () => {
    if(!namaUser || namaUser.length < 3) { // nama user harus lebih dari 3 karakter
      alert("Nama user tidak boleh kosong")
      return
    } else if(!password || password.length < 7) { // password harus lebih dari 7 karakter
      alert("Password tidak boleh kosong dan minimal 7 karakter")
      return
    } else // jika semua kondisi terpenuhi, maka buat user baru
      fetch(BACKEND_URL + '/api/user/create', { // POST request ke server
        method: 'POST',
        headers: {
          'access-token': localStorage.getItem('accessToken'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: namaUser,
          password,
          fullName: namaLengkap,
          occupation: tingkatAksesToJabatan[tingkatAkses],
          accessLevel: tingkatAkses,
          NIP
        })
      }).then(rsp => {
        if(rsp.status === 200)
          rsp.json().then(data => { // jika berhasil, maka tampilkan pesan
            alert("User berhasil dibuat")
            fetchUserList() // refresh daftar user
            //clears the input fields
            setNamaUser('')
            setPassword('')
            setNamaLengkap('')
            setTingkatAkses('')
            setNIP('')
          })
        else
          rsp.json().then(data => alert("User gagal dibuat: " + data.result)) // jika gagal, tampilkan pesan
      })
  }

  const hapusUserHandler = (chosenUser) => {
    setWarningHapusUser(false)
    
    chosenUser.id && fetch(BACKEND_URL + '/api/user/delete', {
      method: 'POST',
      headers: {
        'access-token': localStorage.getItem('accessToken'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: chosenUser.id
      })
    }).then(resp => {
      if(resp.status === 200)
        resp.json().then(data => {
          alert("User berhasil dihapus")
          fetchUserList()
        })
      else
        resp.json().then(data => alert("User gagal dihapus: " + data.result))
    })
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
      <div style={{display: 'flex', flexDirection: 'row', marginBottom: '1em'}}>
        <div style={{flexGrow: 1}}></div>
        <TextField label="nama user" value={namaUser} onChange={e => setNamaUser(e.target.value)}></TextField>
        <div style={{width: '1em'}}></div>
        <TextField label="password" type='password' value={password} onChange={e => setPassword(e.target.value)}></TextField>
        <div style={{width: '1em'}}></div>
        <TextField label="nama lengkap" value={namaLengkap} onChange={e => setNamaLengkap(e.target.value)}></TextField>
        <div style={{width: '1em'}}></div>
        <FormControl style={{width: '10em'}}>
          <InputLabel id="select-tingkat-akses">Tingkat Akses</InputLabel>
          <Select 
            label="Tingkat Akses" 
            id='select-tingkat-akses'
            value={tingkatAkses}
            onChange={(e) => setTingkatAkses(e.target.value)}>
            <MenuItem value={0}> 0 - Guru </MenuItem>
            <MenuItem value={1}> 1 - Wakil Kepala Sekolah </MenuItem>
            <MenuItem value={2}> 2 - Kepala Sekolah </MenuItem>
            <MenuItem value={3}> 3 - Admin </MenuItem>
          </Select>
        </FormControl>
        <div style={{width: '1em'}}></div>
        <TextField label="NIP" value={NIP} onChange={e => setNIP(e.target.value.replace(/[^0-9]/g, ''))}></TextField>
        <div style={{width: '1em'}}></div>
        <Button variant='contained' onClick={buatUserBaruHandler}>Buat user</Button>
        <div style={{flexGrow: 1}}></div>
      </div>

      <TableContainer sx={{maxHeight: '25em'}} elevation={8} component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                style={{width: '6em'}}
              >Nama User</TableCell>
              <TableCell>Nama</TableCell>
              <TableCell
                style={{width: '5em'}}
              >Jabatan</TableCell>
              <TableCell
                style={{width: '3em'}}
              >Tingkat Akses</TableCell>
              <TableCell
                style={{width: '15em'}}
              >NIP</TableCell>
              <TableCell
                // make this cell smaller
                style={{width: '13.39em'}}  
              >Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              daftarUser.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{row.username}</TableCell>
                  <TableCell>{row.fullName}</TableCell>
                  <TableCell>{row.occupation}</TableCell>
                  <TableCell>{row.accessLevel}</TableCell>
                  <TableCell>{row.NIP}</TableCell>
                  <TableCell style={{display: 'flex', flexDirection: 'column'}}>
                    <Button
                      variant='contained'
                      onClick={() => {setSelectedUser(row); setSuntingUserDialog(true)}}
                    >Sunting</Button>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
      <SuntingUserDialog
        open={suntingUserDialog}
        selectedUser={selectedUser}
        onClose={() => {setSuntingUserDialog(false); fetchUserList()}}
        gantiPasswordHandler={gantiPasswordHandler}
        gantiTingkatAksesHandler={gantiTingkatAksesHandler}
        setWarningHapusUser={setWarningHapusUser}
      />
      <WarningHapusUser
        open={warningHapusUser}
        selectedUser={selectedUser}
        onClose={hapusUserHandler}
      /> 
    </div>
  )
}

export default ManajemenUser