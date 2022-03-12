import 
    React
    , 
    { 
        useEffect, 
        useState,
        useRef
    } 
    from 'react'
import { Paper, Typography, Button, Dialog } from '@mui/material';
import {BACKEND_URL} from '../../../globals'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'
const dayjs = require('dayjs')

const tingkatAksesIntegerToString = {
    0: '0 - Guru',
    1: '1 - Wakil Kepala Sekolah',
    2: '2 - Kepala Sekolah',
    3: '3 - Administrator',
}

function Profil() {
    const [img, setImg] = useState('')
    const [imageResizeDialog, setImageResizeDialog] = useState(false)
    const [firstTimeProfileChangeDialog, setFirstTimeProfileChangeDialog] = useState(false)
    const [cropper, setCropper] = useState()
    const [newProfileImg, setNewProfileImg] = useState('')
    const inputImgRef = useRef()

    let userInfo = {
        Loading: '...'
    }

    let additionalInfo = {
        'Tingkat Akses': '...',
        'Tanggal Akun dibuat': '...',
    }

    if(localStorage.getItem('accessToken')) {
        const accessToken = JSON.parse(atob(localStorage.getItem('accessToken').split('.')[0])).identifier

        userInfo = {
            'Nama User': accessToken.username,
            'Nama Lengkap': accessToken.fullName,
            'Jabatan': accessToken.occupation,
            'NIP': accessToken.NIP,
        }

        additionalInfo['Tingkat Akses'] = tingkatAksesIntegerToString[accessToken.accessLevel]
        additionalInfo['Tanggal Akun dibuat'] = dayjs(accessToken.createdAt).format('DD-MMMM-YYYY HH:mm')
    }

    useEffect(() => {
        if(!localStorage.getItem('accessToken'))
            return

        const accessTokenIdentifier = JSON.parse(atob(localStorage.getItem('accessToken').split('.')[0])).identifier

        if(!accessTokenIdentifier) return console.log("Unable to get accessTokenIdentifier")

        if(accessTokenIdentifier.profilePicture) {
            fetch(BACKEND_URL + `/profiles/${accessTokenIdentifier.profilePicture}`, {
                method: 'GET',
                headers: {
                    'access-token': localStorage.getItem('accessToken')
                }
            })
            .then(res => res.blob())
            .then(res => setImg(URL.createObjectURL(res)))
        }
    }, [])



    return (
        <div style={{display:'flex', flexDirection: 'row', flexGrow:1, justifyContent: 'center', alignItems: 'center'}}>
            <div style={{width: '23em', height: '23em', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                {
                    img ?
                        <img src={img} style={{
                            width: '80%', 
                            height: '80%', 
                            borderRadius: '50%',
                            // drop shadow 
                            boxShadow: '0px 10px 30px 0px rgba(0,0,0,0.2)'
                        }}/>
                    :
                        <div style={{
                            width: '80%',
                            height: '80%',
                            borderRadius: '50%',
                            backgroundColor: '#e0e0e0',
                            // drop shadow
                            boxShadow: '0px 10px 30px 0px rgba(0,0,0,0.2)'
                        }}>
                        </div>
                }
                <input
                    type='file'
                    ref={inputImgRef}
                    style={{display: 'none'}}
                    onChange={evt => {
                        evt.preventDefault()

                        let files
                        if(evt.dataTransfer) {
                            files = evt.dataTransfer.files
                        } else if (evt.target) {
                            files = evt.target.files
                        }

                        const reader = new FileReader()

                        reader.onload = () => {
                            setNewProfileImg(reader.result)
                            setImageResizeDialog(true)
                            evt.target.value = null
                        }

                        reader.readAsDataURL(files[0])
                    }}
                />
                <Button 
                    sx={{borderWidth: '0.125em'}} 
                    variant="outlined" 
                    color="info" 
                    style={{marginTop: '3em'}}
                    onClick={() => {
                        if(inputImgRef !== undefined) {
                            inputImgRef.current.click()
                        }
                    }}
                >
                    Ubah Foto Profil
                </Button>
            </div>
            <div style={{width: '30em', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: '3em'}}>
                <Paper sx={{overflow: 'hidden', borderRadius: '1em'}} elevation={9}>
                    <div style={{
                        height: '3em',
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#ff985a',
                    }}>
                        <Typography style={{
                            marginLeft: '1em',
                            fontSize: '1.25em',
                            color: 'white',
                            fontWeight: 'bold',
                        }}>Informasi Dasar</Typography>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginBottom: '0.5em',
                        marginTop: '0.5em'
                    }}>
                        {
                            Object.keys(userInfo).map((el, idx) => (
                                <div
                                    key={idx} 
                                    style={{
                                    display: 'flex',
                                    margin: '0.5em 1em 0.5em 1em',
                                    // backgroundColor: 'red'
                                }}>
                                    <Typography style={{
                                        width: '50%',
                                        fontWeight: 'bold',
                                        // backgroundColor: 'red'
                                    }}>
                                        {el}
                                    </Typography>
                                    <Typography style={{
                                        flexGrow: 1,
                                    }}>
                                        {userInfo[el]}
                                    </Typography>
                                </div>
                            ))
                        }

                    </div>
                </Paper>

                <div style={{height: '2em'}}></div>

                <Paper sx={{overflow: 'hidden', borderRadius: '1em'}} elevation={9}>
                    <div style={{
                        height: '3em',
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#779ecc',
                    }}>
                        <Typography style={{
                            marginLeft: '1em',
                            fontSize: '1.25em',
                            color: 'white',
                            fontWeight: 'bold',
                        }}>Informasi User</Typography>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {
                            Object.keys(additionalInfo).map((el, idx) => (
                                <div
                                    key={idx} 
                                    style={{
                                    display: 'flex',
                                    margin: '0.5em 1em 0.5em 1em'
                                }}>
                                    <Typography style={{
                                        width: '50%',
                                        fontWeight: 'bold'
                                    }}>
                                        {el}
                                    </Typography>
                                    <Typography style={{
                                        flexGrow: 1,
                                    }}>
                                        {additionalInfo[el]}
                                    </Typography>
                                </div>
                            ))
                        }

                    </div>
                </Paper>
            </div>

            <Dialog 
                onClose={valueReturn => setImageResizeDialog(false)}
                open={imageResizeDialog}
            >
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '1em'
                }}>
                    <Cropper
                        style={{ height: 400, width: "100%" }}
                        zoomTo={0.5}
                        initialAspectRatio={1}
                        aspectRatio={1}
                        src={newProfileImg}
                        viewMode={1}
                        minCropBoxHeight={10}
                        minCropBoxWidth={10}
                        background={false}
                        responsive={true}
                        autoCropArea={1}
                        checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                        onInitialized={instance => {
                          setCropper(instance);
                        }}
                        guides={true}
                    />
                    <Button
                        variant='contained'
                        onClick={async () => {
                            let accessToken

                            if(typeof cropper === 'undefined') {
                                alert("Gagal mengambil data gambar dari komponen cropper")
                                return
                            }

                            if(localStorage.getItem('accessToken')) {
                                accessToken = JSON.parse(atob(localStorage.getItem('accessToken').split('.')[0])).identifier
                            }

                            //resize image to 512x512
                            const rawImage = cropper.getCroppedCanvas()
                            let canvas = document.createElement('canvas')
                            let ctx = canvas.getContext('2d')

                            canvas.width = 512
                            canvas.height = 512

                            ctx.drawImage(rawImage, 0, 0, 512, 512)

                            const response = await fetch(BACKEND_URL + '/api/user/setProfilePicture', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'access-token': localStorage.getItem('accessToken')
                                },
                                body: JSON.stringify({
                                    file: canvas.toDataURL('image/jpeg', 0.5),
                                    id: accessToken.id
                                })
                            })

                            if(response.status === 200) {
                                setImageResizeDialog(false)
                                setNewProfileImg()
                                
                                if(accessToken.profilePicture === 'default.jpg') {
                                    //show dialog box to inform user about first time changing profile picture
                                    setFirstTimeProfileChangeDialog(true)
                                }
                                
                                fetch(BACKEND_URL + `/profiles/${accessToken.profilePicture}`, {
                                    method: 'GET',
                                    headers: {
                                        'access-token': localStorage.getItem('accessToken')
                                    }
                                })
                                .then(res => res.blob())
                                .then(res => setImg(URL.createObjectURL(res)))
                            } else {
                                const errorMsg = await response.json()

                                alert(errorMsg.result)
                            }
                        }}
                    >
                        Tetapkan
                    </Button>
                </div>
            </Dialog>

            <Dialog 
                onClose={() => setFirstTimeProfileChangeDialog(false)}
                open={firstTimeProfileChangeDialog}
            >
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '1em'
                }}>
                    <Typography style={{fontWeight: 'bold'}}>Peringatan!</Typography>
                    <Typography>Jika ini pertama kali anda mengganti foto profil, silahkan logout dan login lagi ke dalam sistem untuk penerapan foto profil baru</Typography>
                    <Button
                        variant='contained'
                        onClick={() => setFirstTimeProfileChangeDialog(false)}
                    >
                        Dimengerti
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

export default Profil