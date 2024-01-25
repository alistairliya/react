
import {useState, useEffect} from 'react'
import {useAuth} from '../hooks/useAuth'
import NBF8Advisor from './NBF8Advisor'
import Button from './Button'
import {ROOT_URL} from '../constants'
const BusinessDetailsAdvisors = ({collectPayload, business, writeAccess, update}) => {
    const {user} = useAuth()

    const [users, setUsers] = useState([]) // all the users of the system 
    const [roles, setRoles] = useState([])
    const [advisors, setAdvisors] = useState({})
    const [collaboratorStatuses, setCollaboratorStatuses] = useState([])
    const [collaboratorPositions, setCollaboratorPositions] = useState([])
    const [key, setKey] = useState(0)
    const [editMode, setEditMode] = useState(false)
    const [backgroundColor, setBackgroundColor] = useState('white');
    const [addedExistingAdvisor, setAddedExistingAdvisor] = useState(false)
    const [myBusiness, setMyBusiness] = useState() // we are not using this var for anything other than forcing an update of this component by its child. //https://github.com/alistairliya/react/issues/3
    useEffect(
        ()=>{
            setMyBusiness(business)

            if(!addedExistingAdvisor && business.related_users && business.related_users.length > 0){
                setAddedExistingAdvisor(true)
                let myKey = 10000
                let myAdvisors = {}
                business.related_users.forEach((user)=>{
                    myKey += 1
                    //addAdvisor(user, myKey)
                    myAdvisors[myKey] = user
                })
                setAdvisors(myAdvisors)
            }else{
            }
            
            const fetchResource = async(resource)=>{
                let headers = new Headers()
                const token = user['token']
                const auth_str = 'Token '+token
                headers.set('Authorization', auth_str)
                const res = await fetch(ROOT_URL+'/api/'+resource+'/', {headers:headers})
                const data = await res.json()
                return data
            }
            if(users.length === 0 && roles.length === 0 && collaboratorStatuses.length === 0){
                const getUsers = async ()=>{
                    const theUsers = await fetchResource('users')
                    setUsers(theUsers['results'])
                }
                const getRoles = async ()=>{
                    const theRoles = await fetchResource('businessuserrole')
                    setRoles(theRoles['results'])
                }
                const getCollaboratorStatuses = async ()=>{
                    const theCollaboratorStatuses = await fetchResource('collaboratorstatus')
                    setCollaboratorStatuses(theCollaboratorStatuses['results'])
                }
                const getCollaboratorPosition = async ()=>{
                    const theCollaboratorPositions = await fetchResource('collaboratorposition')
                    setCollaboratorPositions(theCollaboratorPositions['results'])
                }
                getUsers()
                getRoles()
                getCollaboratorStatuses()
                getCollaboratorPosition()
            }
            if(editMode){
                setBackgroundColor('lightblue')
                collectPayload('collaborators', advisors)
            }
        //},[editMode, users, roles, /*advisors,*/ collaboratorStatuses, collaboratorPositions, update, myBusiness]
        },[editMode, users, roles, advisors, collaboratorStatuses, collaboratorPositions, update, myBusiness]
    )    

    const addAdvisor = (advisor, myKey)=>{
        if(!advisor)
            advisor = {}
        if(!myKey)
            myKey = key
        setAdvisors({...advisors, [myKey]:advisor })
        //setKey((prev) => prev + 1)
        setKey(myKey + 1)
    }

    // returns a function that removes the advisor
    // Used by JSX below to create a function for each remove button
    const removevAdvisor = (key)=>{
        return ()=>{
            const newAdvisors = {...advisors}
            delete newAdvisors[key]
            setAdvisors(newAdvisors)
            setEditMode(true)
        }
    }

    const updateAdvisor = (key, value)=>{
        const newAdvisors = {...advisors}
        newAdvisors[key] = value
        setAdvisors(newAdvisors)
        setEditMode(true)
    }

    const forceUpdate = () =>{
        setMyBusiness(business)
    }


    return (
        <div className="container">
            <h2>New Business Form: Advisor Information</h2>
            <p>
                {
                    //(new Date).getSeconds()
                    //JSON.stringify(business)
                }
            </p>
            <p>
                {
                    //(new Date).getSeconds()
                    //JSON.stringify(myBusiness)
                }
            </p>
            {
            
            Object.keys(advisors).map((key, index)=>{
                //return <NBF8Advisor key={index} />
                return (
                    <div key= {key} className='container'>
                        <NBF8Advisor 
                            id={key}
                            users={users} 
                            roles={roles} 
                            updateAdvisor = {updateAdvisor} 
                            selectedAdvisors = {advisors} 
                            collaboratorStatuses = {collaboratorStatuses} 
                            collaboratorPositions ={collaboratorPositions}
                            force = {forceUpdate}
                            writeAccess = {writeAccess} /> 
                        <Button 
                            text='Remove' 
                            onClick={removevAdvisor(key)} 
                            disabled={!writeAccess}
                            />
                    </div>
                )
            })
            
            }
            <Button 
                text='Add Advisor' 
                color='red' 
                onClick={addAdvisor} 
                disabled={!writeAccess}
            />
        </div>
    )
}

export default BusinessDetailsAdvisors