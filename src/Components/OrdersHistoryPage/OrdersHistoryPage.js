import { getAuth } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import Navbar from '../Common/Navbar';
import HeaderComponent from '../Common/HeaderComponent';
import { defaultStylesheet } from '../Style/Style';
import { GRPC_HOST } from '../../conf';
import { Table, DatePicker, Typography, Select, Button } from 'antd';
import { columns, handleAddZero } from './columns';
import { WatchModal } from './WatchModal';
import axios from 'axios';
import dayjs from 'dayjs';
import { RightOutlined, LeftOutlined, } from '@ant-design/icons';
import { handleGetTodayDate } from './date';

const { OrderSvcClient } = require('../../protoout/order/order_grpc_web_pb');
const { Option } = Select;
const { RangePicker } = DatePicker;

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


export default function OrdersHistoryPage() {
    const [orders, setOrders] = useState([])
    const [user, setUser] = useState(null);
    const [watchOrder, setWatchOrder] = useState(null);
    const [filterByStatus, setFilterByStatus] = useState("all");
    const statuses = [
        { title: "Поиск авто", value: "search_car" },
        { title: "Авто назначена", value: "assigned" },
        { title: "Авто прибыла", value: "arrived" },
        { title: "Авто не найдена", value: "expired" },
        { title: "Завершен", value: "completed" },
        { title: "Отменено водителем", value: "cancel_by_driver" },
        { title: "Отменено пользователем", value: "cancel_by_user" },
    ]
    const dateFormat = 'YYYY-MM-DD';
    const [dateFilter, setDateFilter] = useState([dayjs('2022-01-01', dateFormat), dayjs(handleGetTodayDate(), dateFormat)]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLastPage, setIsLastPAge] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dispatcets, setDispatchers] = useState([]);
    const [activeDispatcher, setActiveDispathcer] = useState("");

    const handleGetOrderStatus = (order) => ({ order, data: { ...order.order_info, status: statuses.find(s => s.value === order.order_info.status)?.title ?? "", route: order.route } });

    const handleChangeFilterByStatus = (value) => {
        setFilterByStatus(value);
        setCurrentPage(1);
    }


    const handleChangeDateFilter = (value) => {
        setDateFilter(value);
        setCurrentPage(1);
    }

    useEffect(() => {
        let restoreLimit = sessionStorage.getItem('limit');
        if (restoreLimit != null) {
        }
        auth.onAuthStateChanged(function (user) {
            if (user) {
                sessionStorage.setItem("user", user);
                setUser(user);
            } else {
                // No user is signed in.
            }
        });
    }, []);


    const handleGetDispatchers = async () => {
        const response = await axios.get('http://165.22.13.172:8000/mobile/dispatchers',
            { headers: { 'Content-Type': 'application/json' } }
        );
        const dispathersOptions = response?.data?.dispatchers ? response?.data?.dispatchers.map(d => ({ value: d.email, label: d?.name ?? "" })) : [];
        setDispatchers(dispathersOptions);
        setActiveDispathcer(dispathersOptions[0].value);
    }

    const handleSelectDispatcher = (value) => {
        setCurrentPage(1);
        setActiveDispathcer(value)
    }

    useEffect(() => {
        handleGetDispatchers()
    }, [])

    const handleGetOrders = async () => {
        setIsLastPAge(false);
        setLoading(true);
        const response = await axios.get('http://165.22.13.172:8000/mobile/order_history',
            {
                headers: { 'Content-Type': 'application/json' },
                params: {
                    page: currentPage,
                    email: activeDispatcher ?? "",
                    start_date: dateFilter?.length >= 1 ? dateFilter[0]?.format(dateFormat) : '2022-01-01',
                    end_date: dateFilter?.length >= 2 ? dateFilter[1]?.format(dateFormat) : handleGetTodayDate(),
                    status: filterByStatus,
                }
            }
        );
        setLoading(false);
        setIsLastPAge(response?.data?.orders?.length === 0);
        setOrders(response?.data?.orders ?? [])
    }

    console.log(orders)

    useEffect(() => {
        if (activeDispatcher) {
            handleGetOrders();
        }
    }, [user, filterByStatus, dateFilter, currentPage, activeDispatcher])

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
                            <div className='orders-page-filter orders-history-page-filter'>
                                <div className='d-flex flex-column orders-history-page-filter-item  '>
                                    <Typography className='filter-title'>Фильтр по статусу:</Typography>
                                    <Select
                                        value={filterByStatus}
                                        onSelect={handleChangeFilterByStatus}
                                        className="orders-page-filter-by-status"
                                    >
                                        <Option value={"all"}>Все статусы</Option>
                                        {statuses.map((status, i) => (
                                            <Option key={i} value={status.value}>{status.title}</Option>
                                        ))}
                                    </Select>
                                </div>
                                <div className='d-flex flex-column date-filter-order-history orders-history-page-filter-item '>
                                    <Typography className='filter-title'>Фильтр по дате:</Typography>
                                    <RangePicker
                                        format="YYYY-MM-DD"
                                        onChange={handleChangeDateFilter}
                                        value={dateFilter}
                                        placeholder={["Дата начала", "Дата конца"]}
                                    />
                                </div>
                                <div className='d-flex flex-column date-filter-order-history orders-history-page-filter-item '>
                                    <Typography className='filter-title'>Выбранный диспетчер:</Typography>
                                    <Select
                                        value={activeDispatcher}
                                        onSelect={handleSelectDispatcher}
                                        options={dispatcets}
                                    />
                                </div>
                                {/* <div className='d-flex flex-column filter-item'>
                                    <Typography className='filter-title'>Фильтр по локации:</Typography>
                                    <Select
                                        value={filterByLocation}
                                        onSelect={value => setFilterByLocation(value)}
                                        className="orders-page-filter-by-status"
                                        options={[{ value: "default", label: "Все локации" }, ...locations]}
                                    />
                                </div> */}
                            </div>
                            <Table
                                columns={columns}
                                dataSource={
                                    orders
                                        .filter(order => filterByStatus === "all" ? true : order?.order_info?.status === filterByStatus ? true : false)
                                        // .filter(order => filterByLocation === "default" ? true : order?.data?.route.find(r => r.fullname === filterByLocation) ? true : false)
                                        .sort((a, b) => statuses.map(status => status.value).indexOf(a.order_info.status) - statuses.map(status => status.value).indexOf(b.order_info.status))
                                        .map((order) => ({
                                            ...order,
                                            onWatch: () => setWatchOrder(handleGetOrderStatus(order)),
                                        }))
                                }
                                response
                                className='order-table'
                                pagination={false}
                                responsive
                                locale={{ emptyText: "Пусто" }}
                            />
                            <div className='orders-history-table-footer'>
                                <Button
                                    icon={<LeftOutlined />}
                                    className="orders-history-pagination"
                                    type="primary"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(currentPage === 1 ? 1 : currentPage - 1)}
                                    loading={loading}
                                />
                                <Button
                                    icon={<RightOutlined />}
                                    className="orders-history-pagination"
                                    type="primary"
                                    disabled={isLastPage}
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    loading={loading}
                                />
                            </div>
                        </div>

                    </div>
                </main>
            </div>
            <WatchModal
                watchOrder={watchOrder}
                onClose={() => setWatchOrder(null)}
            />
        </div>
    )

}