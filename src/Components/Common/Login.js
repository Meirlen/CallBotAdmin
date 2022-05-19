import * as React from 'react';
import BasicButtons from './Button';

const stylesheet = `
html,
body {
height: 100%;
}

.main-form{
    width: 100%;
    max-width: 500px;
    padding: 15px;
    margin: auto;
}

body {
    display: flex;
    align-items: center;
    padding-top: 40px;
    padding-bottom: 40px;
    background-color:#10122E; 
}

.form-signin {
    width: 100%;
    padding: 15px;
    margin: auto;
    background-color:white;
}

.form-signin .checkbox {
    font-weight: 400;
}

.form-signin .form-floating:focus-within {
    z-index: 2;
}

.form-signin input[type="email"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}

.b-brand-color-gray{
    background-color:#F8F8F8;
}

.b-brand-color-darken {
    background-color:#10122E; 
}
`

export default function Login({ setPassword, setEmail, handleAction }) {
    return (
        <div className="text-center ">
            <main className="form-signin rounded p-5">
                <style> {stylesheet} </style>
                <form
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                    onSubmit={handleAction}
                >
                    <img className="mb-4" src="/images/971d393a9f25911fe2f594090658156c.png" alt="logo"  width={254} height={62} />
                    <h1 className="h3 mb-3 fw-normal">Авторизация</h1>

                    <div className='row'>
                        <div className='d-grid gap-2 mx-auto'>
                            <div className="form-floating p-1">
                                <input type="email" className="form-control b-brand-color-gray rounded" id="floatingInput" placeholder="name@example.com"
                                    label="Enter the Email"
                                    variant="outlined"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <label htmlFor="floatingInput">Эл. адрес</label>
                            </div>

                            <div className="form-floating p-1">
                                <input type="password" className="form-control b-brand-color-gray rounded" id="floatingPassword" placeholder="Password" 
                                    label="Enter the Password"
                                    variant="outlined"
                
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <label htmlFor="floatingPassword">Пароль</label>
                            </div>

                            <BasicButtons customClass="btn btn-primary p-3" customStyle={'font-size:18px'} title={"Вход"} handleAction={ (e) => {e.preventDefault(); handleAction()}}/>

                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}