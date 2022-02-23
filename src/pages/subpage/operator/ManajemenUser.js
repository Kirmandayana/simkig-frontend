import { Button, Dialog, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
const { BACKEND_URL } = require('../../../globals')

const GantiPasswordDialog = ({open, selectedUser, onClose}) => {
  const [password, setPassword] = useState('')

  const gantiPasswordButtonHandler = () => {
    onClose({password})
    setPassword('')
  }

  return (
    <Dialog onClose={onClose} open={open}>
      <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '0.5em'}}>
        <Typography variant='h6' style={{fontWeight: 'bold'}}>Ganti Password</Typography>
        {
          selectedUser &&
            <Typography>
              User Info: <br/>
              Nama: {selectedUser.fullName} <br/>
              ID: {selectedUser.id}
            </Typography>
        }
        <div style={{height: '1em'}}></div>
        <TextField 
          label='Password Baru'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <div style={{height: '1em'}}></div>
        <Button 
          variant='contained' 
          color='primary'
          onClick={gantiPasswordButtonHandler}
        >Ganti Password</Button>
      </div>
    </Dialog>
  )
}

const GantiTingkatAksesDialog = ({open, selectedUser, onClose}) => {
  const [tingkatAkses, setTingkatAkses] = useState('')

  const gantiTingkatAksesHandler = () => {
    onClose({tingkatAkses})
    setTingkatAkses('')
  }

  return (
    <Dialog onClose={onClose} open={open}>
      <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '0.5em'}}>
        <Typography variant='h6' style={{fontWeight: 'bold'}}>Ganti Tingkat Akses</Typography>
        {
          selectedUser &&
            <Typography>
              User Info: <br/>
              Nama: {selectedUser.fullName} <br/>
              ID: {selectedUser.id} <br/>
              Tingkat Akses: {selectedUser.accessLevel}
            </Typography>
        }
        <div style={{height: '1em'}}></div>
        <TextField 
          label='Tingkat Akses Baru'
          value={tingkatAkses}
          onChange={e => {setTingkatAkses(e.target.value.replace(/[^0-9]/g, ''))}}
        />
        <div style={{height: '1em'}}></div>
        <Button 
          variant='contained' 
          color='primary'
          onClick={gantiTingkatAksesHandler}
        >Ganti Tingkat Akses</Button>
      </div>
    </Dialog>
  )
}

const WarningHapusUser = ({open, selectedUser, onClose}) => {
  return (
    <Dialog onClose={onClose} open={open}>
      <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '0.5em'}}>
        <Typography variant='h6' style={{fontWeight: 'bold'}}>Hapus User</Typography>
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
  const [jabatan, setJabatan] = useState('')
  const [daftarUser, setDaftarUser] = useState([])
  const [gantiPasswordDialog, setGantiPasswordDialog] = useState(false)
  const [gantiTingkatAksesDialog, setGantiTingkatAksesDialog] = useState(false)
  const [warningHapusUser, setWarningHapusUser] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const fetchUserList = () => 
    fetch(BACKEND_URL + '/api/user/getUserList', {
      method: 'POST',
      headers: {
        'access-token': localStorage.getItem('accessToken'),
      }
    }).then(resp => resp.json())
    .then(data => setDaftarUser(data))

  useEffect(() => {
    fetchUserList()
  }, [])

  const gantiPasswordHandler = pw => {
    setGantiPasswordDialog(false)

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
        
        setSelectedUser(null)
      })
  }

  const gantiTingkatAksesHandler = ta => {
    setGantiTingkatAksesDialog(false)

    if(!ta.tingkatAkses) return
    else if(ta.tingkatAkses.length < 1) {
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
          accessLevel: ta.tingkatAkses
        })
      }).then(resp => {
        if(resp.status === 200)
          resp.json().then(data => alert("Tingkat Akses berhasil diganti"))
        else
          resp.json().then(data => alert("Tingkat Akses diganti: " + data.result))
        
        setSelectedUser(null)
        fetchUserList()
      })
  }

  const buatUserBaruHandler = () => {
    if(!namaUser || namaUser.length < 3) { // nama user harus lebih dari 3 karakter
      alert("Nama user tidak boleh kosong")
      return
    } else if(!password || password.length < 7) { // password harus lebih dari 7 karakter
      alert("Password tidak boleh kosong")
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
          password: password,
          fullName: namaLengkap,
          occupation: jabatan
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
            setJabatan('')
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
        <TextField label="nama lengkap" value={namaLengkap} onChange={e => setNamaLengkap(e.target.value)}></TextField>
        <div style={{width: '1em'}}></div>
        <TextField label="jabatan" value={jabatan} onChange={e => setJabatan(e.target.value)}></TextField>
        <div style={{width: '1em'}}></div>
        <TextField label="password" value={password} onChange={e => setPassword(e.target.value)}></TextField>
        <div style={{width: '1em'}}></div>
        <Button variant='contained' onClick={buatUserBaruHandler}>Buat user</Button>
        <div style={{flexGrow: 1}}></div>
      </div>

      <TableContainer sx={{maxHeight: '25em'}} elevation={8} component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Nama User</TableCell>
              <TableCell>Nama</TableCell>
              <TableCell>Jabatan</TableCell>
              <TableCell>Tingkat Akses</TableCell>
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
                  <TableCell style={{display: 'flex', flexDirection: 'column'}}>
                    {/* change password button */}
                    <Button 
                      variant='contained'
                      style={{marginBottom: '0.5em'}}
                      onClick={() => {
                        setSelectedUser(row)
                        setGantiPasswordDialog(true)
                      }}
                    >Ganti Password</Button>
                    {/* change access level button */}
                    <Button 
                      variant='contained'
                      style={{marginBottom: '0.5em'}}
                      onClick={() => {
                        setSelectedUser(row)
                        setGantiTingkatAksesDialog(true)
                      }}
                    >Ganti Tingkat Akses</Button>
                    {/* delete user button */}
                    <Button 
                      variant='contained'
                      style={{backgroundColor: 'red'}}
                      onClick={() => {
                        setSelectedUser(row)
                        setWarningHapusUser(true)
                      }}
                    >Hapus</Button>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
      <GantiPasswordDialog
        open={gantiPasswordDialog}
        selectedUser={selectedUser}
        onClose={gantiPasswordHandler}
      />
      <GantiTingkatAksesDialog
        open={gantiTingkatAksesDialog}
        selectedUser={selectedUser}
        onClose={gantiTingkatAksesHandler}
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