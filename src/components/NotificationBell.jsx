import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import NotificationService from "../services/NotificationService";
import "./Notification.css";

function NotificationBell() {

    const [notifications, setNotifications] = useState([]);
    const [showBox, setShowBox] = useState(false);

    useEffect(() => {

        loadNotifications();

        const interval = setInterval(() => {
            loadNotifications();
        }, 10000);

        return () => clearInterval(interval);

    }, []);

    const loadNotifications = async () => {

        try {

            const response = await NotificationService.getNotifications();

            setNotifications(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    const unreadCount =
        notifications.filter(n => !n.readStatus).length;

    return (

        <div className="notification-wrapper">

            <div
                className="bell"
                onClick={() => setShowBox(!showBox)}
            >

                <FaBell />

                {unreadCount > 0 && (

                    <span className="notification-count">
                        {unreadCount}
                    </span>

                )}

            </div>

            {showBox && (

                <div className="notification-box">

                    <h3>Notifications</h3>

                    {notifications.length === 0 ? (

                        <p>No Notifications</p>

                    ) : (

                        notifications.map(notification => (

                            <div
                                key={notification.id}
                                className="notification-item"
                            >

                                <strong>
                                    {notification.title}
                                </strong>

                                <p>
                                    {notification.message}
                                </p>

                            </div>

                        ))

                    )}

                </div>

            )}

        </div>

    );

}

export default NotificationBell;