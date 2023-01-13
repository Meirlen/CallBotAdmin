import { getAuth } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import Navbar from '../Common/Navbar';
import HeaderComponent from '../Common/HeaderComponent';
import { defaultStylesheet } from '../Style/Style';
import { fOrderService } from '../Services/FOrderService';
import { where, orderBy, limit, startAfter, endBefore, limitToLast, } from "firebase/firestore";
import { GRPC_HOST } from '../../conf';
import copy from 'copy-to-clipboard';
import { Space, Table, Tag, Form, Typography, Select } from 'antd';
import { columns } from './columns';
import { WatchModal } from './WatchModal';
import { EditOrder } from './EditOrder';
import { CreateOrder } from '../CreateOrder/CreateOrder';
import axios from 'axios';
import { toast } from 'react-toastify';
const { OrderSvcClient } = require('../../protoout/order/order_grpc_web_pb');
const { GetAllRequest, OrderCollectionResponse } = require('../../protoout/order/order_pb');
const { Option } = Select;
const { Title } = Typography;

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
    const [limitNumber, setLimitNumber] = useState(undefined);
    const [user, setUser] = useState(null);
    const [shownHistory, setShownHistory] = useState(false);
    const [historyCollection, setHistoryCollection] = useState(null);
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);
    const [watchOrder, setWatchOrder] = useState(null);
    const [editOrder, setEditOrder] = useState(null);
    const [form] = Form.useForm();
    const [savingOrder, setSavingOrder] = useState(false);
    const [filterByStatus, setFilterByStatus] = useState("default");
    const statuses = [
        { title: "Поиск авто", value: "search_car" },
        { title: "Авто назначена", value: "assigned" },
        { title: "Авто прибыла", value: "arrived" },
        { title: "Авто не найдена", value: "expired" },
        { title: "Завершен", value: "completed" },
        { title: "Отменено водителем", value: "cancel_by_driver" },
        { title: "Отменено пользователем", value: "cancel_by_user" },
    ]
    const [locations, setLocations] = useState([]);
    const [filterByLocation, setFilterByLocation] = useState("default");

    const handleGetLocations = () => {
        let locationsData = [];

        orders?.forEach(order => {
            if (order.data.route) {
                order.data.route?.forEach(route => {
                    const routeName = route?.fullname;
                    if (routeName && !locationsData?.find(l => l.value === routeName)) {
                        locationsData.push({ value: routeName, label: routeName })
                    }
                })
            }
        })

        setLocations(locationsData)
    }

    useEffect(() => {
        handleGetLocations()
    }, [orders])

    const handleGetOrderStatus = (order) => ({ order, data: { ...order.data, status: statuses.find(s => s.value === order.data.status)?.title ?? "" } });

    const handleCloseEditOrderModal = () => {
        form.resetFields();
        setEditOrder(false);
        setSavingOrder(false);
    }

    const handleSaveEditedOrder = async (values) => {
        setSavingOrder(true);
        const response = await axios.post('http://165.22.13.172:8000/mobile/order/update_status',
            { order_id: editOrder.key, status: values.status },
            { headers: { 'Content-Type': 'application/json' } }
        );
        setSavingOrder(false);

        if (response?.status === 200) {
            toast.success("Заказ успешно сохранен!");
            setEditOrder(null);
        }
    }


    useEffect(() => {
        let restoreLimit = sessionStorage.getItem('limit');
        if (restoreLimit != null) {
            console.log('limit ', restoreLimit);
            setLimitNumber(restoreLimit);
        }
        auth.onAuthStateChanged(function (user) {
            if (user) {
                apllyFilters();
                sessionStorage.setItem("user", user);
                setUser(user);
            } else {
                // No user is signed in.
            }
        });
    }, []);


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
                icon = <img src="/icons/icons8-telegram-app.svg" style={{ height: "30px" }} alt=''></img>;
                break;
            case 'whatsapp':
                icon = <img src="/icons/icons8-whatsapp.svg" style={{ height: "30px" }} alt='' />;
                break;
            default:
                icon = '';
        }
        return icon;
    }

    const histories = shownHistory === true && historyCollection.length > 0 ?
        historyCollection.map((note, index) =>
            <tr key={index} className={getClass(note[7])}>
                <td>{new Date(note[4]).getHours() + ":" + new Date(note[4]).getMinutes()}</td>
                <td>{note[5]}</td>
                <td>{note[8]}</td>
                <td>{note[10]}</td>
                <td>{note[6]}</td>
                <td>{getArea(note[2])}</td>
            </tr>
        ) : <tr></tr>;

    const partners = shownHistory === false && orders && orders.length > 0 ?
        orders.map((item, index) =>
            <tr key={index} className={getClass(item.data.status)}
                data-bs-toggle="modal" data-bs-target="#exampleModal"
                onClick={async () => {
                    await selectItem(item);
                    //selectItem(null); 
                    //console.log(currentOrder);

                }}
            >
                {/* <td>{ item.data.createdAt.toDate().getHours() + ":" + item.data.createdAt.toDate().getMinutes() }</td> */}
                <td>{item.data.from}</td>
                <td>{item.data.to}</td>
                <td>{item.data.price}</td>
                <td>{item.data.phone}</td>
                <td>{getArea(item.data.area)}</td>
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
            <div className='main-wrapper'>
                <Navbar currentActive={"main"}></Navbar>
                <main className="content-wrapper">
                    <div className="col">
                        <HeaderComponent email={user != null ? user.email : null}></HeaderComponent>
                        <div className="row table-responsive p-3 b-brand-light-gray table-scroll">
                            <div className='orders-page-filter'>
                                <div className='d-flex flex-column'>
                                    <Typography className='filter-title'>Фильтр по статусу:</Typography>
                                    <Select
                                        value={filterByStatus}
                                        onSelect={value => setFilterByStatus(value)}
                                        className="orders-page-filter-by-status"
                                    >
                                        <Option value={"default"}>Все статусы</Option>
                                        {statuses.map((status, i) => (
                                            <Option key={i} value={status.value}>{status.title}</Option>
                                        ))}
                                    </Select>
                                </div>
                                <div className='d-flex flex-column filter-item'>
                                    <Typography className='filter-title'>Фильтр по локации:</Typography>
                                    <Select
                                        value={filterByLocation}
                                        onSelect={value => setFilterByLocation(value)}
                                        className="orders-page-filter-by-status"
                                        options={[{ value: "default", label: "Все локации" }, ...locations]}
                                    />
                                </div>
                                <CreateOrder />
                            </div>
                            <Table
                                columns={columns}
                                dataSource={
                                    orders
                                        .filter(order => filterByStatus === "default" ? true : order?.data?.status === filterByStatus ? true : false)
                                        .filter(order => filterByLocation === "default" ? true : order?.data?.route.find(r => r.fullname === filterByLocation) ? true : false)
                                        .sort((a, b) => statuses.map(status => status.value).indexOf(a.data.status) - statuses.map(status => status.value).indexOf(b.data.status))
                                        .map((order) => ({
                                            ...order,
                                            onWatch: () => setWatchOrder(handleGetOrderStatus(order)),
                                            onEdit: () => setEditOrder(order)
                                        }))
                                }
                                response
                                className='order-table'
                                pagination={{ position: "center" }}
                                responsive
                                locale={{ emptyText: "Пусто" }}
                            />
                        </div>

                    </div>
                </main>
            </div>
            <WatchModal watchOrder={watchOrder} onClose={() => setWatchOrder(null)} />
            <EditOrder
                editOrder={editOrder}
                onClose={handleCloseEditOrderModal}
                onSave={handleSaveEditedOrder}
                form={form}
                saving={savingOrder}
            />
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
                                                <button className='btn btn-light mb-1' onClick={() => { copy(currentOrder.data.from); }} >{currentOrder.data.from} <i className="bi bi-files float-end"></i></button>
                                                <button className='btn btn-light mb-1' onClick={() => { copy(currentOrder.data.to) }}>{currentOrder.data.to}  <i className="bi bi-files float-end"></i></button>
                                                <button className='btn btn-light mb-1' onClick={() => { copy(currentOrder.data.phone) }}>{currentOrder.data.phone}  <i className="bi bi-files float-end"></i></button>

                                                <p>Комментарий: <b>{currentOrder.data.user_comment}</b> </p>
                                                <label className='mb-1'>Статус</label>
                                                <button type="button"
                                                    onClick={() => { setCurrentStatus('accept') }}
                                                    className={
                                                        "btn btn-outline-success mb-1 " + getActiveButton(currentStatus, 'accept')
                                                    }>Успешно</button>
                                                <button type="button"
                                                    onClick={() => { setCurrentStatus('decline') }}
                                                    className={
                                                        "btn btn-outline-danger mb-1 " + getActiveButton(currentStatus, 'decline')
                                                    }>Отмена</button>
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