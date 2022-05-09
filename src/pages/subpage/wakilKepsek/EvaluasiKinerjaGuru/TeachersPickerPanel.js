import React, { useEffect, useState } from 'react'
import { BACKEND_URL } from '../../../../globals'

function TeachersPickerPanel({selectedTeacher, setSelectedTeacher}) {
    const [teachersList, setTeachersList] = useState([])

    const getTeachersList = () =>
        fetch(BACKEND_URL + '/api/evaluation/getTeachersList', {
            method: 'GET',
            headers: {
                'access-token': localStorage.getItem('accessToken')
            },
        }).then(resp =>
            resp.status === 200 ?
            resp.json().then(data => setTeachersList(data.result)) :
            resp.json().then(error => {console.log(error); alert(error);})
        )
    
    useEffect(() => getTeachersList(), [])
    console.log(teachersList)

    return (
        <div>TeachersPickerPanel</div>
    )
}

export default TeachersPickerPanel