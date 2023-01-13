import React from "react";
import { Modal, Tag, Form, Button, Input, Select } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

const { Option } = Select;

export const EditOrder = ({ editOrder, onClose, onSave, form, saving }) => {
    return (
        <Modal
            title={<div className='modal-title'>Редактирование заказа</div>}
            open={!!editOrder}
            onCancel={onClose}
            footer={null}
            destroyOnClose
        >
            <Form
                form={form}
                name="control-hooks"
                onFinish={onSave}
                initialValues={{
                    driver: editOrder?.data?.driver?.lat ?? "",
                    passenger_count: editOrder?.data?.passenger_count ?? "",
                    phone_number: editOrder?.data?.phone_number ?? "",
                    price: editOrder?.data?.price ?? "",
                    status: editOrder?.data?.status ?? "",
                    shareTrip: editOrder?.data?.shareTrip ?? "0",
                }}
            >
                <div className="modal-label">Водитель</div>
                <Form.Item name="driver">
                    <Input />
                </Form.Item>
                <div className="modal-label">Номер телефона</div>
                <Form.Item name="phone_number"  >
                    <Input />
                </Form.Item>
                <div className="modal-inputs-group">
                    <div>
                        <div className="modal-label">К-во пассажиров</div>
                        <Form.Item name="passenger_count" >
                            <Input />
                        </Form.Item>
                    </div>
                    <div>
                        <div className="modal-label">Цена</div>
                        <Form.Item name="price">
                            <Input />
                        </Form.Item>
                    </div>
                </div>
                <p className='d-flex'>
                    <b>Маршрут:</b>
                    <div className='order-routes'>
                        {
                            editOrder?.data?.route?.length > 0 &&
                            editOrder?.data?.route?.map((route, i) => (
                                <>
                                    <Tag>{route?.fullname}</Tag>
                                    {
                                        (i + 1) !== editOrder?.data?.route?.length &&
                                        <ArrowRightOutlined size={10} className="order-route-arrow" />
                                    }
                                </>
                            ))
                        }
                    </div>
                </p>
                <div className="modal-inputs-group">
                    <div>
                        <div className="modal-label">Статус</div>
                        <Form.Item name="status" >
                            <Select >
                                <Option value="accept">accept</Option>
                                <Option value="decline">decline</Option>
                                <Option value="wait">wait</Option>
                                <Option value="cancel-by-user">cancel-by-user</Option>
                                <Option value="expired">expired</Option>

                            </Select>
                        </Form.Item>
                    </div>
                    <div>
                        <div className="modal-label">Совместное путешествие</div>
                        <Form.Item name="shareTrip" >
                            <Select >
                                <Option value="1">Еcть</Option>
                                <Option value="0">Нету</Option>
                            </Select>
                        </Form.Item>
                    </div>
                </div>
                <div className='edit-order-btns'>
                    <Button type="primary" htmlType="submit" loading={saving}>
                        Сохранить
                    </Button>
                    <Button
                        type="primary"
                        onClick={onClose}
                        danger
                        disabled={saving}
                    >
                        Отменить
                    </Button>
                </div>
            </Form>
        </Modal>
    )
}