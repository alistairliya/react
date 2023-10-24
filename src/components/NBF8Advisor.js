// for selecting the advisor

import {useState, useEffect} from 'react'
import Select from 'react-select' // https://react-select.com/home

const NBF8Advisor = ({id, users, roles, updateAdvisor, selectedAdvisors, collaboratorStatuses, collaboratorPositions, writeAccess}) => {
    const [role, setRole] = useState({})
    const [advisor, setAdvisor] = useState({})
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

    useEffect(()=>{
        console.log('>>>>>>>>>>>>>>>>>>>> useEffect for NBF8Advisor ID: '+id)
        console.log('selectedAdvisors:')
        console.log(selectedAdvisors)
        if(selectedAdvisors[id]){
            console.log('selectedAdvisors[id]')
            console.log(selectedAdvisors[id])
            if(selectedAdvisors[id].role){
                console.log('selectedAdvisors[id].role')
                console.log(selectedAdvisors[id].role)
                setRole(selectedAdvisors[id].role)
            }
            if(selectedAdvisors[id].advisor){
                console.log('selectedAdvisors[id].advisor')
                console.log(selectedAdvisors[id].advisor)
                setAdvisor(selectedAdvisors[id].advisor)
            }
            if(selectedAdvisors[id].collaboratorStatus){
                console.log('selectedAdvisors[id].collaboratorStatus')
                console.log(selectedAdvisors[id].collaboratorStatus)
                setCollaboratorStatus(selectedAdvisors[id].collaboratorStatus)
            }
            if(selectedAdvisors[id].collaboratorPosition){
                console.log('selectedAdvisors[id].collaboratorPosition')
                console.log(selectedAdvisors[id].collaboratorPosition)
                setCollaboratorPosition(selectedAdvisors[id].collaboratorPosition)
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
            <h3>{/*"Debug "+id */}</h3>
            <div className="form-control">
                <label>Advisor:</label>
                <Select
                    label="test"
                    isDisabled={!writeAccess}
                    options={advisorOptions}
                    placeholder={
                        selectedAdvisors[id] && 
                        selectedAdvisors[id].advisor && 
                        selectedAdvisors[id].advisor.first_name && 
                        selectedAdvisors[id].advisor.last_name? 
                            selectedAdvisors[id].advisor.first_name+' '+selectedAdvisors[id].advisor.last_name:
                            'Advisor'
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
                    placeholder={selectedAdvisors[id] && selectedAdvisors[id].cfcCode? selectedAdvisors[id].cfcCode:'Enter CFC Code'}
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
                    placeholder={selectedAdvisors[id] && selectedAdvisors[id].role? selectedAdvisors[id].role.user_role_name:'Role'}
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
                    placeholder={selectedAdvisors[id] && selectedAdvisors[id].collaboratorPosition? selectedAdvisors[id].collaboratorPosition.position_name:'Position'} 
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