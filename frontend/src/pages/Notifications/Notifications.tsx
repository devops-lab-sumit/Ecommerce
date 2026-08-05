import { useEffect, useState } from "react";

import PageHeader from "../../components/common/PageHeader";

import * as notificationService from "../../services/notificationService";

import type { Notification } from "../../models/notification";

function Notifications() {

    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {

        loadNotifications();

    }, []);

    async function loadNotifications() {

        const data = await notificationService.getNotifications();

        setNotifications(data);

    }

    return (

        <>

            <PageHeader

                title="Notifications"

                subtitle="Email Notification History"

            />

            <div className="card shadow-sm">

                <table className="table table-hover">

                    <thead>

                        <tr>

                            <th>Customer</th>

                            <th>Email</th>

                            <th>Subject</th>

                            <th>Message</th>

                            <th>Sent</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            notifications.map(notification => (

                                <tr key={notification.id}>

                                    <td>{notification.customerName}</td>

                                    <td>{notification.email}</td>

                                    <td>{notification.subject}</td>

                                    <td>{notification.message}</td>

                                    <td>{notification.sentAt}</td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </>

    );

}

export default Notifications;