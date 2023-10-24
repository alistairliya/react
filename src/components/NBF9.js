// Compliance

import { useAuth } from "../hooks/useAuth"
import { useEffect, useState } from "react"
import ComplianceEntity from './NBF9Comp.js' // reuse NBF7Doc
import {ROOT_URL} from '../constants'

const NBF9 = ({onNextClicked, setComplianceEntities}) => {


    const [availableComplianceEntities, setAvailableComplianceEntities] = useState([])
    const [selectedComplianceEntities, setSelectedComplianceEntities] = useState({})
    const { user } = useAuth()

    useEffect(()=>{
        console.log('NBF9 useEffect')
        const fetchResource = async (resource) =>{
            let headers = new Headers()
            const token = user['token']
            console.log('TOKEN: '+token)
            const auth_str = 'Token '+token
            headers.set('Authorization', auth_str)
            let url = ROOT_URL+'/api/'+resource+'/'
            const res = await fetch(url,{headers:headers})
            const data = await res.json()
            setAvailableComplianceEntities(data)
            console.log(data)
            return data
        }
        if (availableComplianceEntities.length === 0){
            console.log('fetching compliance entities')
            fetchResource('complianceentity') 
        }
    },[user,availableComplianceEntities])


    
    const collect = (key, value) =>{
        // [] inside your object definition to specify a property with dynamic name.
        // https://react.dev/learn/updating-objects-in-state
        setSelectedComplianceEntities({...selectedComplianceEntities, [key]: value})
        console.log(selectedComplianceEntities)
    }

    const onSubmit = (e) =>{
        e.preventDefault()
        console.log('NBF9 Next pressed')
        console.log(selectedComplianceEntities)
        setComplianceEntities(selectedComplianceEntities)
        onNextClicked()
    }


    return (
    <div>NBF9

        <h2>New Business Form - Compliance</h2> 

        
    {
        availableComplianceEntities.map((item)=>(<ComplianceEntity key={item.id} id={item.id} item={item} collect = {collect}/>))
    }   
      <form className="add-form" onSubmit={onSubmit}>
            <input type='submit' value='Next' className='btn btn-block' />
      </form>
    </div>
  )
}

export default NBF9