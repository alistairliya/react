
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
            console.log('>>>>>>>>>>>>>>>> 2222222222222222222222222222222222  useEffect in BusinessDetailsAdvisors')
            setMyBusiness(business)
            console.log(business)

            if(!addedExistingAdvisor && business.related_users && business.related_users.length > 0){
                console.log("2222222222222 LOADING ADVISORS??????")
                setAddedExistingAdvisor(true)
                let myKey = 10000
                let myAdvisors = {}
                business.related_users.forEach((user)=>{
                    myKey += 1
                    console.log('#$#$#$#$#$#$#$#$#$#b adding collaborator')
                    console.log(user)
                    //addAdvisor(user, myKey)
                    myAdvisors[myKey] = user
                })
                setAdvisors(myAdvisors)
                console.log('AFTER ADDING COLLABORATORS !!!!!!!!!!!!!!')
                console.log(advisors)
            }else{
                console.log("2222222222222 NOT LOADING ADVISORS??????")
            }
            
            const fetchResource = async(resource)=>{
                let headers = new Headers()
                const token = user['token']
                const auth_str = 'Token '+token
                console.log(auth_str)
                headers.set('Authorization', auth_str)
                const res = await fetch(ROOT_URL+'/api/'+resource+'/', {headers:headers})
                const data = await res.json()
                return data
            }
            if(users.length === 0 && roles.length === 0 && collaboratorStatuses.length === 0){
                const getUsers = async ()=>{
                    const theUsers = await fetchResource('users')
                    setUsers(theUsers)
                }
                const getRoles = async ()=>{
                    const theRoles = await fetchResource('businessuserrole')
                    setRoles(theRoles)
                }
                const getCollaboratorStatuses = async ()=>{
                    const theCollaboratorStatuses = await fetchResource('collaboratorstatus')
                    setCollaboratorStatuses(theCollaboratorStatuses)
                }
                const getCollaboratorPosition = async ()=>{
                    const theCollaboratorPositions = await fetchResource('collaboratorposition')
                    setCollaboratorPositions(theCollaboratorPositions)
                }
                getUsers()
                getRoles()
                getCollaboratorStatuses()
                getCollaboratorPosition()
            }
            //console.log('users:')
            //console.log(users)
            console.log('advisors:')
            console.log(advisors)
            //console.log('collaboratorStatuses')
            //console.log(collaboratorStatuses)
            //console.log('collaboratorPositions')
            //console.log(collaboratorPositions)
            if(editMode){
                console.log('EDIT MODE')
                setBackgroundColor('lightblue')
                collectPayload('collaborators', advisors)
            }
            console.log('222222222222222222222222222 ADVISORS.......')
            console.log(advisors)
        //},[editMode, users, roles, /*advisors,*/ collaboratorStatuses, collaboratorPositions, update, myBusiness]
        },[editMode, users, roles, advisors, collaboratorStatuses, collaboratorPositions, update, myBusiness]
    )    

    const addAdvisor = (advisor, myKey)=>{
        console.log('++++++++++++++..... addAdvisor...')
        console.log(advisor)
        if(!advisor)
            advisor = {}
        if(!myKey)
            myKey = key
        console.log('myKey: '+myKey.toString())
        console.log(advisor)
        setAdvisors({...advisors, [myKey]:advisor })
        console.log('after setAdvisors')
        //setKey((prev) => prev + 1)
        setKey(myKey + 1)
    }

    // returns a function that removes the advisor
    // Used by JSX below to create a function for each remove button
    const removevAdvisor = (key)=>{
        console.log('removevAdvisor building function for key: '+key.toString())
        return ()=>{
            const newAdvisors = {...advisors}
            delete newAdvisors[key]
            setAdvisors(newAdvisors)
            setEditMode(true)
        }
    }

    const updateAdvisor = (key, value)=>{
        console.log('updateAdvisor')
        console.log(key)
        console.log(value)
        const newAdvisors = {...advisors}
        newAdvisors[key] = value
        setAdvisors(newAdvisors)
        setEditMode(true)
        console.log(newAdvisors)
        console.log(advisors)
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