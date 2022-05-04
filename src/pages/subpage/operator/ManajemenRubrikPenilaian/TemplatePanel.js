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
            resp.json().then(err => {console.log(err); alert(err.toString())})
        )

    const deleteTemplateButtonHandler = templateId =>
        fetch(BACKEND_URL + '/api/evaluation/deleteTemplate', {
            method: 'POST',
            headers: {
                'access-token': localStorage.getItem('accessToken'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                templateId: templateId,
            })
        }).then(resp => {
            if(resp.status !== 200) {
                resp.json().then(err => {console.log(err); alert(err.toString())})
                return
            }

            setSelectedTemplate(null)
            fetchTemplates()
        })

    useEffect(() => {
        fetchTemplates()
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
                                        >Sunting</Button>
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