// for selecting the advisor

import {useState, useEffect} from 'react'
import Select from 'react-select' // https://react-select.com/home
import {useAuth} from '../hooks/useAuth'
import {ROOT_URL} from '../constants'

const NBF8Advisor = ({
    id, // this id was defined by the calling component. It starts from 1000 and increment. Not the ID on the DB.
    users, 
    roles, 
    updateAdvisor, 
    selectedAdvisors, // selectedAdvisors[id] <= if this component should be loaded with a collaborator in the businessuser object (Business_User model)
    collaboratorStatuses, 
    collaboratorPositions, 
    writeAccess
}) => {
    const {user} = useAuth()
    const [role, setRole] = useState()
    const [advisor, setAdvisor] = useState()
    const [collaboratorStatus, setCollaboratorStatus] = useState({})
    const [collaboratorPosition, setCollaboratorPosition] = useState({})
    const [cfcCode, setCfcCode] = useState('')
    const [split, setSplit] = useState(0)
    

    const roleOptions = roles.map(
        (role)=>({
            value:role,
            label: role.user_role_name
        })
    )
    const advisorOptions = users.map(
        (user)=>({
            value:user,
            label: user.first_name.trim()!==''&&user.last_name.trim()!==''?user.first_name+' '+user.last_name: user.username
            
        })
    )

    const collaboratorStatusOptions = collaboratorStatuses.map(
        (collaboratorStatus)=>({
            value:collaboratorStatus,
            label: collaboratorStatus.status_name
        })
    )

    const collaboratorPositionOptions = collaboratorPositions.map(
        (collaboratorPosition)=>({
            value:collaboratorPosition,
            label: collaboratorPosition.position_name
        })
    )

    const fetchResource = async(resourceURL)=>{
        let headers = new Headers()
        const token = user['token']
        const auth_str = 'Token '+token
        console.log(auth_str)
        headers.set('Authorization', auth_str)
        const res = await fetch(resourceURL, {headers:headers})
        const data = await res.json()
        return data
    }

    useEffect(()=>{
        console.log('>>>>>>>>>>>>>>>>>>>> useEffect for NBF8Advisor ID: '+id)
        console.log('selectedAdvisors:')
        console.log(selectedAdvisors)
        if(selectedAdvisors[id]){
            console.log('selectedAdvisors[id]')
            console.log(selectedAdvisors[id])
            if(selectedAdvisors[id].user_role && !role ){
                console.log(selectedAdvisors[id].user_role)
                const getRole = async()=>{
                    const theRole = await fetchResource(selectedAdvisors[id].user_role)
                    await setRole(theRole)
                    console.log("<<<<<<<<<<<<<<< ROLE <<<<<<<<<<<<<<<")
                    console.log(role)
                }
                getRole()
            } 
            if(selectedAdvisors[id].user  && !advisor){ // <- Start from here, eg: "user": "http://localhost:8000/api/users/21/"
                const getAdvisor = async ()=>{
                    const theUser = await fetchResource(selectedAdvisors[id].user)
                    await setAdvisor(theUser)
                    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Loaded Advisor")
                    console.log(JSON.stringify(theUser))
                }
                //console.log('selectedAdvisors[id].advisor')
                //console.log(selectedAdvisors[id].advisor)
                //setAdvisor(selectedAdvisors[id].advisor)
                getAdvisor()
            }
            if(selectedAdvisors[id].collaboratorStatus){
                console.log('selectedAdvisors[id].collaboratorStatus')
                console.log(selectedAdvisors[id].collaboratorStatus)
                setCollaboratorStatus(selectedAdvisors[id].collaboratorStatus)
            }
            if(selectedAdvisors[id].collaborator_position){
                console.log('selectedAdvisors[id].collaborator_position')
                console.log(selectedAdvisors[id].collaborator_position)
                //setCollaboratorPosition(selectedAdvisors[id].collaboratorPosition)
                const getPos = async () => {
                    const thePos = await fetchResource(selectedAdvisors[id].collaborator_position)
                    await setCollaboratorPosition(thePos)
                }
                getPos()
            }
        }
        ///console.log(selectedAdvisors)
        //console.log(roleOptions)
        console.log('useEffect, updated role and advisor:')
        console.log(role)
        console.log(advisor)
    })
  
    return (
        <div>
            <p>{id}</p>
            <p>{
                JSON.stringify(selectedAdvisors[id]) 
            }</p>
            <p>
                {
                    JSON.stringify(collaboratorPosition)
                }
            </p>
            <div className="form-control">
                <label>Advisor:</label>
                <Select
                    label="test"
                    isDisabled={!writeAccess}
                    options={advisorOptions}
                    placeholder={
                        advisor? (advisor.first_name.trim()!==''&&advisor.last_name.trim()!==''?advisor.first_name+' '+advisor.last_name: (advisor.username?advisor.username:"?")):"Select Advisor"
                        
                    }//'Select Advisor'
                        
                    onChange={(selectedOption)=>{
                        console.log('selectedOption')
                        console.log(selectedOption)
                        setAdvisor(selectedOption.value)
                        updateAdvisor(id, {advisor: selectedOption.value, role: role, cfcCode: cfcCode, collaboratorStatus: collaboratorStatus, collaboratorPosition: collaboratorPosition, split:split})
                    }
                    
                }
                />
            </div>
            <div className="form-control">
                <label>CFC Code:</label>
                <input
                    disabled={!writeAccess}
                    type="text"
                    placeholder={selectedAdvisors[id] && selectedAdvisors[id].cfc_code? selectedAdvisors[id].cfc_code:'Enter CFC Code'}
                    onChange = {(e)=>{
                        console.log('e.target.value')
                        console.log(e.target.value)
                        setCfcCode(e.target.value)
                        updateAdvisor(id, {advisor: advisor, role: role, cfcCode: e.target.value,collaboratorStatus:collaboratorStatus, collaboratorPosition: collaboratorPosition, split:split })
                    }}
                />
            </div>
            <div className="form-control">
                <label>Role:</label>
                <Select 
                    options={roleOptions}
                    placeholder={role && role.user_role_name? role.user_role_name:'Role'}
                    onChange={(selectedOption)=>{
                        console.log('selectedOption')
                        console.log(selectedOption)
                        setRole(selectedOption.value)
                        updateAdvisor(id, {advisor: advisor,role: selectedOption.value, fcfCode: cfcCode, collaboratorStatus: collaboratorStatus, collaboratorPosition: collaboratorPosition, split:split})
                        
                    }}

                    isDisabled={!writeAccess}
                />
            </div>
            <div className="form-control">
                <label>Position:</label>
                <Select
                    isDisabled={!writeAccess}
                    options={collaboratorPositionOptions}
                    placeholder={collaboratorPosition && collaboratorPosition.position_name? collaboratorPosition.position_name:'Position'} 
                    onChange={
                        (selectedOption)=>{
                            console.log('selectedOption')
                            console.log(selectedOption)
                            setCollaboratorPosition(selectedOption.value)
                            updateAdvisor(id, {advisor: advisor, role: role, cfcCode:cfcCode, colaboratorStatus:collaboratorStatus, collaboratorPosition: selectedOption.value, split:split})
                        }
                    }
                />
            </div>
            <div className="form-control">
                <label>Status:</label>
                <Select 
                    isDisabled={!writeAccess}
                    options = {collaboratorStatusOptions}
                    placeholder={selectedAdvisors[id] && selectedAdvisors[id].collaboratorStatus? selectedAdvisors[id].collaboratorStatus.status_name:'Status'}
                    onChange={
                        (selectedOption)=>{
                            console.log('selectedOption')
                            console.log(selectedOption)
                            setCollaboratorStatus(selectedOption.value)
                            updateAdvisor(id, {advisor: advisor, role: role, cfcCode:cfcCode, collaboratorStatus: selectedOption.value, collaboratorPosition: collaboratorPosition, split:split})
                        }
                    }
                />
            </div>
            <div className="form-control">
                <label>Split:</label>
                <input
                    type="text"
                    disabled={!writeAccess}
                    placeholder={selectedAdvisors[id] && selectedAdvisors[id].split? selectedAdvisors[id].split:'Enter Split'}
                    onChange = {(e)=>{
                        console.log('e.target.value')
                        console.log(e.target.value)
                        setSplit(e.target.value)
                        updateAdvisor(id, {advisor: advisor, role: role, cfcCode: cfcCode,collaboratorStatus:collaboratorStatus, collaboratorPosition: collaboratorPosition, split: e.target.value })
                    }}
                />
            </div>
        </div>
    )
}

export default NBF8Advisor