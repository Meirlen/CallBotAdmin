import { getAuth } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import Navbar from './Common/Navbar';
import bootstrap from 'bootstrap';
import HeaderComponent from './Common/HeaderComponent';
import { defaultStylesheet } from './Style/Style';
import { fOrderService } from './Services/FOrderService';
import { where, orderBy, limit, startAfter, endBefore, limitToLast,} from "firebase/firestore"; 
import { GRPC_HOST } from '../conf';
import copy from 'copy-to-clipboard';

const { OrderSvcClient } = require('../protoout/order/order_grpc_web_pb');
const { GetAllRequest, OrderCollectionResponse} = require('../protoout/order/order_pb');

const auth = getAuth();
const client = new OrderSvcClient('http://' + GRPC_HOST + ':8080', null, null);
//const client = new UserSvcClient('http://localhost:8080', null, null);


const stylesheet = `
    .brand-color {
        background: #10122E!important;
    }

    .custom-table td:nth-child(2):before {
        content: "";
        display: block;
        width: 2px;
        height: 50%;
        position: absolute;
        z-index: 33;
        background-color: white;
        top: 25%;
        left: -2px;
    }

    .custom-table td:nth-child(3):before {
        content: "";
        display: block;
        width: 2px;
        height: 50%;
        position: absolute;
        z-index: 33;
        background-color: white;
        top: 25%;
        left: -2px;
    }

    .custom-table td:nth-child(4):before {
        content: "";
        display: block;
        width: 2px;
        height: 50%;
        position: absolute;
        z-index: 33;
        background-color: white;
        top: 25%;
        left: -2px;
    }

    .custom-table td:nth-child(5):before {
        content: "";
        display: block;
        width: 2px;
        height: 50%;
        position: absolute;
        z-index: 33;
        background-color: white;
        top: 25%;
        left: -2px;
    }

    .custom-table td:nth-child(6):before {
        content: "";
        display: block;
        width: 2px;
        height: 50%;
        position: absolute;
        z-index: 33;
        background-color: white;
        top: 25%;
        left: -2px;
    }

    .custom-table td:nth-child(7):after {
        content: "";
        display: block;
        width: 2px;
        height: 50%;
        position: absolute;
        z-index: 33;
        background-color: white;
        top: 25%;
        left: -2px;
    }
`

export default function OrderPage() {

    const [orders, setOrders] = useState([])
    const [comment, setComment] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [orderTypeFilter, setOrderTypeFilter] = useState('all');
    const [orderDateFilter, setOrderDateFilter] = useState('desc');
    const [currentOrder, setCurrentOrder] = useState();
    const [currentStatus, setCurrentStatus] = useState();
    const [lastOrder, setLastOrder] = useState(null);
    const [prevOrder, setPrevOrder] = useState(null);
    const [limitNumber, setLimitNumber] = useState(25);
    const [user, setUser] = useState(null);
    const [shownHistory, setShownHistory] = useState(false);
    const [historyCollection, setHistoryCollection] = useState(null);
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);

    useEffect( () => {
        let restoreLimit = sessionStorage.getItem('limit');
        if (restoreLimit != null) {
            console.log('limit ', restoreLimit);
            setLimitNumber(restoreLimit);
        } 
        auth.onAuthStateChanged(function(user) {
            if (user) {
                apllyFilters();
                sessionStorage.setItem("user", user);
                setUser(user);
            } else {
              // No user is signed in.
            }
          });
    }, []);

    const testOrderGrpc = async (page = 1) => {
        let getAllRequest = new GetAllRequest();
        getAllRequest.setPage("1");
        if (from != null) {
            getAllRequest.setFrom(from);
        }
        if (to != null) {
            getAllRequest.setTo(to);
        }
        if (limitNumber) {
            getAllRequest.setLimit(limitNumber.toString());
        }
        if (page !== 1) {
            getAllRequest.setPage(page.toString());
            setCurrentPage(page);
        }
        getAllRequest.setStatus("status");
        console.log("request ", getAllRequest);
        client.getAll(getAllRequest, null, function(err, response) {
            console.log('GetAllRequest');
            console.log('resp', response);
            
            if (response != null && response.array != undefined) {
                console.log('resp', response.array[0]);
                setHistoryCollection(response.array[0]);
            } else {
                setHistoryCollection([]);
            }
            
            setShownHistory(true);
        });
    }
    
    const saveCurrentOrder = async () => {
        let updatedOrder = currentOrder;
        updatedOrder.data.comment = comment;
        updatedOrder.data.status = currentStatus;
        setCurrentOrder(updatedOrder);
        fOrderService.fUpdate("orders", updatedOrder.key, updatedOrder.data);
        document.getElementById("closeModal").click();
        /*
        let updatedOrders = [...orders];
        for (let i = 0; i < updatedOrders.length; i++) {
            if (updatedOrders[i].key == updatedOrder.key) {
                updatedOrders[i] = updatedOrder;
            }
        }
        setOrders(updatedOrders);
        */
    }

    //TODO: тут должны быть queryConstrains
    const apllyFilters = async (type = null) => {
        console.log('next prev', lastOrder, prevOrder);
        setShownHistory(false);
        fOrderService.init = true;
        await fOrderService.fSelectWithQueryConstraints("orders", setOrders, getQueryConstaints(type), setLastOrder, setPrevOrder);
    }

    const getQueryConstaints = (type = null) => {
        let query = [];
        let isLimited = false;
        if (orderTypeFilter !== 'all') {
            query.push(where("status", "==", orderTypeFilter));
        }
        if (orderDateFilter !== '') {
            query.push(orderBy("createdAt", orderDateFilter));
        } else {
            query.push(orderBy("createdAt", "desc"));
        }
        if (type === 'next' && lastOrder !== undefined && lastOrder != null) {
            console.log('last ', lastOrder.data());
            //console.log('last order ', lastOrder);
            query.push(startAfter(lastOrder));
            query.push(limit(limitNumber)); 
            isLimited = true;
        }
        if (type === 'prev' && prevOrder !== undefined && prevOrder != null) {
            console.log('prev ', prevOrder.data());
            //console.log('last order ', lastOrder);
            query.push(endBefore(prevOrder));
            query.push(limitToLast(limitNumber));
            isLimited = true;
        }
        if (!isLimited) {
            query.push(limit(limitNumber)); 
        }
        console.log('query ', query);
        return query;
    }

    const filter = async (value) => {
        console.log('filter ', value);
        fOrderService.unsubQuery();
        if (value === "all") {
            setOrderTypeFilter('all');
            return;
        }
        setOrderTypeFilter(value);
        setLastOrder(null);
        setPrevOrder(null);
        setCurrentPage(1);
    }

    const filterByDate = async (value) => {
        console.log("filter by date ", value)
        switch (value) {
            case "new_first":
                setOrderDateFilter("desc");
            break;
            case "old_first": 
                setOrderDateFilter("asc");
            break;
            default:
                setOrderDateFilter("");
        }
        setLastOrder(null);
        setPrevOrder(null);
        setCurrentPage(1);
    } 

    const prevPage = (type = null) => {
        //console.log('preev ', orders, orders[orders.length - 1].data.created);
        //fOrderService.fSelect("orders", setOrders, null, null, 5, 'prev');
        setCurrentPage(currentPage - 1);
        if (shownHistory) {
            testOrderGrpc();
        } else {
            apllyFilters(type);
        }
    }

    const nextPage = (type = null) => {
        //console.log('next ', orders, orders[orders.length - 1] , orders[orders.length - 1].created);
        //fOrderService.fSelect("orders", setOrders, null, null, 5, 'next');
        setCurrentPage(currentPage + 1);
        if (shownHistory) {
            testOrderGrpc();
        } else {
            apllyFilters(type);
        }
    }

    const selectItem = async (order) => {
        setCurrentStatus(order.data.status);
        if (order.data.comment === undefined) {
            setComment('');
        } else {
            setComment(order.data.comment);
        }
        setCurrentOrder(order);
        console.log('Selected order ', currentOrder, order);
    }

    const getClass = (status) => {
        //console.log(status);
        let className = '';
        switch (status) {
            case 'new':
                className = 'b-brand-color-white';
            break;
            case 'accept': 
                className = 'b-brand-color-green ';
            break;
            case 'decline': 
                className = 'b-brand-color-red';
            break;
            case 'wait': 
                className = 'b-brand-color-orange';
            break;
            case 'cancel-by-user':
                className = 'b-brand-color-dark'
            break; 
            default:
                className = 'b-brand-color-white';
        }
        //console.log(className);
        return className;
    }

    const getActiveButton = (currentStatus, btnStatus) => {
        //console.log('get active button ', currentStatus, btnStatus);
        if (currentStatus !== btnStatus) {
            return "";
        }
        let className = '';
        switch (currentStatus) {
            case 'new':
                className = 'b-brand-color-white';
            break;
            case 'accept': 
                className = 'bg-success text-dark';
            break;
            case 'decline': 
                className = 'bg-danger text-dark';
            break;
            case 'wait': 
                className = 'b-brand-color-orange text-dark';
            break;
            case 'cancel-by-user':
                className = 'bg-dark text-white';
            break;
            default:
                className = '';
        }
        return className;
    } 

    const getArea = (area) => {
        let icon = '';
        switch (area) {
            case 'telegram':
                icon = <img src="/icons/icons8-telegram-app.svg" style={{height:"30px"}} alt=''></img>;
            break;
            case 'whatsapp': 
                icon = <img src="/icons/icons8-whatsapp.svg" style={{height:"30px"}} alt=''/>;
            break;
            default:
                icon = '';
        }
        return icon;
    }

    const histories = shownHistory === true && historyCollection.length > 0 ?
        historyCollection.map((note, index) => 
            <tr key={index} className={ getClass( note[7] ) }>
                <td>{ new Date(note[4]).getHours() + ":" + new Date(note[4]).getMinutes()}</td>
                <td>{ note[5] }</td>
                <td>{ note[8] }</td>
                <td>{ note[10] }</td>
                <td>{ note[6] }</td>
                <td>{ getArea(note[2]) }</td>
            </tr>
        ) : <tr></tr>;

    const partners = shownHistory === false && orders && orders.length > 0 ?
            orders.map((item, index) =>
                <tr  key={index} className={ getClass(item.data.status) }
                    data-bs-toggle="modal" data-bs-target="#exampleModal" 
                    onClick={ async () => { 
                        await selectItem(item);
                        //selectItem(null); 
                        //console.log(currentOrder);
                        
                    } }
                >
                    <td>{ item.data.createdAt.toDate().getHours() + ":" + item.data.createdAt.toDate().getMinutes() }</td>
                    <td>{item.data.from}</td>
                    <td>{item.data.to}</td>
                    <td>{item.data.price}</td>
                    <td>{item.data.phone}</td>
                    <td>{ getArea(item.data.area) }</td>
                </tr>  
            ) : <tr></tr>;

    return (
        <div className="row h-100">
            <style>
                {defaultStylesheet}
            </style>
            <style>
                {stylesheet}
            </style>
            <Navbar currentActive={"main"}></Navbar>
            <main className="col-md-9 ms-sm-auto col-lg-10 ">
                <div className="col">
                    <HeaderComponent email={user != null ? user.email : null}></HeaderComponent>
                    <div className='row align-left'>
                        <div className='col'>
                            <select className="form-select custom-select d-inline-block m-2" id="country" required="" onChange={ (e) => { filter(e.target.value) }}>
                                <option value="all">Все заказы</option>
                                <option value="new">Новые заказы</option>
                                <option value="decline">Отменённый заказы</option>
                                <option value="wait">Ожидающие заказы</option>
                                <option value="accept">Принятые заказы</option>
                            </select>
                        </div>
                        <div className='col'>
                            <select className="form-select custom-select d-inline-block m-2" id="country" required="" onChange={ (e) => { filterByDate(e.target.value) }}>
                                <option value="all"></option>
                                <option value="new_first">Сначала свежие</option>
                                <option value="old_first">Сначала старые</option>
                            </select>
                        </div>
                        <div className='col'>
                            <select className="form-select custom-select d-inline-block m-2" id="country" required="" onChange={ (e) => { setLimitNumber(e.target.value); sessionStorage.setItem('limit', e.target.value) }}>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>
                        <div className='col'>
                            <button className='btn btn-primary m-2' onClick={ () => apllyFilters() }> Применить </button>
                            <button className='btn btn-primary m-2' onClick={ () => testOrderGrpc() }> GRPC </button>
                        </div>
                        <div className='row col-12'>
                            <div className='col'>
                                <input className='form-select custom-select m-2' type={'date'} onChange={ (event) => {setFrom(event.target.value)}}></input>
                            </div>
                            <div className='col'>
                                <input className='form-select custom-select m-2' type={'date'} onChange={ (event) => {setTo(event.target.value)}}></input>
                            </div>
                            <div className='col'>
                                <button className='btn btn-primary m-2' onClick={ () => testOrderGrpc() }> Отфильтровать </button>
                            </div>
                        </div>
                    </div>
                    <div className="row table-responsive p-3 b-brand-light-gray table-scroll">
                        <table className="table">
                            <thead className='f-18  p-2'>
                                <tr>
                                    <th scope="col">Время</th>
                                    <th scope="col">Откуда</th>
                                    <th scope="col">Куда</th>
                                    <th scope="col">Цена</th>
                                    <th scope="col">Номер</th>
                                    <th scope="col">Площадка</th>
                                </tr>
                            </thead>
                            <tbody className='custom-table p-2'>
                                {
                                    histories
                                }
                                {
                                    partners
                                }
                            </tbody>
                        </table>
                        
                    </div>
                    <div className='pagination-buttons'>
                        {
                            shownHistory === false ?
                                <div>
                                    <button className={currentPage === 1 ? "btn btn-primary m-2 disabled" : "btn btn-primary m-2 " } href="#" onClick={ () => {
                                            prevPage("prev");
                                        } }>Предыдущая</button>
                                    <button className={ "btn btn-primary m-2 " } onClick={ () => { 
                                            nextPage("next");
                                        }}
                                    >Следующая</button>
                                </div>
                            :
                            <div>
                                <button className={currentPage === 1 ? "btn btn-primary m-2 disabled" : "btn btn-primary m-2 " } href="#" onClick={ () => {
                                        prevPage(currentPage - 1);
                                    } }>Предыдущая</button>
                                <button className={ "btn btn-primary m-2 " } onClick={ () => { 
                                        testOrderGrpc(currentPage + 1);
                                    }}
                                >Следующая</button>
                            </div>
                        }
                        
                    </div>
                        
                </div>
            </main> 
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header border-0">
                            <button id="closeModal" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {
                                currentOrder != null ?
                                <div>
                                    <div className='row'>
                                        <div className='d-grid gap-2 col-6 mx-auto'>
                                            <p>Откуда : </p>
                                            <button className='btn btn-light mb-1'  onClick={ () => {  copy(currentOrder.data.from); } } >{ currentOrder.data.from } <i className="bi bi-files float-end"></i></button>
                                            <p>Куда : </p>
                                            <button className='btn btn-light mb-1' onClick={ () => { copy(currentOrder.data.to) } }>{ currentOrder.data.to }  <i className="bi bi-files float-end"></i></button>
                                            <p>Пользовательский комментарий: {currentOrder.data.user_comment} </p>
                                            <p>Платформа : </p>
                                            <button className='btn btn-light mb-1' onClick={ () => { copy(currentOrder.data.area) } }>  { currentOrder.data.area } <i className="bi bi-files float-end"></i></button>
                                            <label className='mb-1'>Статус</label>
                                            <button type="button" 
                                                onClick={ () => { setCurrentStatus('wait') } } 
                                            className={
                                            "btn btn-outline-warning mb-1 " + getActiveButton(currentStatus, 'wait') 
                                            }>Ожидание</button>
                                            <button type="button"
                                                onClick={ () => { setCurrentStatus('accept') } } 
                                            className={
                                                "btn btn-outline-success mb-1 " + getActiveButton(currentStatus, 'accept') 
                                            }>Успешно</button>
                                            <button type="button" 
                                                onClick={ () => { setCurrentStatus('decline') } } 
                                            className={
                                            "btn btn-outline-danger mb-1 " + getActiveButton(currentStatus, 'decline') 
                                            }>Отмена</button>
                                            <button className={"btn btn-outline-dark mb-1 " + getActiveButton(currentStatus, 'cancel-by-user')}>Отменено пользователем</button>
                                            <input className='text-center' value={comment}  type="text" placeholder='Введите комментарий' onChange={ (e) => { 
                                                setComment(e.target.value);
                                            } } />
                                        </div>
                                    </div>
                                </div> : null
                            }
                        </div>
                        <div className="modal-footer d-inline">
                            <div className="d-grid gap-2 col-6 mx-auto">
                                <button type="button" className="btn btn-primary mb-1" onClick={() => { saveCurrentOrder(); }}>Применить</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>  
        </div>
    )

}