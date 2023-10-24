// Order Medical
// List of medical exams, 

import { useEffect,useState } from "react"
import { useAuth } from "../hooks/useAuth"
import Medical from './NBF6CheckBoxes'
import {ROOT_URL} from '../constants'

// Select ones that apply
const NBF6 = ({onNextClicked, setMedicals}) => {
    const { user } = useAuth()
    const [availableMedicals, setAvailableMedicals] = useState([])
    const [selectedMedicals, setSelectedMedicals] = useState({})
    useEffect(()=>{
        console.log('NBF6 useEffect')
        // Get the available medical exams
        const fetchResource = async (resource) =>{
            let headers = new Headers()
            const token = user['token']
            const auth_str = 'Token '+token
            headers.set('Authorization', auth_str)
            let url = ROOT_URL+'/api/'+resource+'/'
            const res = await fetch(url,{headers:headers})
            const data = await res.json()
            setAvailableMedicals(data)
            return data
        }
        if (availableMedicals.length === 0){
            console.log('fetching medicals')
            fetchResource('medical')
            
        }
        console.log('NBF6 useEffect availableMedicals:')
        console.log(availableMedicals)
    },[availableMedicals, user])

    const collect = (key, value) =>{
        // [] inside your object definition to specify a property with dynamic name.
        // https://react.dev/learn/updating-objects-in-state
        setSelectedMedicals({...selectedMedicals, [key]: value})
    }
    const onSubmit = (e) =>{
        e.preventDefault()
        console.log('NBF6 Next pressed')
        console.log(JSON.stringify(selectedMedicals))
        setMedicals(selectedMedicals)
        onNextClicked()
    }

  return (
    <div>
        <h2>New Business Form - Insurance Information: Order Medicals</h2> 
    {
        availableMedicals.map((item)=>(<Medical key={item.id} id={item.id} item={item} collect = {collect}/>))
    }   
      <form className="add-form" onSubmit={onSubmit}>
            <input type='submit' value='Next' className='btn btn-block' />
      </form>
    </div>
  )
}

export default NBF6