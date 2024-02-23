
import {useState, useEffect} from 'react'
import {useAuth} from '../hooks/useAuth'
import NBF8Advisor from './NBF8Advisor'
import Button from './Button'
import {ROOT_URL} from '../constants'
import MUIDataTable from "mui-datatables" // https://github.com/gregnb/mui-datatables
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
    
    const [collaboratorTable, setCollaboratorTable] = useState([])
    const [collaboratorColumns, ] = useState(["Last Name","First Name","User Name"])
    const [flag, setFlag] = useState(false)

    /*
    State variable "advisors" store the collaborators. The data structure looks like:
    {
        "10001": {
            "id": 191,
            "business": "http://localhost:8000/api/mybusiness/345/",
            "user": "http://localhost:8000/api/users/24/",
            "split": 10,
            "user_role": "http://localhost:8000/api/businessuserrole/1/",
            "notes": null,
            "created_by": "http://localhost:8000/api/users/1/",
            "created_date": "2023-12-22T18:15:05.419037Z",
            "modified_date": "2023-12-22T18:19:57.174954Z",
            "collaborator_status": "http://localhost:8000/api/collaboratorstatus/1/",
            "collaborator_position": "http://localhost:8000/api/collaboratorposition/1/",
            "cfc_code": ""
        },
        "10002": {
            "id": 192,
            "business": "http://localhost:8000/api/mybusiness/345/",
            "user": "http://localhost:8000/api/users/22/",
            "split": 2,
            "user_role": "http://localhost:8000/api/businessuserrole/3/",
            "notes": null,
            "created_by": "http://localhost:8000/api/users/1/",
            "created_date": "2023-12-22T18:15:05.439133Z",
            "modified_date": "2023-12-22T18:15:05.439183Z",
            "collaborator_status": "http://localhost:8000/api/collaboratorstatus/2/",
            "collaborator_position": "http://localhost:8000/api/collaboratorposition/2/",
            "cfc_code": "2"
        }
    }
    */
   
    
    const fetchResource = async(resourceURL)=>{
        let headers = new Headers()
        const token = user['token']
        const auth_str = 'Token '+token
        headers.set('Authorization', auth_str)
        const res = await fetch(resourceURL, {headers:headers})
        const data = await res.json()
        return data
    }

    const popoulateCollaboratorTable = async(collaborators)=>{
        console.log('       populateCollaboratorTable')
        let table = []
        // cannot use forEach: https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
        for(const k in collaborators){
            let row = []
            let collaborator = collaborators[k]
            //console.log("Inside populateCollaboratorTable for loop:")
            //console.log(k)
            // get user
            let theUser = await fetchResource(collaborator.user)
            row.push(theUser.first_name)
            row.push(theUser.last_name)
            row.push(theUser.username)
            // get user role
            let   theRole = await fetchResource(collaborator.user_role)
            // get collaborator status
            let theStatus = await fetchResource(collaborator.collaborator_status)
            // get collaborator position
            let thePosition = await fetchResource(collaborator.collaborator_position)

            //console.log("User: \n"+JSON.stringify(theUser) +"\nRole:\n "+JSON.stringify(theRole)+
            //    "\nStatus:\n "+JSON.stringify(theStatus)+"\nPosition:\n "+JSON.stringify(thePosition))
            table.push(row)
        }
        console.log(table)
        setCollaboratorTable(table)
    }

    useEffect(
        ()=>{
            console.log("   BusinessDetailsAdvisors.js useEffect->")
            setMyBusiness(business)

            if(!addedExistingAdvisor && business.related_users && business.related_users.length > 0){
                let table = []
                setAddedExistingAdvisor(true)
                let myKey = 10000
                let myAdvisors = {}
                business.related_users.forEach((user)=>{
                    myKey += 1
                    //addAdvisor(user, myKey)
                    myAdvisors[myKey] = user
                    //table.push([user.first_name, user.last_name])
                })
                setAdvisors(myAdvisors) // state variable "advisors" are set to myAdvisors
                
                // a. go thru "advisors" and populate "table"
                // This is the advisors to be put in MUITable
                if(!flag){
                    setFlag(true)
                    popoulateCollaboratorTable(myAdvisors)
                }
                setCollaboratorTable(table)
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
        },[editMode, users, roles, advisors, collaboratorStatuses, collaboratorPositions, update, myBusiness, business]    
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
            // Replace the following with MUITable
            // "advisors" are the collaborators already assigned
            /*
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
            }) */
            <MUIDataTable
                title={"Employee List"}
                data={collaboratorTable}
                columns={collaboratorColumns}
                options={{
                    filterType: 'checkbox',
                  }}
            />
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