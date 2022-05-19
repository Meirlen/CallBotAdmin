import * as React from 'react';
import BasicButtons from './Button';
export default function BasicTextFields({ title, setPassword, setEmail, handleAction }) {
    return (
        <div>
            <div className="heading-container">
                <h3>
                    {title} Form
                </h3>
            </div>

            <form
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
                onSubmit={handleAction}
            >
                <input 
                    type="text"
                    id="email"
                    label="Enter the Email"
                    variant="outlined"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="text"
                    id="password"
                    label="Enter the Password"
                    variant="outlined"

                    onChange={(e) => setPassword(e.target.value)}
                />
            </form>

            <BasicButtons title={title} handleAction={handleAction}/>
        </div>
    );
}