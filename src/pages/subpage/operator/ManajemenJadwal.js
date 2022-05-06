import React, { useEffect, useState } from 'react'
import { EditingState, ViewState, GroupingState, IntegratedEditing, IntegratedGrouping } from '@devexpress/dx-react-scheduler'
import {
    Scheduler,
    MonthView,
    DayView,
    WeekView,
    Appointments,
    AppointmentTooltip,
    AppointmentForm,
    GroupingPanel,
    Resources,
} from '@devexpress/dx-react-scheduler-material-ui'
import { Autocomplete, Button, Paper, TextField, Typography } from '@mui/material'
import {BACKEND_URL} from '../../../globals'
import {DateTimePicker, LocalizationProvider, TimePicker} from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDayjs';
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

const CustomCell = ({
    startDate,
    endDate,
    otherMonth,
    today,
    isShaded,
    formatDate,
    groupOrientation,
    groupingInfo,
    endOfGroup,
    onDoubleClick,
    setcvdate,
    setcvname,
}) => {
    //get the date from the startDate, (eg. 31)
    const dateString = endDate.toISOString().substring(8, 10)
    return (
        <td style={{
            height: '5em',
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
        }}>
            <div 
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: otherMonth ? 'rgba(255, 255, 255, 0.5)' : isShaded ? 'red' : today ? 'rgb(255, 255, 178)' : 'white',
                    height: '100%',
                    widht: '100%',
                }}
            >
                <Typography variant='subtitle1' style={{
                    color: otherMonth ? 'grey' : 'black',
                    marginLeft: '0.5em',
                }}>{dateString}</Typography>

                <Button 
                    variant='outlined' 
                    style={{
                        display: otherMonth ? 'none' : null,
                        width: '3em',
                        marginLeft: 'auto',
                        marginRight: '0.5em',
                        marginTop: '0.5em',
                    }}
                    onClick={() => {
                        setcvname("Day")
                        setcvdate(endDate.toISOString().substring(0, 10))
                    }}
                >Detail</Button>
            </div>
        </td>
    )
}

const Header = ({children, appointmentData, deleteSchedule, onDeleteButtonClick, ...restProps}) => {
    return (
        <AppointmentTooltip.Header {...restProps} appointmentData={appointmentData} style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        }}>
            <Button 
                variant='outlined' 
                style={{
                    borderColor: 'red',
                    color: 'red',
                }}
                onClick={() => {
                    if(!window.confirm('Apakah anda yakin ingin menghapus jadwal ini?'))
                        return
                    
                    deleteSchedule({id: appointmentData.id})
                    onDeleteButtonClick()
                }}
            >Hapus</Button>
        </AppointmentTooltip.Header>
    )
}

const Content = ({children, appointmentData, ...restProps}) => {
    // return (
    //     <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData} style={{
    //         display: 'flex',
    //         flexDirection: 'column',
    //     }}>
    //         {children}
    //     </AppointmentTooltip.Content>
    // )
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '1em 3em 1em 3em',
        }}>
            {
                [
                    ['Mata Pelajaran', appointmentData.title],
                    ['Guru', appointmentData.guruData.fullName],
                    ['Kelas', appointmentData.location],
                    ['Tanggal', dayjs(appointmentData.startDate).format('DD MMMM YYYY')],
                    ['Jam', dayjs(appointmentData.startDate).format('HH:mm') + ' - ' + dayjs(appointmentData.endDate).format('HH:mm')],
                ].map((el, idx) => (
                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '0.375em'}}>
                        <Typography variant='h6' style={{fontSize: '1.125em'}}>{el[0]}:</Typography>
                        <div style={{flexGrow: 1}}></div>
                        <Typography>{el[1]}</Typography>
                    </div>        
                ))
            }
        </div>
    )
}

const TambahJadwalPanel = ({
    teachersList,
    currentViewDate,
    addSchedule,
}) => {
    const [fieldMataPelajaran, setFieldMataPelajaran] = useState('')
    const [fieldKelas, setFieldKelas] = useState(null)
    const [fieldGuru, setFieldGuru] = useState(null)
    const [fieldJamMulai, setFieldJamMulai] = useState(null)
    const [fieldJamSelesai, setFieldJamSelesai] = useState(null)
    // const [fieldTanggal, setFieldTanggal] = useState('')
    const [kelasList, setKelasList] = useState([])

    const getKelasList = () =>
        fetch(BACKEND_URL + '/api/scheduler/getAllClassrooms', {
            method: 'GET',
            headers: {
                'access-token': localStorage.getItem('accessToken'),
            },
        }).then(resp =>
            resp.status === 200 ?
            resp.json().then(data => setKelasList(data.value)) :
            resp.json().then(err => {console.log(err.result); alert(err.result.toString())})
        )
    
    useEffect(() => {
        getKelasList()
        // parse currentViewDate from '2022-05-07' string to dayjs object
        const parsedCurrentViewDate = dayjs(currentViewDate)
        console.log(parsedCurrentViewDate.year(), parsedCurrentViewDate.month(), parsedCurrentViewDate.date())
    }, [])

    useEffect(() => {
        console.log(teachersList)
    }, [teachersList])

    const addScheduleButtonHandler = () => {
        if (fieldMataPelajaran === '') {
            alert('Mata pelajaran tidak boleh kosong')
            return
        }
        if (fieldKelas === null) {
            alert('Kelas tidak boleh kosong')
            return
        }
        if (fieldGuru === null) {
            alert('Guru tidak boleh kosong')
            return
        }
        if (fieldJamMulai === null) {
            alert('Jam mulai tidak boleh kosong')
            return
        }
        if (fieldJamSelesai === null) {
            alert('Jam selesai tidak boleh kosong')
            return
        }

        const data = {
            date: currentViewDate,
            dateHour: fieldJamMulai.hour(),
            dateMinute: fieldJamMulai.minute(),
            dateEndHour: fieldJamSelesai.hour(),
            dateEndMinute: fieldJamSelesai.minute(),
            mataPelajaran: fieldMataPelajaran,
            classroomId: fieldKelas.id,
            teacherId: fieldGuru.id,
        }

        addSchedule(data)

        //clear all fields
        setFieldMataPelajaran('')
        setFieldKelas(null)
        setFieldGuru(null)
        setFieldJamMulai(null)
        setFieldJamSelesai(null)
    }

    return (
        <Paper elevation={6} style={{
            marginTop: '1em',
            marginBottom: '1em',
            padding: '0.5em',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* section to add teaching schedule 

                will contain:
                    - mata pelajaran (input by text)
                    - kelas (select from dropdown list)
                    - guru (select from dropdown list)
                    - jam mulai (input by date picker)
                    - jam selesai (input by date picker)
                    - submit button (will submit the data to the server)
            */}
            <Typography>
                Tambah / Atur Jadwal
            </Typography>

            <div style={{
                display: 'flex',
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    marginRight: '1em'
                }}>
                    <TextField
                        label='Mata Pelajaran'
                        value={fieldMataPelajaran}
                        onChange={e => setFieldMataPelajaran(e.target.value)}
                        style={{
                            marginBottom: '0.75em',
                        }}
                    />

                    <Autocomplete
                        disablePortal
                        options={kelasList}
                        value={fieldKelas}
                        getOptionLabel={option => option?.className}
                        renderInput={params => <TextField {...params} label="Kelas"/>}
                        onChange={(evt, newVal) => setFieldKelas(newVal)}
                        style={{
                            marginBottom: '0.75em',
                        }}
                    />

                    <Autocomplete
                        disablePortal
                        options={teachersList}
                        value={fieldGuru}
                        getOptionLabel={option => option.text}
                        renderInput={params => <TextField {...params} label="Guru"/>}
                        onChange={(evt, newVal) => setFieldGuru(newVal)}
                    />
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                }}>
                    <LocalizationProvider dateAdapter={DateAdapter}>
                        <TimePicker
                            value={fieldJamMulai}
                            onChange={e => setFieldJamMulai(e)}
                            renderInput={params => 
                                <TextField {...params} label='Jam Mulai' style={{
                                    marginBottom: '0.75em',
                                }}/>
                            }
                        />
                    </LocalizationProvider>

                    <LocalizationProvider dateAdapter={DateAdapter}>
                        <TimePicker
                            value={fieldJamSelesai}
                            onChange={e => setFieldJamSelesai(e)}
                            renderInput={params => 
                                <TextField {...params} label='Jam Selesai' style={{
                                    marginBottom: '0.75em',
                                }}/>
                            }
                        />
                    </LocalizationProvider>

                    <Button
                        variant='contained'
                        onClick={addScheduleButtonHandler}
                    >
                        Tambah
                    </Button>
                </div>
            </div>


        </Paper>
    )
}

function ManajemenJadwal() {
    const [currentViewDate, setCurrentViewDate] = useState(new Date().toISOString().substring(0, 10))
    const [currentViewName, setCurrentViewName] = useState('Month')
    const [addedSchedule, setAddedSchedule] = useState({})
    const [scheduleChanges, setScheduleChanges] = useState({})
    const [editingSchedule, setEditingSchedule] = useState(undefined)
    const [exampleSchedules, setExampleSchedules] = useState([
        {
            title: "Test Data 1",
            startDate: new Date(2022, 3, 23, 9, 0),
            endDate:new Date(2022, 3, 23, 14, 0),
            id: 0,
            guru: 1,
            exampleData1: "testing data",
        }
    ])
    const [teachersList, setTeachersList] = useState([
        {
            text: 'NO DATA',
            id: 0,
        }
    ])
    const [schedulesList, setSchedulesList] = useState([])
    // const [exampleTeachers, setExampleTeachers] = useState([
    //     ...([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(elem => ({
    //         text: `Guru ${elem}`,
    //         id: elem-1,
    //     })))
    // ])
    const [teachers, setTeachers] = useState([
        {
            fieldName: 'guru',
            title: 'Guru',
            instances: teachersList,
        }
    ])
    const [grouping, setGrouping] = useState([
        {
            resourceName: 'guru',
        }
    ])

    const [scheduleTooltipVisible, setScheduleTooltipVisible] = useState(false)

    const getTeachersList = () => {
        fetch(BACKEND_URL + '/api/scheduler/getAllTeachers', {
            method: 'GET',
            headers: {
                'access-token': localStorage.getItem('accessToken'),
            }
        }).then(resp => 
            resp.status === 200 ?
            resp.json().then(data => {
                console.log(data)
                setTeachersList(data.value.map(teacher => ({
                    text: teacher.fullName,
                    id: teacher.id,
                })))
            }) :
            resp.json().then(err => {
                console.log(err.result)
                alert(err.result.toString())
            })
        )
    }

    const getSchedules = () => {
        fetch(BACKEND_URL + '/api/scheduler/getSchedules', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'access-token': localStorage.getItem('accessToken'),
            },
            body: JSON.stringify({
                date: currentViewDate,
            }),
        }).then(resp =>
            resp.status === 200 ?
            resp.json().then(data => {
                console.log(data)
                setSchedulesList(data.value.map(scheduleElem => {
                    let startDate = dayjs(scheduleElem.date)
                    startDate = startDate.set('hour', parseInt(scheduleElem.dateHour))
                    startDate = startDate.set('minute', parseInt(scheduleElem.dateMinute))
                    console.log(startDate.toISOString())

                    let endDate = dayjs(scheduleElem.date)
                    endDate = endDate.set('hour', parseInt(scheduleElem.dateEndHour))
                    endDate = endDate.set('minute', parseInt(scheduleElem.dateEndMinute))
                    console.log(endDate.toISOString())

                    const mappedData = {
                        title: scheduleElem.mataPelajaran,
                        startDate: startDate.toDate(),
                        endDate: endDate.toDate(),
                        id: scheduleElem.id,
                        guru: scheduleElem.teacher.id,
                        guruData: scheduleElem.teacher,
                        location: scheduleElem.classroom.className,
                        locationData: scheduleElem.classroom,
                    }

                    console.log(mappedData)

                    return mappedData
                }))
            }) :
            resp.json().then(err => {
                console.log(err.result)
                alert(err.result.toString())
            })
        )
    }

    const addSchedule = data => {
        fetch(BACKEND_URL + '/api/scheduler/addSchedule', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'access-token': localStorage.getItem('accessToken'),
            },
            body: JSON.stringify(data),
        }).then(resp =>
            resp.status === 200 ?
            resp.json().then(data => getSchedules()) :
            resp.json().then(err => {
                console.log(err)
                alert(err.toString())
            })
        )   
    }

    const deleteSchedule = data => {
        fetch(BACKEND_URL + '/api/scheduler/deleteSchedule', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'access-token': localStorage.getItem('accessToken'),
            },
            body: JSON.stringify(data),
        }).then(resp =>
            resp.status === 200 ?
            resp.json().then(data => getSchedules()) :
            resp.json().then(err => {
                console.log(err)
                alert(err.toString())
            })
        )
    }

    useEffect(() => {
        getTeachersList()
        getSchedules()
    }, []) // only triggers when component mounts

    useEffect(() => setTeachers([{
        fieldName: 'guru',
        title: 'Guru',
        instances: teachersList,
    }]), [teachersList])

    const parsedCurrentViewDate = dayjs(currentViewDate)

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '50em',
            flexGrow: 1,
        }}>
            <Button 
                variant='contained'
                style={{
                    display: currentViewName === 'Month' ? 'none' : null,
                }}
                onClick={() => {
                    setCurrentViewName('Month')
                    setCurrentViewDate(new Date().toISOString().substring(0, 10))
                }}
            >Kembali ke kalender bulan</Button>

            {currentViewName !== 'Month' && <TambahJadwalPanel {...{teachersList, currentViewDate, addSchedule}}/>}

            <div style={{
                display: currentViewName === 'Month' ? 'flex' : 'none',
                flexGrow: 1,
            }}>
                <Button variant='outlined' style={{marginRight: '1em'}} onClick={() => {
                    //move backward to last month
                    setCurrentViewDate(parsedCurrentViewDate.subtract(1, 'month').toISOString().substring(0, 10))
                }}>
                    Bulan Sebelumnya
                </Button>
                <Button variant='outlined' onClick={() => {
                    //move forward to next month
                    setCurrentViewDate(parsedCurrentViewDate.add(1, 'month').toISOString().substring(0, 10))
                }}>
                    Bulan Selanjutnya
                </Button>

                {/* divider */}
                <div style={{flexGrow: 1}}></div>

                <Typography variant='h6'>
                    Bulan {parsedCurrentViewDate.format('MMMM')} Tahun {parsedCurrentViewDate.format('YYYY')}
                </Typography>
            </div>

            <Scheduler
                data={schedulesList}
            >
                <ViewState
                    currentDate={currentViewDate}
                    currentViewName={currentViewName}
                />

                <GroupingState
                    grouping={grouping}
                />

                <EditingState
                    onCommitChanges={({added, changed, deleted}) => {
                        if(added) {
                            setExampleSchedules([...exampleSchedules, {
                                id: exampleSchedules.length > 0 ? exampleSchedules[exampleSchedules.length - 1].id + 1 : 0,
                                ...added
                            }])
                        }

                        // if(changed) {
                        //     console.log(changed)
                        // }

                        // if(deleted !== undefined) {
                        //     setEditingSchedule(exampleSchedules.filter(schedule => 
                        //         schedule.title !== 
                        //     ))
                        // }
                    }}
                    addedAppointment={addedSchedule}
                    onAddedAppointmentChange={schedule => setAddedSchedule(schedule)}
                    appointmentChanges={scheduleChanges}
                    onAppointmentChangesChange={schedule => setScheduleChanges(schedule)}
                    editingAppointment={editingSchedule}
                    onEditingAppointmentChange={schedule => setEditingSchedule(schedule)}
                />

                <MonthView
                    name="Month"
                    // timeTableCellComponent={CustomCell}
                    timeTableCellComponent={({...restProp
                    }) => <CustomCell 
                        setcvdate={setCurrentViewDate} 
                        setcvname={setCurrentViewName}
                        {...restProp}
                    />}
                />

                <DayView
                    name="Day"
                    startDayHour={6}
                    endDayHour={16}
                />

                {currentViewName === 'Month' ? null : <Appointments/>}
                {currentViewName === 'Month' ? null : <Resources
                    data={teachers}
                    mainResourceName="guru"
                />}
                {currentViewName === 'Month' ? null : <IntegratedGrouping/>}
                {currentViewName === 'Month' ? null : <IntegratedEditing/>}
                {currentViewName === 'Month' ? null : <AppointmentTooltip 
                    showCloseButton 
                    visible={scheduleTooltipVisible}
                    onVisibilityChange={() => setScheduleTooltipVisible(!scheduleTooltipVisible)}
                    headerComponent={({...restProp}) => <Header {...{deleteSchedule}} {...restProp}/>} 
                    contentComponent={({...restProp}) => <Content {...restProp}/>}
                />}
                {currentViewName === 'Month' ? null : <AppointmentForm/>}
                {currentViewName === 'Month' ? null : <GroupingPanel/>}
            </Scheduler>
        </div>
    )
}

export default ManajemenJadwal