import * as React from 'react';


export default function BasicButtons({title, handleAction, customClass, customStyle}) {
    return (
        <button variant="contained" onClick={handleAction} className={customClass}>{title}</button>
    );
}