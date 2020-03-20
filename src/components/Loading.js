import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

export const Loading = () => {

    return (
        <div className="vertical-center center-outer">
            <div className="box1 center-inner">
                <CircularProgress />
            </div>
        </div>
    )
    
}
