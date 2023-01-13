import { Button, Modal, Select, Input } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "./create-order.css";
const { TextArea } = Input;

const ADDRESS_INIT = {
    "short_text": "",
    "fullname": "",
    "geo_point": [0, 0],
    "type": "",
    "city": undefined
}

export const CreateOrder = () => {
    const [open, setOpen] = useState(false);
    const [addressFrom, setAddressFrom] = useState(undefined);
    const [addressFromSearch, setAddressFromSearch] = useState([]);
    const [addressTo, setAddressTo] = useState([]);
    const [addressToSearch, setAddressToSearch] = useState([]);
    const [price, setPrice] = useState(undefined);
    const [phone, setPhone] = useState(undefined);
    const [comment, setComment] = useState(undefined);
    const [loading, setLoading] = useState(false);

    const handleCloseModal = () => {
        setAddressFrom(undefined);
        setAddressFromSearch([]);
        setAddressTo([]);
        setAddressToSearch([]);
        setPrice(undefined);
        setPhone(undefined);
        setComment(undefined);
        setLoading(false);
        setOpen(false);
    }

    const handleSearchAddress = async (address, setSearchFunc) => {
        if (address?.length > 0) {
            const response = await axios.get(`http://165.22.13.172:8000/webhook/get_suggest?q=${address}`,
                { headers: { 'Content-Type': 'application/json' } }
            );

            setSearchFunc(response?.data?.results)
        }
    }

    const handleGetLocationData = (location) => {
        const { name = "", type = "", lat = 0, lon = 0 } = JSON.parse(location);
        return ({
            "short_text": name,
            "fullname": name,
            "geo_point": [lat, lon],
            "type": type,
            "city": name
        })
    }

    const handleChangeAddressFrom = (value) => setAddressFrom(value);

    const handleOnAddressFromSearch = (value) => {
        setAddressFrom(undefined);
        handleSearchAddress(value, setAddressFromSearch);
    }

    const handleChangeAddressTo = (value) => value.length <= 3 ? setAddressTo(value) : null;

    const handleSearchAddressTo = (value) => handleSearchAddress(value, setAddressToSearch)

    const handleSubmit = async () => {
        setLoading(true);
        let route = [];
        if (addressFrom) {
            route = [addressFrom, ...addressTo].map(address => handleGetLocationData(address));
        } else {
            route = addressTo.map(address => handleGetLocationData(address));
        }
        const response = await axios.post('http://165.22.13.172:8000/v2/mobile/order/admin',
            {
                "route": route,
                "tariff": "e",
                "comment": comment,
                "price": price,
                "is_share_trip": 0,
                "passenger_count": 1,
                "phone_number": phone
            }
            ,
            { headers: { 'Content-Type': 'application/json' } }
        );

        setLoading(false);

        if (response.status === 201) {
            handleCloseModal();
            toast.success("Заказ успешно создан");
        } else {
            toast.error("Ошибка создания заказа!");
        }
    }


    return (
        <>
            <Modal
                open={open}
                onCancel={handleCloseModal}
                title={<div className='modal-title'>Создание заказа</div>}
                cancelText="Отмена"
                onOk={handleSubmit}
                okButtonProps={{ disabled: !addressFrom || addressTo.length === 0 || !price || loading || !phone || !comment, loading: loading }}
                cancelButtonProps={{ disabled: loading }}
            >
                <div className="modal-label">Откуда:</div>
                <Select
                    showSearch
                    className="create-order-search"
                    placeholder="Введите адрес"
                    optionFilterProp="children"
                    onChange={handleChangeAddressFrom}
                    onSearch={handleOnAddressFromSearch}
                    value={addressFrom}
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={addressFromSearch.map((address, i) => ({ value: JSON.stringify({ ...address, index: i }), label: address.name }))}
                />
                <div className="modal-label">Куда:</div>
                <Select
                    showSearch
                    className="create-order-search"
                    placeholder="Введите адреса"
                    optionFilterProp="children"
                    onChange={handleChangeAddressTo}
                    onSearch={handleSearchAddressTo}
                    value={addressTo}
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    maxTagCount={3}
                    mode="multiple"
                    options={addressToSearch.map((address, i) => ({ value: JSON.stringify({ ...address, index: i }), label: address.name }))}
                />
                <div className="modal-label">Цена:</div>
                <Input
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                />
                <div className="modal-label">Номер телефона:</div>
                <Input
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                />
                <div className="modal-label">Комментарий:</div>
                <TextArea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    style={{ height: 80, resize: 'none' }}
                />
            </Modal>
            <Button
                className="create-order-btn"
                type="primary"
                onClick={() => setOpen(true)}
                loading={loading}
            >
                Cоздать заказ
            </Button>
        </>
    )
}