import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { BACKEND_URL } from '../../../../globals'

const Toolbar = ({
    addTemplateButtonHandler
}) => {
    const [templateName, setTemplateName] = useState('')

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                marginRight: '1em',
            }}>
                <Typography>Nama Template</Typography>
                <TextField
                    id='outline-basic'
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                />
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                width: '8em',
            }}>
                <Button
                    variant='contained'
                    style={{flexGrow: 1, marginTop: '1.7em'}}
                    onClick={() => {
                        if(templateName.length < 1)
                            return alert('Nama template tidak boleh kosong')

                        addTemplateButtonHandler(templateName)
                        setTemplateName('')
                    }}
                >Tambah</Button>
            </div>
        </div>
    )
}

function TemplatePanel({
    setSelectedTemplate,
}) {
    const [templates, setTemplates] = useState([])
    const [activeTemplate, setActiveTemplate] = useState(-1)

    const fetchTemplates = () =>
        fetch(BACKEND_URL + '/api/evaluation/getAllTemplates', {
            method: 'GET',
            headers: {
                'access-token': localStorage.getItem('accessToken'),
            }
        }).then(resp =>
            resp.status === 200 ?
            resp.json().then(data => setTemplates(data.value)) :
            resp.json().then(err => {console.log(err); alert(err.toString())})
        )
    
    const addTemplateButtonHandler = templateName =>
        fetch(BACKEND_URL + '/api/evaluation/addTemplate', {
            method: 'POST',
            headers: {
                'access-token': localStorage.getItem('accessToken'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                templateName: templateName,
            })
        }).then(resp =>
            resp.status === 200 ?
            fetchTemplates() :
            resp.json().then(err => {console.log(err); alert(err.result)})
        )

    const getCurrentActiveTemplate = () =>
        fetch(BACKEND_URL + '/api/evaluation/getActiveTemplate', {
            method: 'GET',
            headers: {
                'access-token': localStorage.getItem('accessToken'),
            },
        }).then(resp =>
            resp.status === 200 ?
            resp.json().then(data => setActiveTemplate(data.result)) :
            resp.json().then(err => {console.log(err); alert(err.toString())})
        )
    
    const setCurrentActiveTemplate = templateId =>
        fetch(BACKEND_URL + '/api/evaluation/setActiveTemplate', {
            method: 'POST',
            headers: {
                'access-token': localStorage.getItem('accessToken'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                templateId: templateId,
            }),
        }).then(resp =>
            resp.status === 200 ?
            getCurrentActiveTemplate() :
            resp.json().then(err => {console.log(err); alert(err.toString())})
        )

    useEffect(() => {
        fetchTemplates()
        getCurrentActiveTemplate()
    }, [])

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
        }}>
            <Toolbar addTemplateButtonHandler={addTemplateButtonHandler}/>

            <TableContainer
                sx={{
                    maxHeight: '25em',
                    marginTop: '1em',
                }}
                elevation={6}
                component={Paper}
            >
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nama Template</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            templates.map((row, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.templateName}</TableCell>
                                    <TableCell style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                    }}>
                                        <Button
                                            variant='contained'
                                            onClick={() => setSelectedTemplate(row)}
                                            style={{
                                                marginRight: '1em',
                                            }}
                                        >Sunting</Button>
                                        <Button
                                            disabled={row.id === activeTemplate}
                                            variant={row.id === activeTemplate ? 'outlined' : 'contained'}
                                            onClick={() => setCurrentActiveTemplate(row.id)}
                                        >{row.id === activeTemplate ? 'Sedang digunakan' : 'aktifkan'}</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default TemplatePanel