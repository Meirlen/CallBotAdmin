import React from 'react'
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

const stylesheet = `
    .brand-color {
        background: #10122E!important;
    }
`



export default function HeaderComponent({setName, email}) {

    let navigate = useNavigate();

    return (
        <header className="p-3 mb-3 border-bottom">
            <div className="container">
                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                    <div className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                        <h2>Администратор</h2>
                    </div>

                    <div className='col-2 col-lg-auto me-lg-auto mb-2 justify-content-right mb-md-0'>
                        { email }
                    </div>
                    <div className="dropdown text-end">
                        
                        <a href="#" className="d-block link-dark text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src="https://github.com/mdo.png" alt="mdo" className="rounded-circle" width="32" height="32" />
                        </a>
                        <ul className="dropdown-menu text-small" aria-labelledby="dropdownUser1">
                            <li><a className="dropdown-item" href="#">New project...</a></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><a className="dropdown-item" href="#" onClick={ (e) => {e.preventDefault();}}>Sign out</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    )

}