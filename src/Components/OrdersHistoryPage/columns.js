import Button from "antd/es/button";
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import { handleAddZero } from "./date";

export const columns = [
    {
        title: 'Время',
        dataIndex: 'Время',
        className: "time-col",
        render: (_, { order_info }) => {
            if (!order_info?.created_at) {
                return null
            } else {
                const date = new Date(order_info?.created_at)
                const hours = date.getHours();
                const minutes = date.getMinutes();

                return `${handleAddZero(hours)}:${handleAddZero(minutes)}`
            }
        }
    },
    {
        title: 'Откуда',
        dataIndex: 'Откуда',
        render: (_, { route }) => {
            return (
                <div className="table-address">
                    <span>{route[0]?.short_text ?? ""}</span>
                </div>
            )
        }
    },
    {
        title: 'Куда',
        dataIndex: 'Куда',
        render: (_, { route }) => {
            return (
                <div className="table-address">
                    <span>{route[route?.length - 1]?.short_text ?? ""}</span>
                </div>
            )
        }
    },
    {
        title: 'Цена',
        dataIndex: 'Цена',
        render: (_, { order_info }) => order_info?.price ?? ""
    },
    {
        title: 'Статус',
        dataIndex: 'Статус',
        render: (_, { order_info }) => {
            const statuses = [
                { title: "Поиск авто", value: "search_car", color: "#e0da22" },
                { title: "Авто назначена", value: "assigned", color: "#22e0e0" },
                { title: "Авто прибыла", value: "arrived", color: "#224ee0" },
                { title: "Авто не найдена", value: "expired", color: "#e07b22" },
                { title: "Завершен", value: "completed", color: "#22e045" },
                { title: "Отменено водителем", value: "cancel_by_driver", color: "#e0223f" },
                { title: <>Отменено <br /> пользователем</>, value: "cancel_by_user", color: "#e022b4" },
            ];
            const activeStatus = statuses.find(status => order_info.status === status.value);

            if (!activeStatus) {
                return null;
            }

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
        title: '',
        dataIndex: 'Действия',
        className: "actions-col-history",
        render: (_, { onWatch }) => {
            return (
                <div className='order-action-btns'>
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