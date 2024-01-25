// Advisors Information
// Get users
// Implement roles
// Get roles
// Component to add users/roles

import {useState, useEffect} from 'react'
import {useAuth} from '../hooks/useAuth'
import NBF8Advisor from './NBF8Advisor'
import Button from './Button'
import {ROOT_URL} from '../constants'

const NBF8 = ({onNextClicked, setCollaborators}) => {
    const {user} = useAuth()
    const [users, setUsers] = useState([])
    const [roles, setRoles] = useState([])
    const [advisors, setAdvisors] = useState({})
    const [collaboratorStatuses, setCollaboratorStatuses] = useState([])
    const [collaboratorPositions, setCollaboratorPositions] = useState([])
    const [key, setKey] = useState(0)

    useEffect(
        ()=>{
            console.log('))))))))))))))))))))))))) . useEffect in NBF8 (((((((((((((((')
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
            console.log('))))))))))))))))))))))))) NBF8 gets stuffs (((((((((((((((')
                const getUsers = async ()=>{
                    const theUsersResults = await fetchResource('users')
                    const theUsers = theUsersResults['results']
                    setUsers(theUsers)
                }
                const getRoles = async ()=>{
                    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>> G E T . R O L E S <<<<<<<<<<<<<<<<<<<<<<<<<<')
                    const theRolesResults = await fetchResource('businessuserrole')
                    const theRoles = theRolesResults['results']
                    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>> R O L E S <<<<<<<<<<<<<<<<<<<<<<<<<<')
                    console.log(theRoles)
                    setRoles(theRoles)
                }
                const getCollaboratorStatuses = async ()=>{
                    const theCollaboratorStatusesResults = await fetchResource('collaboratorstatus')
                    const theCollaboratorStatuses = theCollaboratorStatusesResults['results']
                    setCollaboratorStatuses(theCollaboratorStatuses)
                }
                const getCollaboratorPositiono = async ()=>{
                    const theCollaboratorPositionsResults = await fetchResource('collaboratorposition')
                    const theCollaboratorPositions = theCollaboratorPositionsResults['results'] 
                    setCollaboratorPositions(theCollaboratorPositions)
                }
                getUsers()
                getRoles()
                getCollaboratorStatuses()
                getCollaboratorPositiono()
            }
            console.log('users:')
            console.log(users)
            console.log('advisors:')
            console.log(advisors)
            console.log('collaboratorStatuses')
            console.log(collaboratorStatuses)
            console.log('collaboratorPositions')
            console.log(collaboratorPositions)
        },[users, roles, advisors, collaboratorStatuses, collaboratorPositions]
    )    

    const addAdvisor = ()=>{
        setAdvisors({...advisors, [key]:{} })
        setKey(key+1)
    }

    // returns a function that removes the advisor
    // Used by JSX below to create a function for each remove button
    const removevAdvisor = (key)=>{
        console.log('removevAdvisor building function for key: '+key.toString())
        return ()=>{
            const newAdvisors = {...advisors}
            delete newAdvisors[key]
            setAdvisors(newAdvisors)
        }
    }

    const updateAdvisor = (key, value)=>{
        console.log('updateAdvisor')
        console.log(key)
        console.log(value)
        const newAdvisors = {...advisors}
        newAdvisors[key] = value
        setAdvisors(newAdvisors)
    }

    const onSubmit = (e) =>{
        e.preventDefault()
        console.log('NBF8 Next pressed')
        console.log(advisors)
        setCollaborators(advisors)
        onNextClicked()
    }

    return (
        <div>
            <h2>New Business Form: Advisor Information</h2>
            {Object.keys(advisors).map((key, index)=>{
                //return <NBF8Advisor key={index} />
                //return (<div className='container'><NBF8Advisor key={key}  id={key} users={users} roles={roles} updateAdvisor = {updateAdvisor} selectedAdvisors = {advisors} collaboratorStatuses = {collaboratorStatuses} collaboratorPositions ={collaboratorPositions} /> <Button text='Remove' onClick={removevAdvisor(key)} /></div>)
                return (<div className='container'>HI</div>)
            })}
            <Button 
                text='Add Advisor' 
                color='red' 
                onClick={addAdvisor} 
            />
            <form className="add-form" onSubmit={onSubmit}>
                <input type='submit' value='Next' className='btn btn-block' />
            </form>
        </div>
    )
}

export default NBF8