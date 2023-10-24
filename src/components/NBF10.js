// 1. A submit button to save the data
// - Save all the collected data somewhere
// - - Save to InsuraceApplication object
// - Collaborators
// - - BusinessUser
// - - - need to reference:
// - - - -  CollaboratorStatus
// - - - -  CollaboratorPosition
// - - - - CFC Code.
// - - - Curl?
// - CmplianceEntities <--- done
// - Documents <--- done
// - Medicals <---

// Notes:
// - Both MyBusiness and InsuranceApplication have reference to Product
// - A client may have multiple addresses, but MyBusiness only makes reference to Client which then references to one or more addresses.
// - - May need to make a field to associate a single address with the business.
import { useEffect, useState } from "react"
import {ROOT_URL} from '../constants'
import { useAuth } from "../hooks/useAuth"

import Select from 'react-select' // https://react-select.com/home
const NBF10 = ({data, close}) => {

    const [clientId, setClientId] = useState()
    //const [addressId, setAddressId] = useState() // applicant address ID
    // From ApplicantInsurance Object
    const [applicantInsuranceFaceAmount, setApplicantInsuranceFaceAmount] = useState()
    const [applicantInsurancePlannedPremium, setApplicantInsurancePlannedPremium] = useState()
    const [applicantInsurancePlanId, setApplicantInsurancePlanId] = useState()
    const [applicantInsurancePlanTypeId, setApplicantInsurancePlanTypeId] = useState()
    const [applicantInsuranceProviderId, setApplicantInsuranceProviderId] = useState()
    const [collaborators, setCollaborators] = useState({})
    const [complianceEntities, setComplianceEntities] = useState({})
    const [documents, setDocuments] = useState({})
    const [medicals, setMedicals] = useState({})
    const [dataProcessed, setDataProcessed] = useState(false)
    const [systemUsers, setSystemUsers] = useState([])
    const [supervisor, setSupervisor] = useState({})
    const { user } = useAuth()
    
    useEffect(()=>{

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

        const getSystemUsers = async () => {
            const theSystemUsers = await fetchResource('users')
            setSystemUsers(theSystemUsers)
        }

        const processData = async () => {
            console.log('NBF10 useEffect')
            console.log(data)
            await processClient()
            //processAddress()
            await processApplicantInsurance()
            if(clientId){
                console.log('NBF10 Client ID is set: '+clientId)
            }
            await processCollaborators()
            await processComplianceEntities()
            await processDocuments()
            await processMedicals()
        }
        getSystemUsers()
        // processData() // No longer need this. We send raw dada to server to process.
        console.log('Supervisor: '+JSON.stringify(supervisor.id))

    },[data, supervisor])

    const supervisorOptions = systemUsers.map(
        (user)=>({
            value:user,
            label:user.first_name.trim()!==''&&!user.last_name.trim()!==''? user.first_name+' '+user.last_name:user.username
            
        })
    )

    // New or existing client? Need to add only if new.
    // If exisitng client, get the ID and URL
    // If new client, create the client, and get ID and URL
    const processClient = async () => {
        console.log('NBF10 Create Client')
        if(data['client'].is_new_client != null){
            console.log('NBF10 Client is new')
            // To be implemented.
            // POST new client
            // Example:
            // curl -X POST -H 'Authorization: Token 9af7ed53fa7a0356998896d8224e67e65c8650a3' -H 'Content-Type: application/json'  -d  '{"first_name":"A", "last_name":"Americano","birthdate":"1999-12-09","sin":"123456789","created_date":"2023-04-02T00:00","modified_date":"2023-04-01T00:00", "created_by":ROOT_URL+"/api/users/9/","gender":"M"}' http://127.0.0.1:8000/api/clients/   
            
            const client = data['client']
            const clientObj = {
                    "first_name":client.first_name,
                    "last_name":client.last_name,
                    "middle_name":client.middle_name,
                    "birthdate":client.birthdate,
                    "sin":client.sin,
                    "gender":client.gender,
                    "created_date":"2023-04-02T00:00",
                    "modified_date":"2023-04-02T00:00",
                    "created_by":ROOT_URL+"/api/users/9/"
            }
            console.log("Ready to post to clients!")
            console.log(clientObj)
            
            const result = await postToAPI(ROOT_URL+'/api/clients/', clientObj)
            
            setClientId(result.id)
            console.log('NBF10 Client ID: '+result.id)


        }else{
            console.log('NBF10 Client is not new')
            setClientId(data.client.id)
        } 
    }

    /*
    // Need this only for a newly created client?
    const processAddressB = async () => {
        console.log('NBF10 Process Address')
        if(!dataProcessed && data['applicantAddress'].is_new_address != null){
            console.log('NBF10 Address is new. Store into DB and get adderss ID')
            setDataProcessed(true)
            // curl -X POST -H 'Authorization: Token 9af7ed53fa7a0356998896d8224e67e65c8650a3' -H 'Content-Type: application/json'  -d '{"unit_number":"101","street_address":"11111 FooBarFoo Ave","city":"Big City","province_state":ROOT_URL+"/api/province_state/1/", "country":ROOT_URL+"/api/country/1/", "postal_code":"VXVSVS","address_type":ROOT_URL+"/api/addresstype/1/" }' http://127.0.0.1:8000/api/addresss/
            const postAddress = async (mydata) => {
                const addressObj = {
                    // unit_number
                    "unit_number":mydata.applicantAddress.unit_number,
                    // street_ address
                    "street_address":mydata.applicantAddress.street_address,
                    // city
                    "city":mydata.applicantAddress.city,
                    // province_state
                    "province_state":ROOT_URL+"/api/province_state/"+mydata.applicantAddress.province.id+'/',
                    // country
                    "country":"http://127.0.0.1.8000/api/country/"+mydata.applicantAddress.country.id+'/',
                    // postal_code
                    "postal_code":mydata.applicantAddress.postal_code,
                    // address_type
                    "address_type":ROOT_URL+"/api/addresstype/1/", // Hardcode for now
                    // description
                }
                const url = ROOT_URL+'/api/addresss/'
                const data = await postToAPI(url, addressObj)
                return data 
            }
            const result = await postAddress(data)
            await setAddressId(result.id)
            console.log("Setting new address ID: "+result.id)

        }else{
            console.log('NBF10 Address is not new')
            if(data.applicantAddress.id)
                setAddressId(data.applicantAddress.id)
        }
    }*/

    // Need this only for a newly created client?
    const processPhone = async () => {
        console.log('NBF10 Process Phone')
    }

    // 
    const processApplicantInsurance = async () => {
        console.log('NBF10 Process Applicant Insurance')
        if(data.applicantInsurance.face_amount != null)
            setApplicantInsuranceFaceAmount(data.applicantInsurance.face_amount)
        if(data.applicantInsurance.planned_premium != null)
            setApplicantInsurancePlannedPremium(data.applicantInsurance.planned_premium)
        if(data.applicantInsurance.insurance_plan != null)
            setApplicantInsurancePlanId(data.applicantInsurance.insurance_plan.id)
        if(data.applicantInsurance.insurance_plan_type != null)
            setApplicantInsurancePlanTypeId(data.applicantInsurance.insurance_plan_type.id)
        if(data.applicantInsurance.insurance_provider != null)
            setApplicantInsuranceProviderId(data.applicantInsurance.insurance_provider.id)
    }


    const processCollaborators = async () => {
        console.log('NBF10 Process Collaborators')
        if(data.collaborators!=null){
            setCollaborators(data.collaborators)
        }
        console.log(collaborators)
    }

    const processComplianceEntities = async () => {
        console.log('NBF10 Process Compliance Entities')
        if(data.complianceEntities!=null){
            setComplianceEntities(data.complianceEntities)
        }
        console.log(complianceEntities)
    }

    const processDocuments = async () => {
        console.log('NBF10 Process Documents')
        if(data.documents!=null){
            setDocuments(data.documents)
        }
        console.log(documents)
    }

    const processMedicals = async () => {
        console.log('NBF10 Process Medicals')
        if(data.medicals!=null){
            setMedicals(data.medicals)
        }
        console.log(medicals)
    }


    const postToAPI = async (url, obj) => {
        console.log('NBF10 Post to API '+url)
        //console.log(url)
        //console.log(obj)
        let headers = new Headers()
        const token = user['token']
        console.log('TOKEN: '+token)
        const auth_str = 'Token '+token
        headers.set('Authorization', auth_str)
        headers.set('Content-Type', 'application/json')
        //console.log("before fetch")
        const strObj = JSON.stringify(obj)
        //console.log("after sstringify")
        //console.log("strObj: "+strObj)
        const res = await fetch(url,
            {
                method:'POST',
                body:strObj, //JSON.stringify(obj),
                headers:headers
            })
        console.log(res)
        const data = await res.json()
        return data
    }

    // Based on NBF1 to NBF5, can create the My Business object.
    // The remaining requires MyBusiness to be foreign keys.
    const saveData = () => {
        console.log('NBF10 Create My Business')
        
        // REST API TO POST TO MyBusiness
        // curl -X POST -H 'Authorization: Token 9af7ed53fa7a0356998896d8224e67e65c8650a3' -H 'Content-Type: application/json'  -d  '{"created_date":"2023-04-02T00:00","modified_date":"2023-04-01T00:00","client":ROOT_URL+"/api/clients/1/", "status":ROOT_URL+"/api/businessstatus/1/"}' http://127.0.0.1:8000/api/mybusiness/ 
        const postMyBusiness = async () =>{

            const mybusiness = 
            {
                // business_type. eg. Insurance <- not important at this time
                // product. eg. Life 1. FK to Product Type
                "client":ROOT_URL+"/api/clients/"+clientId+"/", 
                "status":ROOT_URL+"/api/businessstatus/1/",
                // projeted_FYC
                // application_date
                // settled_date
                // application_location
                // created_by
                "created_date":"2023-04-02T00:00",
                "modified_date":"2023-04-01T00:00",
            }
            let url = ROOT_URL+'/api/mybusiness/'
            const data = await postToAPI(url, mybusiness)
            return data
        }

        const postPhone = async () =>{
            let phoneId = null
            // data.applicantPhones is an array. But there should only be at most 1.
            const phones = data.applicantPhones
            if(phones.length === 0)
                return null
            const phone = phones[0]
            if (phone.selection != null){
                // existing phone
                phoneId = phone.selection.id
            }else{
                // new phone
                
                const phoneObj = {
                    "clients": [ROOT_URL+"/api/clients/"+clientId+"/"],
                    "area_code": phone.area_code,
                    "phone_number": phone.phone_number,
                    "phone_type": ROOT_URL+"/api/phonetype/"+phone.phone_type.id+"/",
                    "is_primary": false,
                    "is_active": true,
                    "is_archived": false,
                    "notes": null
                }
                const url = ROOT_URL+'/api/phone/'
                const result = await postToAPI(url, phoneObj)
                phoneId = result.id
                console.log("Successfully posted to phone: "+phoneId)
            }
            return phoneId
        }

        // curl -X POST -H 'Authorization: Token 9af7ed53fa7a0356998896d8224e67e65c8650a3' -H 'Content-Type: application/json'  -d '{"unit_number":"","street_address":"1237 Red Sox Ave.","city":"Boston","province_state":ROOT_URL+"/api/province_state/3/","country":"http://127.0.0.1.8000/api/country/2/","postal_code":"123512","address_type":ROOT_URL+"/api/addresstype/1/"}' http://127.0.0.1:8000/api/addresss/
        const postAddress = async () => {
            let addressId = null
            if(data.applicantAddress.is_new_address){
                const addressObj = {
                    // unit_number
                    "unit_number":data.applicantAddress.unit_number,
                    // street_ address
                    "street_address":data.applicantAddress.street_address,
                    // city
                    "city":data.applicantAddress.city,
                    // province_state
                    "province_state":ROOT_URL+"/api/province_state/"+data.applicantAddress.province.id+'/',
                    // country
                    "country":"http://127.0.0.1.8000/api/country/"+data.applicantAddress.country.id+'/',
                    // postal_code
                    "postal_code":data.applicantAddress.postal_code,
                    // address_type
                    "address_type":ROOT_URL+"/api/addresstype/1/", // Hardcode for now
                    // description
                }
                const url = ROOT_URL+'/api/addresss/'
                const result = await postToAPI(url, addressObj)
                addressId = result.id
            }else{
                addressId = data.applicantAddress.address.id
            }
            return addressId
        }
        // p225/60r17 1156 1307 230 20 10:30 
        // WORKING ON THIS RIGHT NOW!!!!
        // REST API TO POST TO InsurnaceApplication
        // curl -X POST -H 'Authorization: Token 9af7ed53fa7a0356998896d8224e67e65c8650a3' -H 'Content-Type: application/json'  -d  '{"business":ROOT_URL+"/api/mybusiness/12/","product":ROOT_URL+"/api/product/1/", "plan_type":ROOT_URL+"/api/insuranceplantype/1/","plan":ROOT_URL+"/api/insuranceplan/1/","face_amount":1.0, "planned_premium":2.0,"provider":ROOT_URL+"/api/insuranceprovider/1/"}' http://127.0.0.1:8000/api/insuranceapplication/
        // From Doc: If the Product Type of a Product points to insurance, use this table (InsuranceApplication) for insurance specific data.
        const postInsuranceApplication = async (businessId, addressId, phoneId) =>{
            console.log('NBF10 Post Insurance Application')
            const insuranceApplication = {
                // business
                "business":ROOT_URL+"/api/mybusiness/"+businessId+"/",
                // product
                "product":ROOT_URL+"/api/product/1/", // <- hard coded for now
                // plan_type
                "plan_type":ROOT_URL+"/api/insuranceplantype/"+applicantInsurancePlanTypeId+"/",
                // plan
                "plan":ROOT_URL+"/api/insuranceplan/"+applicantInsurancePlanId+"/",
                // face_amount
                "face_amount":applicantInsuranceFaceAmount, 
                // planned_premium
                "planned_premium":applicantInsurancePlannedPremium,
                // provider
                "provider":ROOT_URL+"/api/insuranceprovider/"+applicantInsuranceProviderId+"/",
                // applicant_address
                "applicant_address":ROOT_URL+"/api/addresss/"+addressId+"/",
                // applicant_phone
                "applicant_phone":ROOT_URL+"/api/phone/"+phoneId+"/",
            
            }
            console.log(insuranceApplication)
            let url = ROOT_URL+'/api/insuranceapplication/'
            const data = await postToAPI(url, insuranceApplication)
            return data

        }
        // curl -X POST -H 'Authorization: Token 9af7ed53fa7a0356998896d8224e67e65c8650a3' -H 'Content-Type: application/json'  -d  '{"user":ROOT_URL+"/api/users/9/", "business":ROOT_URL+"/api/mybusiness/23/","user_role":ROOT_URL+"/api/businessuserrole/1/","created_date":"2023-04-02T00:00","modified_date":"2023-04-01T00:00", "created_by":ROOT_URL+"/api/users/9/" }' http://127.0.0.1:8000/api/businessuser/ 
        const postBusinessUser = async (businessId) =>{
            console.log('NBF10 Post Business User')
            
            for(let k in collaborators){
                console.log('Iterate: '+k)
                console.log(collaborators[k])
                const businessUser = {
                    // user
                    "user":ROOT_URL+"/api/users/"+collaborators[k].advisor.id+"/",
                    // business
                    "business":ROOT_URL+"/api/mybusiness/"+businessId+"/",
                    // user_role
                    "user_role" : ROOT_URL+"/api/businessuserrole/"+collaborators[k].role.id+"/",
                    // collaborator_status
                    "collaborator_status" : ROOT_URL+"/api/collaboratorstatus/"+collaborators[k].collaboratorStatus.id+"/",
                    // collaborator_position
                    "collaborator_position" : ROOT_URL+"/api/collaboratorposition/" + collaborators[k].collaboratorPosition.id+"/",
                    // cfc_code
                    "cfc_code" : collaborators[k].cfcCode,
                    
                    // created_date
                    // modified_date
                    "created_date":"2023-04-02T00:00",
                    "modified_date":"2023-04-01T00:00",
                    // created_by
                    "created_by":ROOT_URL+"/api/users/9/" // <- hard coded for now
                }
                console.log('NBF10 Business User')
                console.log(businessUser)
                console.log(JSON.stringify(businessUser))
                let url = ROOT_URL+'/api/businessuser/'
                await postToAPI(url, businessUser)
            }
        }
        // curl -X POST -H 'Authorization: Token 9af7ed53fa7a0356998896d8224e67e65c8650a3' -H 'Content-Type: application/json'  -d '{"business":ROOT_URL+"/api/mybusiness/37/", "compliance_entity":ROOT_URL+"/api/complianceentity/3/", "notes":"This is a test"}' http://127.0.0.1:8000/api/businesscompliance/
        const postBusinessCompliance = async (businessId) =>{
            console.log('NBF10 Post Business Compliance')
            for(let k in complianceEntities){
                console.log('Iterate: '+k)
                console.log(complianceEntities[k])
                const businessCompliance = {
                    // business
                    "business":ROOT_URL+"/api/mybusiness/"+businessId+"/",
                    // compliance_entity
                    "compliance_entity":ROOT_URL+"/api/complianceentity/"+k+"/", // key is ID
                    // notes
                    "notes":complianceEntities[k].notes
                }
                let url = ROOT_URL+"/api/businesscompliance/" 
                console.log(JSON.stringify(businessCompliance))
                await postToAPI(url, businessCompliance)    
            }
        }



        // curl -X POST -H 'Authorization: Token 9af7ed53fa7a0356998896d8224e67e65c8650a3' -H 'Content-Type: application/json'  -d '{"business":ROOT_URL+"/api/mybusiness/37/", "document":ROOT_URL+"/api/document/3/", "notes":"This is a test" }' http://127.0.0.1:8000/api/businessdocument/
        const postBusinessDocument = async (businessId) =>{
            console.log('NBF10 Post Business Document')
            for(let k in documents){
                console.log('Iterate: '+k)
                console.log(documents[k])
                const businessDocument = {
                    // business
                    "business":ROOT_URL+"/api/mybusiness/"+businessId+"/",
                    // document
                    "document":ROOT_URL+"/api/document/"+k+"/", // key is ID
                    // notes
                    "notes":documents[k].notes
                }
                let url = ROOT_URL+"/api/businessdocument/"
                console.log(JSON.stringify(businessDocument))
                await postToAPI(url, businessDocument)
            }
        }   

        const postBusinessMedical = async (businessId) =>{
            console.log('NBF10 Post Business Medical')
            for(let k in medicals){
                console.log('Iterate: '+k)
                console.log(medicals[k])
                const businessMedical = {
                    // business
                    "business":ROOT_URL+"/api/mybusiness/"+businessId+"/",
                    // medical
                    "medical":ROOT_URL+"/api/medical/"+k+"/", // key is ID
                    // notes
                    "notes":medicals[k].notes,
                    // status
                    "status":ROOT_URL+"/api/status/2/" // <- hard coded for now
                }
                let url = ROOT_URL+"/api/businessmedical/"
                console.log(JSON.stringify(businessMedical))
                await postToAPI(url, businessMedical)
            }
        }


        // curl -X POST -H 'Authorization: Token 9af7ed53fa7a0356998896d8224e67e65c8650a3' -H 'Content-Type: application/json'  -d '{"business":ROOT_URL+"/api/mybusiness/71/","user":ROOT_URL+"/api/users/1/","notes":"test"}' ROOT_URL+"/api/businessssupervisor/"
        const postBusinessSupervisor = async (businessId, userId) =>{
            console.log('NBF10 Post Business Supervisor')
            const businessSupervisor = {
                // business
                "business":ROOT_URL+"/api/mybusiness/"+businessId+"/",
                // user
                "supervisor":ROOT_URL+"/api/users/"+userId+"/",
                "notes":""
            }
            let url = ROOT_URL+"/api/businessssupervisor/"
            console.log(JSON.stringify(businessSupervisor))
            await postToAPI(url, businessSupervisor)
        }

        const save = async () =>{
            console.log('NBF10 Save')
            const businessObj = await postMyBusiness()
            // get the ID to mybusiness object
            // with MyBusiness ID, post to InsuranceApplication
            console.log(businessObj)
            console.log('NBF10 MyBusiness ID: '+businessObj.id)
            const addressId = await postAddress() 
            const phoneId = await postPhone()
            console.log("Phone ID: "+phoneId)
            await postInsuranceApplication(businessObj.id, addressId, phoneId)
            await postBusinessUser(businessObj.id)
            await postBusinessCompliance(businessObj.id)
            await postBusinessDocument(businessObj.id)
            await postBusinessMedical(businessObj.id)
            await postBusinessSupervisor(businessObj.id, supervisor.id)
        }
        save()
    }

    const sendDataToAPI = async () => {
        const url = ROOT_URL+"/api/newbusiness/create_new_business/"
        console.log("sendDataToAPI")
        console.log(data)
        await postToAPI(url, data)
    }



    const processMyData = async () => {
        console.log('NBF10 processMyData')
        console.log(data)
        await processClient()
        //processAddress()
        
        await processApplicantInsurance()
        if(clientId){
            console.log('NBF10 Client ID is set: '+clientId)
        }
        await processCollaborators()
        await processComplianceEntities()
        await processDocuments()
        await processMedicals()
    }



    const onSubmit = async (e) =>{
        e.preventDefault()
        // take data and save to DB
        console.log('NBF10 Submit pressed')
        /*
        await saveData()
        close()
        //window.location.reload(true);
        */
       console.log('Adding supervisor')
       data['supervisor'] = supervisor // add supervisor to data
       await sendDataToAPI()
       close()
       window.location.reload(true)
    }
    return (
    <div>
        <h3>Select an approver:</h3>
        <Select
            options={supervisorOptions}
            onChange={(selectedOption)=>{
                    console.log('selectedOption')
                    console.log(selectedOption)
                    setSupervisor(selectedOption.value)
                }
            }
        />    
        <div className='container'>
         {
            //JSON.stringify(data, null, 4)
         }
        </div>
    
      <form className="add-form" onSubmit={onSubmit}>
            <input type='submit' value='Submit' className='btn btn-block' />
      </form>
    </div>
  )
}

export default NBF10