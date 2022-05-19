import React from 'react'

const stylesheet = `
    .brand-color {
        background: #10122E!important;
    }
`

export default function Navbar({setName, setEmail, currentActive}) {

    const getActiveClass = (currentActive, active) => {
        if (currentActive == active) {
            return 'active';
        }
        return '';
    }

    return (
        <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse p-0 ">
            <div className="d-flex flex-column flex-shrink-0 p-4 text-white brand-color h-100 text-start">
                <style>
                    {stylesheet}
                </style>
                <a href="/orders" className=" align-items-center mb-3 mb-md-0 text-white text-decoration-none text-center">
                    <img id="logoImage" className="mb-5 mt-5 w-100" src='/images/30a73fef51e49cae69255a5ae18d93e0.png' alt='logo'></img>
                </a>
                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item">
                        <a href="/orders" className={"nav-link text-white " + getActiveClass('main', currentActive)} aria-current="page">
                            <h4 className='p-0 m-0'>Главная</h4>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#" className={"nav-link text-white " + getActiveClass('calc', currentActive)} aria-current="page">
                            <h4 className='p-0 m-0'>Калькуляция заказа</h4>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="/price" className={"nav-link link-light " + getActiveClass('price', currentActive)} aria-current="page">
                            Цена поездки
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="/region" className={"nav-link link-light " + getActiveClass('region', currentActive)} aria-current="page">
                            Регионы
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#" className="nav-link link-light" aria-current="page">
                            Повышенный тариф
                        </a>
                    </li>
                    <li className='mt-5'>
                        <h4 className='m-3 p-0'>Роли</h4>
                    </li>
                    <li className="nav-item">
                        <a href="#" className="nav-link link-light" aria-current="page">
                            Администратор
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#" className="nav-link link-light" aria-current="page">
                            Супер-администратор
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#" className="nav-link link-light" aria-current="page">
                            Менеджер
                        </a>
                    </li>
                </ul>

                <div className='m-3'>
                    <p className='m-0 text-muted f-18'>Служба поддержки:</p>
                    <p className='m-0 text-muted f-18'>+7 (800) 555-35-35</p>
                </div>
            </div>
        </nav>  
    )

}