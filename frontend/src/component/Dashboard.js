import React, { useEffect } from 'react'

const Dashboard = ({setProgress}) => {

    useEffect(() => {
        setProgress(40)
        setTimeout(() => {
            setProgress(100)
        }, 500);
    }, [setProgress])

    return (
        <div> I need to develop this page please be patient.</div>
    )
}

export default Dashboard