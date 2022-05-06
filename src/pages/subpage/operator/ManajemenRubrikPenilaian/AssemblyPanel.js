import { 
    Button, 
    TextField, 
    Typography,
    Paper,
    Table,
    TableContainer,
    TableRow,
    TableHead,
    TableCell,
    TableBody,
    Collapse,
    IconButton,
    Toolbar,
    Tooltip,
    tooltipClasses,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { BACKEND_URL } from '../../../../globals'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import CloseIcon from '@mui/icons-material/Close'
import styled from '@emotion/styled'

const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: 'transparent',
        color: 'rgba(0, 0, 0, 0.87)',
    },
}));

const AddParentRubricForm = ({
    open,
    onClose,
    onOpen,
    onAccept,
    onDecline,
    selectedRubricParent,
    children,
    isEditPanelType,
}) => {
    const [indicatorName, setIndicatorName] = useState('')
    const [weight, setWeight] = useState('')

    useEffect(() => {
        if(selectedRubricParent !== undefined) {
            setIndicatorName(selectedRubricParent.parentIndicatorName)
            setWeight(selectedRubricParent.valueWeight)
        }
    }, [selectedRubricParent])

    return (
        <HtmlTooltip 
            open={open} 
            onClose={onClose} 
            onOpen={onOpen} 
            title={
                <Paper sx={{padding: '1em', display: 'flex', flexDirection: 'column'}} elevation={8}>
                    <div style={{
                        display: isEditPanelType ? 'flex' : 'none',
                        justifyContent: 'flex-end',
                    }}>
                        <IconButton onClick={() => onDecline(true)}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <div style={{
                        display: 'flex',
                        marginBottom: '1em',
                    }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            marginRight: '1em',
                        }}>
                            <Typography>Nama Indikator</Typography>
                            <TextField
                                id='outline-basic'
                                value={indicatorName}
                                onChange={(e) => setIndicatorName(e.target.value)}
                            />
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <Typography>Bobot</Typography>
                            <TextField
                                type='number'
                                id='outline-basic'
                                value={weight}
                                sx={{width: '6.375em'}}
                                onChange={(e) => setWeight(e.target.value)}
                            />
                        </div>
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}>
                        <Button
                            variant='contained'
                            style={{backgroundColor: 'red', marginRight: '1em'}}
                            onClick={() => {
                                onDecline(false)
                            }}
                        >{isEditPanelType ? 'Hapus' : 'Batal'}</Button>

                        <Button
                            variant='contained'
                            onClick={() => {
                                if(indicatorName.length < 1)
                                    return alert('Nama indikator tidak boleh kosong')
                                if(weight.length < 1)
                                    return alert('Bobot tidak boleh kosong')
                                
                                onAccept({indicatorName, weight})
                                setIndicatorName('')
                                setWeight('')
                            }}
                        >{isEditPanelType ? 'Rubah' : 'Tambah'}</Button>
                    </div>
                </Paper>
            }
        >
            {children}
        </HtmlTooltip>
    )
}

const AddRubricForm = ({
    open,
    onClose,
    onOpen,
    onAccept,
    onDecline,
    selectedRubric,
    children,
    isEditPanelType,
}) => {
    const [indicatorName, setIndicatorName] = useState('')
    const [minValue, setMinValue] = useState('')
    const [maxValue, setMaxValue] = useState('')

    useEffect(() => {
        if(selectedRubric !== undefined) {
            setIndicatorName(selectedRubric.indicatorName)
            setMinValue(selectedRubric.minIndicatorValue)
            setMaxValue(selectedRubric.maxIndicatorValue)
        }
    }, [selectedRubric])

    return (
        <HtmlTooltip 
            open={open} 
            onClose={onClose} 
            onOpen={onOpen} 
            title={
                <Paper sx={{padding: '1em', display: 'flex', flexDirection: 'column'}} elevation={8}>
                    <div style={{
                        display: isEditPanelType ? 'flex' : 'none',
                        justifyContent: 'flex-end',
                    }}>
                        <IconButton onClick={() => onDecline(true)}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginBottom: '1em',
                    }}>
                        <Typography>Nama Indikator</Typography>
                        <TextField
                            id='outline-basic'
                            value={indicatorName}
                            onChange={(e) => setIndicatorName(e.target.value)}
                        />
                    </div>
                    <div style={{
                        display: 'flex',
                        marginBottom: '1em',
                    }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            marginRight: '1em',
                        }}>
                            <Typography>Nilai Minimum</Typography>
                            <TextField
                                type='number'
                                id='outline-basic'
                                value={minValue}
                                // sx={{width: '6.375em'}}
                                onChange={(e) => setMinValue(e.target.value)}
                            />
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <Typography>Nilai Maksimum</Typography>
                            <TextField
                                type='number'
                                id='outline-basic'
                                value={maxValue}
                                // sx={{width: '6.375em'}}
                                onChange={(e) => setMaxValue(e.target.value)}
                            />
                        </div>
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}>
                        <Button
                            variant='contained'
                            style={{backgroundColor: 'red', marginRight: '1em'}}
                            onClick={() => {
                                onDecline(false)
                            }}
                        >{isEditPanelType ? 'Hapus' : 'Batal'}</Button>

                        <Button
                            variant='contained'
                            onClick={() => {
                                if(indicatorName.length < 1)
                                    return alert('Nama indikator tidak boleh kosong')
                                if(minValue > maxValue)
                                    return alert('Nilai minimum tidak boleh lebih besar dari nilai maksimum')
                                if(minValue == 0 && maxValue == 0)
                                    return alert('Kedua nilai tidak boleh bernilai 0')
                                
                                onAccept({indicatorName, minValue, maxValue})
                                setIndicatorName('')
                                setMinValue('')
                                setMaxValue('')
                            }}
                        >{isEditPanelType ? 'Rubah' : 'Tambah'}</Button>
                    </div>
                </Paper>
            }
        >
            {children}
        </HtmlTooltip>
    )
}

const ChangeNameToolbar = ({
    selectedTemplate,
    setSelectedTemplate,
    deleteTemplateButtonHandler,
}) => {
    const [templateName, setTemplateName] = useState(selectedTemplate?.templateName)

    const templateNameChangeHandler = newName => {
        fetch(BACKEND_URL + '/api/evaluation/updateTemplate', {
            method: 'POST',
            headers: {
                'access-token': localStorage.getItem('accessToken'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                templateId: selectedTemplate.id,
                templateName: newName,
            })
        }).then(resp =>
            resp.status === 200 ?
            resp.json().then(data => {
                console.log(data.result)
                alert(data.result)

                setSelectedTemplate({
                    templateName: newName,
                    ...selectedTemplate
                })
            }) :
            resp.json().then(err => {
                console.log(err.result)
                alert(err.toString())
            })
        )
    }

    return (
    <>
        <Typography>Nama Template</Typography>
        <div style={{
            display: 'flex',
        }}>
            <TextField
                id='outline-basic'
                value={templateName}
                style={{
                    flexGrow: 1,
                    marginRight: '1em',
                }}
                onChange={(e) => setTemplateName(e.target.value)}
            />
            <Button
                variant='contained'
                style={{
                    flexGrow: 1,
                    marginRight: '1em',
                }}
                onClick={() => {
                    if(templateName.length < 1)
                        return alert('Nama template tidak boleh kosong')

                    templateNameChangeHandler(templateName)
                }}
            >Ganti</Button>
            <Button
                variant='contained'
                style={{
                    flexGrow: 1,
                    backgroundColor: 'red',
                }}
                onClick={() => {
                    if(!window.confirm("Yakin ingin menghapus template ini?"))
                        return
                    
                    deleteTemplateButtonHandler(selectedTemplate.id)
                    setSelectedTemplate(null)
                }}
            >Hapus</Button>
        </div>
    </>
    )
}

const RubricTableExpandable = ({
    rowData,
    deleteRubricParent,
    updateRubricParent,
    addRubric,
    deleteRubric,
    updateRubric,
}) => {
    const [collapseState, setCollapseState] = useState(false)
    const [rubricParentFormOpen, setRubricParentFormOpen] = useState(false)
    const [rubricFormOpen, setRubricFormOpen] = useState(false)
    const [editRubricFormOpen, setEditRubricFormOpen] = useState(false)
    const [selectedRubricID, setSelectedRubricID] = useState(-1) // used to selectively show the edit form

    return (
    <>
        <TableRow>
            <TableCell>
                <IconButton
                    size='small'
                    onClick={() => setCollapseState(!collapseState)}
                >
                    <KeyboardArrowDownIcon/>
                </IconButton>
            </TableCell>
            <TableCell>
                {rowData.parentIndicatorName}
            </TableCell>
            <TableCell>
                {rowData.valueWeight}
            </TableCell>
            <TableCell>
                <AddParentRubricForm
                    open={rubricParentFormOpen}
                    onAccept={data => {
                        updateRubricParent({id: rowData.id, ...data})
                        setRubricParentFormOpen(false)
                    }}
                    onDecline={isClose => {
                        if(!isClose)
                            deleteRubricParent(rowData)

                        setRubricParentFormOpen(false)
                    }}
                    selectedRubricParent={rowData}
                    isEditPanelType
                >
                    <Button
                        variant='outlined'
                        onClick={() => setRubricParentFormOpen(true)}
                    >Sunting</Button>
                </AddParentRubricForm>
            </TableCell>
        </TableRow>
        <TableRow>
            <TableCell colSpan={4} style={{
                margin: collapseState ? '1em' : '0',
                padding: collapseState ? '1em' : '0',
                transition: 'all 0.5s ease-in-out',
            }}>
                <Collapse 
                    in={collapseState} 
                    timeout='auto' 
                    unmountOnExit
                >
                    {
                        rowData.PerformanceIndicators.map(rubricRowData => (
                            <div 
                                key={rubricRowData.id}
                                style={{
                                    display: 'flex',
                                    // backgroundColor: 'red',
                                    marginLeft: '5em',
                                    marginBottom: '1em',
                                    alignItems: 'center',
                                }}
                            >
                                {/* <Typography style={{
                                    flexGrow: 0.5
                                }}>ID</Typography> */}
                                <Typography style={{
                                    flexGrow: 1  
                                }}>{rubricRowData.indicatorName}</Typography>
                                <Typography style={{
                                    flexGrow: 0.7
                                }}>{rubricRowData.minIndicatorValue} / {rubricRowData.maxIndicatorValue}</Typography>
                                <div style={{
                                    width: '15em',
                                }}>
                                    <AddRubricForm
                                        // open={editRubricFormOpen}
                                        open={selectedRubricID === rubricRowData.id ? editRubricFormOpen : false}
                                        onAccept={data => {
                                            updateRubric({id: rubricRowData.id, ...data})
                                            setEditRubricFormOpen(false)
                                        }}
                                        onDecline={isClose => {
                                            if(!isClose)
                                                deleteRubric({id: rubricRowData.id})
                                            
                                            setEditRubricFormOpen(false)
                                        }}
                                        selectedRubric={rubricRowData}
                                        isEditPanelType
                                    >
                                        <Button
                                            variant='outlined'
                                            onClick={() => {
                                                setEditRubricFormOpen(true)
                                                setSelectedRubricID(rubricRowData.id)
                                            }}
                                        >
                                            Sunting
                                        </Button>
                                    </AddRubricForm>
                                </div>
                            </div>
                        ))
                    }

                    <div style={{
                        display: 'flex',
                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                        borderRadius: '1em',
                        marginLeft: '5em',
                        alignItems: 'center',
                    }}>
                        <Typography style={{
                            flexGrow: 0.5
                        }}> </Typography>
                        <Typography style={{
                            flexGrow: 1  
                        }}> </Typography>
                        <Typography style={{
                            flexGrow: 0.7
                        }}> </Typography>
                        <div style={{
                            width: '15em',
                        }}>
                            {/* <Button
                                variant='contained'
                                style={{
                                    height: '2.25em',
                                    marginTop: '0.75em',
                                    marginBottom: '0.75em',
                                }}
                            >Tambah</Button> */}
                            <AddRubricForm
                                open={rubricFormOpen}
                                onAccept={data => {
                                    addRubric({parentId: rowData.id, ...data})
                                    setRubricFormOpen(false)
                                }}
                                onDecline={isClose => {
                                    setRubricFormOpen(false)
                                }}
                            >
                                <Button
                                    variant='contained'
                                    style={{
                                        height: '2.25em',
                                        marginTop: '0.75em',
                                        marginBottom: '0.75em',
                                    }}
                                    onClick={() => setRubricFormOpen(true)}
                                >Tambah</Button>
                            </AddRubricForm>
                        </div>
                    </div>
                </Collapse>
            </TableCell>
        </TableRow>
    </>
    )
}

const RubricTableAddNew = ({
    addNewRubricParent
}) => {
    const [rubricFormOpen, setRubricFormOpen] = useState(false)

    return (
    <>
        <TableRow style={{
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
        }}>
            <TableCell>
            </TableCell>
            <TableCell>
            </TableCell>
            <TableCell>
            </TableCell>
            <TableCell>
                <AddParentRubricForm
                    open={rubricFormOpen}
                    onAccept={data => {
                        addNewRubricParent(data)
                        setRubricFormOpen(false)
                    }}
                    onDecline={() => setRubricFormOpen(false)}
                >
                    <Button
                        variant='contained'
                        onClick={() => setRubricFormOpen(true)}
                    >Tambah</Button>
                </AddParentRubricForm>
            </TableCell>
        </TableRow>
    </>
    )
}

const RubricEditorPanel = ({
    selectedTemplate
}) => {
    const [rubricTableData, setRubricTableData] = useState([])

    const fetchRubricTableData = () => {
        fetch(BACKEND_URL + '/api/evaluation/getTemplateRubric/' + selectedTemplate.id, {
            method: 'GET',
            headers: {
                'access-token': localStorage.getItem('accessToken'),
                'Content-Type': 'application/json'
            }
        }).then(resp =>
            resp.status === 200 ?
            resp.json().then(data => setRubricTableData(data.value)) :
            resp.json().then(err => {console.log(err.result); alert(err.toString())})
        )
    }

    const addNewRubricParent = data => {
        fetch(BACKEND_URL + '/api/evaluation/addRubricParent', {
            method: 'POST',
            headers: {
                'access-token': localStorage.getItem('accessToken'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                templateId: selectedTemplate.id,
                parentIndicatorName: data.indicatorName,
                valueWeight: data.weight,
            })
        }).then(resp =>
            resp.status === 200 ?
            resp.json().then(data => {
                fetchRubricTableData()
            }) :
            resp.json().then(err => {console.log(err.result); alert(err.toString())})
        )
    }

    const updateRubricParent = data => {
        fetch(BACKEND_URL + '/api/evaluation/updateRubricParent', {
            method: 'POST',
            headers: {
                'access-token': localStorage.getItem('accessToken'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                parentIndicatorName: data.indicatorName,
                valueWeight: data.weight,
                parentId: data.id,
            })
        }).then(resp =>
            resp.status === 200 ?
            resp.json().then(data => {
                fetchRubricTableData()
            }) :
            resp.json().then(err => {console.log(err.result); alert(err.toString())})
        )
    }

    const deleteRubricParent = data => {
        fetch(BACKEND_URL + '/api/evaluation/deleteRubricParent', {
            method: 'POST',
            headers: {
                'access-token': localStorage.getItem('accessToken'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                parentId: data.id,
            })
        }).then(resp =>
            resp.status === 200 ?
            resp.json().then(data => {
                fetchRubricTableData()
            }) :
            resp.json().then(err => {console.log(err.result); alert(err.toString())})
        )
    }

    const addRubric = data => {
        fetch(BACKEND_URL + '/api/evaluation/addRubric', {
            method: 'POST',
            headers: {
                'access-token': localStorage.getItem('accessToken'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                parentId: data.parentId,
                indicatorName: data.indicatorName,
                minIndicatorValue: data.minValue,
                maxIndicatorValue: data.maxValue,
            }),
        }).then(resp =>
            resp.status === 200 ?
            resp.json().then(data => {
                fetchRubricTableData()
            }) :
            resp.json().then(err => {console.log(err.result); alert(err.toString())})
        )
    }

    const updateRubric = data => {
        fetch(BACKEND_URL + '/api/evaluation/updateRubric', {
            method: 'POST',
            headers: {
                'access-token': localStorage.getItem('accessToken'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: data.id,
                indicatorName: data.indicatorName,
                minIndicatorValue: data.minValue,
                maxIndicatorValue: data.maxValue,
            }),
        }).then(resp =>
            resp.status === 200 ?
            resp.json().then(data => {
                fetchRubricTableData()
            }) :
            resp.json().then(err => {console.log(err.result); alert(err.toString())})
        )
    }

    const deleteRubric = data => {
        fetch(BACKEND_URL + '/api/evaluation/deleteRubric', {
            method: 'POST',
            headers: {
                'access-token': localStorage.getItem('accessToken'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: data.id
            }),
        }).then(resp => 
            resp.status === 200 ?
            resp.json().then(data => {
                fetchRubricTableData()
            }) :
            resp.json().then(err => {console.log(err.result); alert(err.toString())})
        )
    }
    
    useEffect(() => {
        if(!selectedTemplate)
            return
        
        console.log("Fetching rubrics..")
        fetchRubricTableData()
    }, [])

    useEffect(() => {
        console.log('rubric', rubricTableData)
    }, [rubricTableData])

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell/>
                        <TableCell/>
                        <TableCell/>
                        <TableCell width={200}/>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        rubricTableData.map(rowData => (
                            <RubricTableExpandable
                                key={rowData.id}
                                rowData={rowData}
                                deleteRubricParent={deleteRubricParent}
                                updateRubricParent={updateRubricParent}
                                addRubric={addRubric}
                                updateRubric={updateRubric}
                                deleteRubric={deleteRubric}
                            />
                        ))
                    }
                    <RubricTableAddNew addNewRubricParent={addNewRubricParent}/>
                </TableBody>
            </Table>
        </TableContainer>
    )
}

function AssemblyPanel({
    selectedTemplate,
    setSelectedTemplate,
    deleteTemplateButtonHandler,
}) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
        }}>
            <Button 
                variant="contained"
                style={{
                    width: '10em',
                }}
                onClick={() => setSelectedTemplate(null)}
            >Kembali</Button>

            <ChangeNameToolbar
                {...{
                    selectedTemplate,
                    setSelectedTemplate,
                    deleteTemplateButtonHandler,
                }}
            />

            <RubricEditorPanel
                selectedTemplate={selectedTemplate}
            />
        </div>
    )
}

export default AssemblyPanel