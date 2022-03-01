import React from 'react'
import TableLaporanGuru from './TableLaporanGuru'
import DetailLaporanGuru from './DetailLaporanGuru'

function TabelLaporanGuruContainer() {
    const [selectedUser, setSelectedUser] = React.useState(undefined)
    const [selectedMonth, setSelectedMonth] = React.useState(undefined)
    const [selectedYear, setSelectedYear] = React.useState(undefined)

    if(selectedUser) {
        return (
            <DetailLaporanGuru
                selectedUser={selectedUser}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}

                setSelectedUser={setSelectedUser}
            />
        )
    } else {
        return (
            <TableLaporanGuru
                setSelectedUser={setSelectedUser}
                setSelectedMonth={setSelectedMonth}
                setSelectedYear={setSelectedYear}
            />
        )
    }
}

export default TabelLaporanGuruContainer