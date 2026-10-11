import React, { useEffect, useState } from "react";
import NotificationService from "../services/NotificationService";
import "./Notifications.css";

function Notifications() {

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            const response = await NotificationService.getNotifications();
            setNotifications(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const markAsRead = async (id) => {
        await NotificationService.markAsRead(id);
        loadNotifications();
    };

    const deleteNotification = async (id) => {
        await NotificationService.deleteNotification(id);
        loadNotifications();
    };

    return (
        <div className="notifications-page">

            <h1>🔔 Notifications</h1>

            {notifications.length === 0 ? (
                <h3>No Notifications Available</h3>
            ) : (
                notifications.map((notification) => (

                    <div
                        key={notification.id}
                        className={
                            notification.readStatus
                                ? "notification-card read"
                                : "notification-card unread"
                        }
                    >

                        <h3>{notification.title}</h3>

                        <p>{notification.message}</p>

                        <small>
                            {notification.createdAt}
                        </small>

                        <br /><br />

                        {!notification.readStatus && (
                            <button
                                onClick={() =>
                                    markAsRead(notification.id)
                                }
                            >
                                Mark as Read
                            </button>
                        )}

                        <button
                            onClick={() =>
                                deleteNotification(notification.id)
                            }
                        >
                            Delete
                        </button>

                    </div>

                ))
            )}

        </div>
    );
}

export default Notifications;