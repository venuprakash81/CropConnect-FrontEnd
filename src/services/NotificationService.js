import axios from "axios";

const BASE_URL = "http://localhost:8081/notification";

const NotificationService = {

    getNotifications() {
        return axios.get(BASE_URL + "/all");
    },

    saveNotification(notification) {
        return axios.post(BASE_URL + "/save", notification);
    },

    markAsRead(id) {
        return axios.put(BASE_URL + "/read/" + id);
    },

    deleteNotification(id) {
        return axios.delete(BASE_URL + "/delete/" + id);
    }

};

export default NotificationService;