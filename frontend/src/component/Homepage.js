import React from 'react'
import Dashboard from './Dashboard'

const HomePage = ({ setProgress }) => {
    return (
        <div >
            <Dashboard setProgress={setProgress} />
        </div>
    );
};

export default HomePage
