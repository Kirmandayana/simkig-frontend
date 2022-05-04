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
import { Button, Paper, Typography } from '@mui/material'
import {BACKEND_URL} from '../../../globals'

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
            backgroundColor: 'grey',
        }}>
            <div 
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: otherMonth ? 'rgba(255, 255, 255, 0.5)' : isShaded ? 'red' : today ? 'yellow' : 'white',
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

const Header = ({children, appointmentData, schedules, setSchedules, onDeleteButtonClick, ...restProps}) => {
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
                    setSchedules(schedules.filter(schedule =>
                        schedule.title !== appointmentData.title &&
                        schedule.startDate !== appointmentData.startDate &&
                        schedule.endDate !== appointmentData.endDate
                    ))

                    onDeleteButtonClick()
                }}
            >Hapus</Button>
        </AppointmentTooltip.Header>
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

    // const getSchedules = () => {

    // }

    // useEffect(() => {
    //     console.log(exampleSchedules)
    // }, [exampleSchedules])

    useEffect(() => {
        getTeachersList()

    }, []) // only triggers when component mounts

    useEffect(() => setTeachers([{
        fieldName: 'guru',
        title: 'Guru',
        instances: teachersList,
    }]), [teachersList])

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
            >Back to Months</Button>

            <Paper elevation={6} style={{
                marginTop: '1em',
                marginBottom: '1em',
                padding: '0.5em',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <Typography>
                    Tambah / Atur Jadwal
                </Typography>

            </Paper>

            <Scheduler
                data={exampleSchedules}
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
                />

                {currentViewName === 'Month' ? null : <Appointments/>}
                {currentViewName === 'Month' ? null : <Resources
                    data={teachers}
                    mainResourceName="guru"
                />}
                {currentViewName === 'Month' ? null : <IntegratedGrouping/>}
                {currentViewName === 'Month' ? null : <IntegratedEditing/>}
                {currentViewName === 'Month' ? null : <AppointmentTooltip 
                    showOpenButton 
                    showCloseButton 
                    visible={scheduleTooltipVisible}
                    onVisibilityChange={() => setScheduleTooltipVisible(!scheduleTooltipVisible)}
                    headerComponent={({...restProp}) => <Header schedules={exampleSchedules} setSchedules={setExampleSchedules} {...restProp}/>} 
                />}
                {currentViewName === 'Month' ? null : <AppointmentForm/>}
                {currentViewName === 'Month' ? null : <GroupingPanel/>}
            </Scheduler>
        </div>
    )
}

export default ManajemenJadwal