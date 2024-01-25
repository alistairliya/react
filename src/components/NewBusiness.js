// Modeled AddTask example, 1:03:25
import NBF1 from './NBF1'
import NBF2 from './NBF2'
import NBF3 from './NBF3'
import NBF4 from './NBF4'
import NBF5 from './NBF5'
import NBF6 from './NBF6'
import NBF7 from './NBF7'
import NBF9 from './NBF9'
import NBF10 from './NBF10'
import { useAuth } from "../hooks/useAuth"
import { useState, useEffect} from 'react'
import {ROOT_URL} from '../constants'
//import { useRadioGroup } from '@mui/material'
const NewBusiness = ({onAdd, close}) => {
    const [client, setClient] = useState()
    const [insured, setInsured] = useState()
    const [index, setIndex] = useState(0)
    const [applicantAddress, setApplicantAddress] = useState()
    const [insuredAddress, setInsuredAddress] = useState()
    const [applicantPhones, setApplicantPhones] = useState()
    const [insuredPhones, setInsuredPhones] = useState()


    const [applicantInsurance, setApplicantInsurance] = useState()
    const [medicals, setMedicals] = useState()
    const [documents, setDocuments] = useState()
    const [collaborators, setCollaborators] = useState()
    const [complianceEntities, setComplianceEntities] = useState()
    const { user } = useAuth() 


    const postToAPI = async (url, obj) => {
        
        
        let headers = new Headers()
        const token = user['token']
        const auth_str = 'Token '+token
        headers.set('Authorization', auth_str)
        headers.set('Content-Type', 'application/json')
        
        const strObj = JSON.stringify(obj)
        
        
        const res = await fetch(url,
            {
                method:'POST',
                body:strObj, //JSON.stringify(obj),
                headers:headers
            })
        const data = await res.json()
        return data
    }

    const onNextClicked = () => {
        setIndex(index+1)
    }

    const onPrevClicked = () => {
        setIndex(index-1)
    }

    const onCreateClicked = async () => {
        const business = collect()
        const url = ROOT_URL+'/api/newbusiness/create_insurance_application/'
        const result = await postToAPI(url, business)
    }

    const collect = () => {
        return {
            client:client,
            applicantAddress:applicantAddress,
            applicantPhones:applicantPhones,
            insured:insured,
            insuredAddress:insuredAddress,
            insuredPhones:insuredPhones,
            //applicantInsurance:applicantInsurance,
            //medicals:medicals,
            //documents:documents,
            //collaborators:collaborators,
            //complianceEntities:complianceEntities
        }
    }

    useEffect(()=>{
        
        
        
        //if(applicantPhones!=null)
        
        //if(applicantInsurance!=null)

    })

    const nbfs = [
        <NBF1 setClient={setClient} onNextClicked = {onNextClicked}/>, 
        <NBF2 setClient={setClient} onNextClicked = {onNextClicked} onPrevClicked={onPrevClicked} client={client}  />,
        <NBF3 setApplicantAddress= {setApplicantAddress} onNextClicked = {onNextClicked} onPrevClicked={onPrevClicked} client={client}/>,
        <NBF4 onNextClicked = {onNextClicked} onPrevClicked = {onPrevClicked} onCreateClicked={onCreateClicked} setApplicantPhones = {setApplicantPhones} client = {client} />, 

        // If applicant and insured are different
        <NBF1 setClient={setInsured} onNextClicked = {onNextClicked} onPrevClicked={onPrevClicked} forInsured={true}/>, 
        <NBF2 setClient={setInsured} onNextClicked = {onNextClicked} onPrevClicked={onPrevClicked} client={insured} forInsured={true}  />,
        <NBF3 setApplicantAddress= {setInsuredAddress} onNextClicked = {onNextClicked} onPrevClicked={onPrevClicked} client={insured} forInsured={true}/>,
        <NBF4 onNextClicked = {onNextClicked} onPrevClicked = {onPrevClicked} onCreateClicked={onCreateClicked} setApplicantPhones = {setInsuredPhones} client = {insured} forInsured={true} />, 
    ] 
    return( 
        <div className="container">{nbfs[index]}</div>
    )
}
export default NewBusiness

/*
const NewBusiness = ({onAdd}) => {
    const [lastName, setLastName] = useState('')
    const [firstName, setFirstName] = useState('')
    const [address, setAddress] = useState('')
    const [submitted, setSumbmitted] = useState(false)

    const onSubmit = (e) =>{
        e.preventDefault() // avoiding submitting to a page.
        // some validation
        if(!lastName){
            alert('Please add Last Name')
            return
        }

        onAdd({lastName, firstName, address, submitted})
        setLastName('')
        setFirstName('')
        setAddress('')
        setSumbmitted(false)


    }

    return (
    <form className="add-form" onSubmit={onSubmit}>
        <div className="form-control">
            <label>Last Name</label>
            <input type='text' placeholder="Client's Last Name" value={lastName} onChange={(e)=>setLastName(e.target.value)} />
        </div>
        <div className="form-control">
            <label>First Name</label>
            <input type='text' placeholder="Client's First Name" value={firstName} onChange={(e)=>setFirstName(e.target.value)} />
        </div>
        <div className="form-control">
            <label>Address</label>
            <input type='text' placeholder="Client's Address" value={address} onChange={(e)=>setAddress(e.target.value)}/>
        </div>
        <div className='form-control form-control-check'>
            <label>Document Submitted</label>
            <input 
                type='checkbox'
                checked={submitted} 
                value={submitted} 
                onChange={(e)=>setSumbmitted(e.currentTarget.checked)}
            />
        </div>
        <input type='submit' value='Add Business' className='btn btn-block' />
    </form>
  )
}

*/