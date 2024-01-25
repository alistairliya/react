
import { useAuth } from "../hooks/useAuth";

import {useState, useEffect} from 'react'
import Notification from './Notification'
import {ROOT_URL} from '../constants'
const Notifications = () => {

    const { user } = useAuth(null);
    const [notifications, setNotifications] = useState()

    useEffect(()=>{
        
        // retrieve notifiations for the user from the backend
        //const notifications = await fetchNotifications()
        // curl -X GET http://127.0.0.1:8000/api/usernotification/  -H 'Authorization: Token 9af7ed53fa7a0356998896d8224e67e65c8650a3'
        const fetchNotifications = async()=>{
            const notificationsResults = await fetchObject(ROOT_URL+'/api/usernotification/')
            const notifications = notificationsResults['results']
            await setNotifications(notifications)
            setNotifications(notifications)
        }
        if(!notifications)
        fetchNotifications()
    }, [])

    const fetchObject = async (url) =>{
        let headers = new Headers()
        const token = user['token']
        const auth_str = 'Token '+token
        headers.set('Authorization', auth_str)
        const res = await fetch(url,{headers:headers})
        const data = await res.json()
        return data
    }
    return (
    <div>
        <h1>Notifications</h1>
        <table>
        {
            notifications && notifications.map(
                (userNotification) => {
                    return <Notification key = {userNotification.id} userNotification = {userNotification} />
            })
        }
        </table>
    </div>
  )
}

export default Notifications