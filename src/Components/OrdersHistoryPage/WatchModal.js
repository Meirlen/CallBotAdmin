import React, { useState } from "react";
import { ArrowRightOutlined, UserOutlined, LoadingOutlined } from '@ant-design/icons';
import { Modal, Tag, Popover, Avatar, Badge } from 'antd';
import axios from "axios";


export const WatchModal = ({ watchOrder, onClose }) => {
    const [driver, setDriver] = useState(null);

    const handleGetDriverById = async () => {
        const driverId = watchOrder?.data.driver_id;
        if (driverId) {
            const response = await axios.post('http://165.22.13.172:8000/mobile/driver_by_id',
                { "driver_id": driverId },
                { headers: { 'Content-Type': 'application/json' } }
            );

            const responseDriver = response?.data["driver:"][0];

            if (!driver && responseDriver) {
                setDriver(responseDriver);
            }
        }
    }

    const handleShowDriver = () => {
        handleGetDriverById();
    }

    const handleCloseModal = () => {
        setDriver(null);
        onClose();
    }

    return (
        <Modal
            title={<div className='modal-title'>О заказе</div>}
            open={!!watchOrder}
            onCancel={handleCloseModal}
            footer={null}
        >
            <p><b>Водитель:</b> {watchOrder?.data.driver?.lat ?? " -"}</p>
            <p >
                {
                    watchOrder?.data.driver_id &&
                    <Popover
                        content={(
                            <div className="d-flex flex-column align-items-center">
                                <>
                                    {
                                        driver
                                            ? <>
                                                <Badge dot={driver?.is_online === 1} status="success" style={{ height: 10, width: 10 }}>
                                                    <Avatar
                                                        shape="square"
                                                        size="large"
                                                        icon={<UserOutlined />}
                                                    />
                                                </Badge>
                                                <div><b>Имя:</b> {driver?.driver_name ?? "-"} </div>
                                                <div><b>Авто:</b> {driver?.car_info ?? "-"} </div>
                                            </>
                                            : <LoadingOutlined />
                                    }
                                </>
                            </div>
                        )}
                        className="cursor-pointer"
                        trigger="hover"
                        onOpenChange={handleShowDriver}
                    >
                        <b>ID водителя:</b> {watchOrder?.data.driver_id ?? " -"}
                    </Popover>
                }
            </p>
            <p><b>Номер:</b> {watchOrder?.data?.order_id ?? " -"}</p>
            <p><b>К-во пассажиров:</b> {watchOrder?.data?.passenger_count ?? " -"}</p>
            <p><b>Номер телефона:</b> {watchOrder?.data?.phone_number ?? " -"}</p>
            <p><b>Цена:</b> {watchOrder?.data?.price ?? " -"}</p>
            <p className='d-flex'>
                <b>Маршрут:</b>
                <div className='order-routes'>
                    {
                        watchOrder?.data?.route?.length > 0 &&
                        watchOrder?.data?.route?.map((route, i) => (
                            <>
                                <Tag>{route?.fullname}</Tag>
                                {
                                    (i + 1) !== watchOrder?.data?.route?.length &&
                                    <ArrowRightOutlined size={10} className="order-route-arrow" />
                                }
                            </>
                        ))
                    }
                </div>
            </p>
            <p><b>Статус:</b> {watchOrder?.data?.status ?? " -"}</p>
            <p><b>Совместное путешествие:</b> {watchOrder?.data?.shareTrip === "1" ? "Есть" : "Нету"}</p>
        </Modal>
    )
}