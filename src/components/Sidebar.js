import React from 'react'
import {Typography } from '@mui/material'
import logOutIcon from '../assets/logOutIcon.png'

const ListElement = ({img, text, onClick, bgColor}) => {
    const [hover, setHover] = React.useState(false)
    return (
        <div style={{
            display: 'flex', 
            flexDirection: 'row', 
            height: '2.7em', 
            cursor: 'pointer',
            // backgroundColor: bgColor,
            backgroundColor: hover ? 'rgba(255, 255, 255, 0.25)' : bgColor,
            borderRadius: '5em',
            alignItems: 'center',
            paddingLeft: '0.8em',
            marginBottom: '0.5em',
            transition: 'background-color 1s'
        }} 
        onClick={onClick}
        onMouseOver={() => setHover(true)}
        onMouseLeave={() => setHover(false)}>
            <img src={img} style={{width: '1.5em', height: '1.5em', marginRight: '0.5em'}} alt='' />
            <Typography style={{
                fontSize: hover ? '1.05em' : '1em',
                transition: 'font-size 1s'
            }}>{text}</Typography>
        </div>
    )
}

function Sidebar({routes, currentPage, handleSidebarClick, handleLogout}) {
  return (
    <div style={{display: 'flex', flexDirection: 'column', margin: '0em 0.5em 0em 0.5em', paddingTop: '0.5em'}}>
        {
            routes.map((route, idx) => (
                <ListElement
                    key={idx}
                    img={route.img}
                    text={route.name}
                    onClick={() => handleSidebarClick(route.route)}
                    bgColor={currentPage === route.route ? 'white' : 'rgba(0, 0, 0, 0)'}
                />
            ))
        }
        <ListElement
            img={logOutIcon}
            text='Keluar'
            onClick={() => handleLogout()}
            bgColor='rgba(0, 0, 0, 0)'
        />
    </div>
  )
}

export default Sidebar