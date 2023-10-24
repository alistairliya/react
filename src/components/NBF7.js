// Documents
import { useAuth } from "../hooks/useAuth"
import { useEffect, useState } from "react"
import Document from './NBF7Doc.js'
import {ROOT_URL} from '../constants'

const NBF7 = ({onNextClicked, setDocuments}) => {
    
    const [availableDocuments, setAvailableDocuments] = useState([])
    const [selectedDocuments, setSelectedDocuments] = useState({})
    const { user } = useAuth()

    useEffect(()=>{
        console.log('NBF7 useEffect')
        const fetchResource = async (resource) =>{
            let headers = new Headers()
            const token = user['token']
            const auth_str = 'Token '+token
            headers.set('Authorization', auth_str)
            let url = ROOT_URL+'/api/'+resource+'/'
            const res = await fetch(url,{headers:headers})
            const data = await res.json()
            setAvailableDocuments(data)
            console.log(data)
            return data
        }
        if (availableDocuments.length === 0){
            console.log('fetching documents')
            fetchResource('document') 
        }
    },[user,availableDocuments])

    const onSubmit = (e) =>{
        e.preventDefault()
        console.log('NBF6 Next pressed')
        console.log(JSON.stringify(selectedDocuments))
        setDocuments(selectedDocuments)
        onNextClicked()
    }

    const collect = (key, value) =>{
        // [] inside your object definition to specify a property with dynamic name.
        // https://react.dev/learn/updating-objects-in-state
        setSelectedDocuments({...selectedDocuments, [key]: value})
        console.log(JSON.stringify(selectedDocuments))
    }

  return (
    <div>
        <h2>New Business Form - Documents Submitted</h2> 
    {
        availableDocuments.map((item)=>(<Document key={item.id} id={item.id} item={item} collect = {collect}/>))
    }   
      <form className="add-form" onSubmit={onSubmit}>
            <input type='submit' value='Next' className='btn btn-block' />
      </form>
    </div>
  )
}

export default NBF7