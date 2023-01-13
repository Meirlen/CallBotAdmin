import Button from "antd/es/button";
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Tag } from 'antd';

const handleAddZero = (number) => number >= 10 ? number : `0${number}`;

export const columns = [
    {
        title: 'Время',
        dataIndex: 'Время',
        className: "time-col",
        render: (_, { data }) => {
            if (!data?.createdAt) {
                return null
            } else {
                const date = new Date(data?.createdAt)
                const hours = date.getHours();
                const minutes = date.getMinutes();

                return `${handleAddZero(hours)}:${handleAddZero(minutes)}`
            }
        }
    },
    {
        title: 'Откуда',
        dataIndex: 'Откуда',
        render: (_, { data }) => {
            return (
                <div className="table-address">
                    <span>{data?.route[0]?.short_text ?? ""}</span>
                </div>
            )
        }
    },
    {
        title: 'Куда',
        dataIndex: 'Куда',
        render: (_, { data }) => {
            return (
                <div className="table-address">
                    <span>{data?.route[data?.route?.length - 1]?.short_text ?? ""}</span>
                </div>
            )
        }
    },
    {
        title: 'Цена',
        dataIndex: 'Цена',
        render: (_, { data }) => data?.price ?? ""
    },
    {
        title: 'Статус',
        dataIndex: 'Статус',
        render: (_, { data }) => {
            const statuses = [
                { title: "Поиск авто", value: "search_car", color: "#e0da22" },
                { title: "Авто назначена", value: "assigned", color: "#22e0e0" },
                { title: "Авто прибыла", value: "arrived", color: "#224ee0" },
                { title: "Авто не найдена", value: "expired", color: "#e07b22" },
                { title: "Завершен", value: "completed", color: "#22e045" },
                { title: "Отменено водителем", value: "cancel_by_driver", color: "#e0223f" },
                { title: <>Отменено <br /> пользователем</>, value: "cancel_by_user", color: "#e022b4" },
            ];
            const activeStatus = statuses.find(status => data.status === status.value);

            return (
                <Tag
                    color={activeStatus.color}
                    style={{ textAlign: "center", width: 110 }}
                >
                    {activeStatus?.title}
                </Tag>
            )
        }
    },
    {
        title: 'Действия',
        dataIndex: 'Действия',
        className: "actions-col",
        render: (_, { onEdit, onWatch }) => {
            return (
                <div className='order-action-btns'>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        className="order-action-btn"
                        onClick={onEdit}
                    />
                    <Button
                        icon={<EyeOutlined />}
                        className="order-action-btn"
                        onClick={onWatch}
                    />
                </div>
            )
        }
    },
];