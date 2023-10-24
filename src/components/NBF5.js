// Insurance Information:
// x Insurance Provider - selection
// x Insurance Plan Type - selection
// x Insurancce Plan - selection
// Face Amount - text box
// Planned Premium - text box
// Order Medical - NBF6

import { useAuth } from "../hooks/useAuth"
import {useState, useEffect} from 'react'
import Select from "react-select"
import {ROOT_URL} from '../constants'
const NBF5 = ({setInsuranceInfo, onNextClicked}) => {


    const { user } = useAuth()
    const [insuranceProviders, setInsuranceProviders] = useState([])
    const [insurancePlanTypes, setInsurancePlanTypes] = useState([])
    const [insurancePlans, setInsurancePlans] = useState([])
    const [faceAmount, setFaceAmount] = useState('')   
    const [plannedPremium, setPlannedPremium] = useState('')
    const [insObj, setInsObj] = useState({})    

   useEffect(()=>{
        console.log('NBF5')
        const fetchResource = async(resource) =>{
            let headers = new Headers()
            const token = user['token']
            const auth_str = 'Token '+token
            headers.set('Authorization', auth_str)
            let url = ROOT_URL+'/api/'+resource+'/'
            console.log(url)
            const res = await fetch(url,{headers:headers})
            const data = await res.json()
            return data
        }
        // Get Insurnace Providers
        const getInsuranceProviders = async() =>{
            const insProvider = await fetchResource('insuranceprovider')
            setInsuranceProviders(insProvider)
            console.log(insProvider)
        }
        const getInsurancePlanTypes = async() =>{
            const insPlanTypes = await fetchResource('insuranceplantype')
            setInsurancePlanTypes(insPlanTypes)
            console.log(insPlanTypes)
        }

        const getInsurancePlans = async() =>{
            const insPlans = await fetchResource('insuranceplan')
            setInsurancePlans(insPlans)
            console.log(insPlans)
        }

        getInsurancePlanTypes()
        getInsuranceProviders()
        getInsurancePlans()
   },[])//,[user, insuranceProviders, insurancePlanTypes])
   
   const planTypeOptions = insurancePlanTypes.map((planType) => (
    {value: planType,
    label: planType.insurnace_plan_type_name
   }))

   const insuranceProviderOptions = insuranceProviders.map((provider) => (
    {value: provider,
    label: provider.insurance_provider_name
    }))

    const insurancePlanOptions = insurancePlans.map((plan) => (
        {value: plan,
        label: plan.insurance_plan_name
    }))

    const onSubmit = (e) =>{
        e.preventDefault()
        console.log('onSubmit')
        setInsuranceInfo(insObj)
        onNextClicked()
    }

  return (
    <div>
        <h2>New Business Form - Insurance Information</h2> 
        <label>Select Plan Type:</label>
        <Select
            options={planTypeOptions}
            onChange = {e => setInsObj({...insObj, insurance_plan_type: e.value})}
        />
        <label>Select Insurnace Provider:</label>
        <Select
            options={insuranceProviderOptions}
            onChange = {e => setInsObj({...insObj, insurance_provider: e.value})}
        />
        <label>Select Insurance Plan:</label>
        <Select
            options={insurancePlanOptions}
            onChange = {e => setInsObj({...insObj, insurance_plan: e.value})}
        />
        <div className="form-control">
            <label>Face Amount:</label>
            <input type='text' 
                    placeholder="Face Amount" 
                    value={insObj.face_amount} 
                    onChange = {e => setInsObj({...insObj, face_amount: e.target.value})} />
        </div>
        <div className="form-control">
            <label>Planned Monthly Premium:</label>
            <input type='text' 
                    placeholder="Planned Premium" 
                    value={insObj.planned_premium} 
                    onChange = {e => setInsObj({...insObj, planned_premium: e.target.value})} />
        </div>
        <form className="add-form" onSubmit={onSubmit}>
            <input type='submit' value='Next' className='btn btn-block' />
        </form>
    </div>
  )
}

export default NBF5