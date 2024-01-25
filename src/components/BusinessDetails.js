// Data from:
// Client <- WORKING ON FETCHING
// MyBusiness <- already passed down by caller
// Address and Phone <- Applicant Phone and Applicant Address
// InsuranceApplication
// BusinessUser
// BusinessCompliance
// BusinessDocument
// BusinessMedical

import Button from './Button'

import {useEffect, useState} from "react"
import { useAuth } from "../hooks/useAuth"
import BusinessDetailsClient from './BusinessDetailsClient'
import BusinessDetailsContact from './BusinessDetailsContact'
import BusinessDetailsInsurance from './BusinessDetailsInsurance'
import BusinessDetailsAdvisors from './BusinessDetailsAdvisors'
import BusinessDetailsFP from './BusinessDetailsFP'
import BusinessDetailsDecline from './BusinessDetailsDecline'
import BusinessDetailsApprove from './BusinessDetailsApprove'
import BusinessDetailsPolicyDelivery from './BusinessDetailsPolicyDelivery'
import {ROOT_URL} from '../constants'

const BusinessDetails = ({business, closeComponent, refreshBusinesses, forApproval=false}) => {
    const [myClient, setMyClient] = useState(null)
    const [myInsuredClient, setMyInsuredClient] = useState(null)
    const [myStatus, setMyStatus] = useState(null)
    const [updateCounter, setUpdateCounter] = useState(0)
    const [updatePayload, setUpdatePayload] = useState({'business_id': business.id}) 
    const [editMode, setEditMode] = useState(false)
    const [updateErrors, setUpdateErrors] = useState([])
    const [applicantAddress, setApplicantAddress] = useState(null)
    const [applicantPhone, setApplicantPhone] = useState(null)
    const [insuredAddress, setInsuredAddress] = useState(null)
    const [insuredPhone, setInsuredPhone] = useState(null)
    const [sameAsApplicant, setSameAsApplicant] = useState(false)
    const [hasWriteAccess, setHasWriteAccess] = useState(false)
    const [approvalButtonsDisabled, setApprovalButtonsDisabled] = useState(false)
    const [DeclineConfirmDisplayed, setDeclineConfirmDisplayed] = useState(false)
    const [ApprovalConfirmDisplayed, setApprovalConfirmDisplaed] = useState(false)
    const [isSubmitForReviewDisabled, setIsSubmitForReviewDisabled] = useState(false)
    const [myBusiness, setMyBusiness] = useState(business)
    const { user } = useAuth()

    const getMyClient = async () => {
        let c = await fetchObject(business.client)
        setMyClient(c)
    }
   
    const getInsuredClient = async () => {
        let c = await fetchObject(business.insurance_application[0].insured_client)
        setMyInsuredClient(c)
    }
    const getStatus = async () => {
        let s = await fetchObject(business.status)
        if(s.status_name === 'REVIEW' || s.status_name === 'PENDING'){
            setApprovalButtonsDisabled(false)
        }
        await setMyStatus(s)
    }

    const getWriteAcess = async () =>{
        const url = ROOT_URL+'/api/editbusiness/get_write_access/?business_id='+business.id
        let result = await fetchObject(url)
        if(result['result'] === 'OK'){
            setHasWriteAccess(true)
        }else{
            setHasWriteAccess(false)
        }
    }

    const refreshMyBusiness = async () =>{
        const url = ROOT_URL+'/api/mybusiness/'+business.id +'/'
        let b = await fetchObject(url)
        await setMyBusiness(b)
        setUpdateCounter(updateCounter + 1)
    }


    useEffect(()=>{
        setMyBusiness(business)
        // is user staff?
        setHasWriteAccess(false)
        
        // is user owner?
        // Call /api/editbusiness/get_write_access/?business_id=[business.id]

        
        getWriteAcess()
        getMyClient()
        getInsuredClient()
        getStatus()
        setApplicantAddress(extractApplicantAddress())
        setApplicantPhone(extractApplicantPhone())
        setInsuredAddress(extractInsuredAddress())
        setInsuredPhone(extractInsuredPhone())
        // Insured client same as applicant when they are the same people  
        setSameAsApplicant(
            business.client===business.insurance_application[0].insured_client &&
            business.applicant_client_address===business.insurance_application[0].insured_client_address &&
            business.applicant_client_phone===business.insurance_application[0].insured_client_phone
        )
        setIsSubmitForReviewDisabled(
            !hasWriteAccess  // User des not have write accesss. This happens at ACCEPTED status when user uploads Policy Delivery Confirmtno and submits ta instead
            //|| forApproval // or the component us ued for approval process by an admin 
            //|| (myStatus && myStatus.status_name === 'DECLINED') //or it is DECLINED and user should be resubmiting Policy Deliery Confirmation intead
            //|| (myStatus && myStatus.status_name === 'PENDING') 
        )

    }, [business, updateCounter, updateErrors, myBusiness])

    const fetchObject = async (url) =>{
        let headers = new Headers()
        const token = user['token']
        const auth_str = 'Token '+token
        headers.set('Authorization', auth_str)
        const res = await fetch(url,{headers:headers})
        const data = await res.json()
        return data
    }

    const test = async() =>{
        //refreshBusinesses()
    }

    const extractApplicantAddress = () => {
        return business.applicant_client_address
    }

    const extractInsuredAddress = () =>{
        const app = business.insurance_application // an array
        if (app.length > 0 && app[0].insured_client_address){
            return app[0].insured_client_address
        }
        return null
    }


    const extractApplicantPhone = () => {
        return business.applicant_client_phone
    }
    
    const extractInsuredPhone = () =>{
        const app = business.insurance_application // an array
        if (app.length > 0 && app[0].insured_client_phone){
            return app[0].insured_client_phone
        }
        return null
    }

    const extractInsurance = () =>{

        const insurance =  business.insurance_application? business.insurance_application.length > 0? business.insurance_application[0]: null : null // from an array
        return insurance
    }

    const rejectDeclineClicked = () =>{
        setApprovalButtonsDisabled(true)
        setDeclineConfirmDisplayed(true)
    }

    // Passed to BusinessDetailsDecline
    // Called when user clicks on the confirm button in BusinessDetailsDecline
    const rejectDeclineConfirmed = async (reason) =>{
        // Fix the hadcode late
        // REJECTED
        let declinedStatusUrl = ROOT_URL+'/api/businessstatus/4/' // !!!HARDCODE FOR NOW. NEED FIX LATER!!! 
        if(myStatus.status_name === 'PENDING'){
            // DECLINED
            declinedStatusUrl = ROOT_URL+'/api/businessstatus/9/' // !!!HARDCODE FOR NOW. NEED FIX LATER!!! 
        }
        const result = await reviewHelper(declinedStatusUrl, reason)
    }


    // Important: This sets status into ACCEPTED/APPROVED
    const acceptApproveClicked = () =>{
        setApprovalConfirmDisplaed(true)
        setApprovalButtonsDisabled(true)
       
    }
    
    const acceptApproveConfirmed = async (reason, settledFYC) =>{
        
        // !!!HARDCODE FOR NOW. NEED FIX LATER!!!
        let approvedStatusUrl = ROOT_URL+'/api/businessstatus/3/' // REVIEW statst
        
        if(myStatus && myStatus.status_name === 'PENDING'){
            approvedStatusUrl = ROOT_URL+'/api/businessstatus/8/' // APPROVED status, Requiremet 1.8
        }

        
        reviewHelper(approvedStatusUrl, reason, settledFYC)
    
    }


    const reviewHelper = async (approvalStatusUrl, reason='', settledFYC='') =>{
        // call the API to approve the business
        // curl -X PATCH -H 'Authorization: Token 9af7ed53fa7a0356998896d8224e67e65c8650a3' -H 'Content-Type: application/json'  -d  '{"status":ROOT_URL+"/api/businessstatus/3/"}' http://127.0.0.1:8000/api/businessapproval/1/
        // Need ID of business and ID of status
        // Hard code for now. Should be a constant somewhere.
        const sendReview = async (reason='') =>{
            const approvedStatus = approvalStatusUrl//ROOT_URL+'/api/businessstatus/3/' // !!!HARDCODE FOR NOW. NEED FIX LATER!!!
            //BusinessApprovalViewSet
            const url = ROOT_URL+'/api/businessapproval/' + business.id+'/'
            const data = {
                status: approvedStatus,
                reason: reason,
                settledFYC: settledFYC
            }
            const token = user['token']
            const auth_str = 'Token '+token
            const headers = new Headers()
            headers.set('Authorization', auth_str)
            headers.set('Content-Type', 'application/json')
            const options = {
                method: 'PATCH',
                headers: headers,
                body: JSON.stringify(data)
            }
            const fetchResult = await fetch(url, options)
            const updatedResult = await fetchResult.json()
            business.status = updatedResult.status
            await getStatus()
            await refreshBusinesses()
            if(updatedResult && updatedResult.status === approvalStatusUrl){
                setApprovalButtonsDisabled(true)
                setDeclineConfirmDisplayed(false)
            }
            return updatedResult
        }
        // result coming back is a business object
        const result = await sendReview(reason)
        return result


    }

    // this function is called by child component in edit mode.
    const collectUpdatePayload = (key, value) =>{
        setEditMode(true) // something is being edited
        setUpdatePayload({...updatePayload, [key]:value})
    }

    const submitForReview = async () =>{
        if(!hasWriteAccess){
            alert('Only the owner or supervisor can SUBMIT')
            return
        }
        // EditBusinessViewSet.update_status
        const url = ROOT_URL+'/api/editbusiness/update_status/' 
        const token = user['token']
        const auth_str = 'Token '+token
        const headers = new Headers()
        headers.set('Authorization', auth_str)
        headers.set('Content-Type', 'application/json')
        const options = {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({business_id:business.id, status:'REVIEW'})
        }
        const fetchResult = await fetch(url, options)
        const updatedResult = await fetchResult.json()
        if(updatedResult['data']){
            business.status = updatedResult['data']['status']
            await getStatus()
            await refreshBusinesses()
        }
 
        const errors = updatedResult['errors']
        if(errors.length === 0){
            setUpdateErrors(['Update successful'])
            alert('Update successful')
        }
        setUpdateErrors(errors)
        setUpdateCounter(updateCounter + 1)
    }

    const sendUpdate = async () =>{
        if(!hasWriteAccess){
            alert('Only the onwer or supervisor can EDIT')
            return
        }
        const url = ROOT_URL+'/api/editbusiness/edit_business/'
        const token = user['token']
        const auth_str = 'Token '+token
        const headers = new Headers()
        headers.set('Authorization', auth_str)
        headers.set('Content-Type', 'application/json')
        const options = {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(updatePayload)
        }
        const fetchResult = await fetch(url, options)
        const updatedResult = await fetchResult.json()
        const errors = updatedResult['result']
        if(errors.length === 0 && updatedResult['business']){
            refreshMyBusiness()
            setUpdateCounter(updateCounter + 1)
            setUpdateErrors(['Update successful'])
            alert('Update successful')
            setMyBusiness(updatedResult['business'])

        }
        setUpdateErrors(errors)
    }

 

    return (
        <div className="container">
        <div>
            <p>
                {JSON.stringify(myBusiness)}
            </p>
        </div>
        <div>Transaction ID: {business.id}</div>
        <div>Status: {myStatus?myStatus.status_name:""}</div>
        <div>
            {forApproval?// && myStatus && (myStatus.status_name ==='REVIEW' || myStatus.status_name ==='PENDING')?
                (
                    <div>
                        <Button text = {myStatus && myStatus.status_name === 'REVIEW'?'Accept':'APPROVE'} color='green' onClick = {acceptApproveClicked} disabled = {!myStatus || approvalButtonsDisabled}  /> 
                        <Button text = {myStatus && myStatus.status_name === 'REVIEW'?'Reject':'DECLINE'} color='red' onClick = {rejectDeclineClicked} disabled = {!myStatus || approvalButtonsDisabled} />
                    </div>)
                :null}
            {DeclineConfirmDisplayed &&
            (
                <BusinessDetailsDecline 
                    setDeclinePopup={setDeclineConfirmDisplayed} 
                    setApprovalButtonDisabled={setApprovalButtonsDisabled} 
                    declineConfirmed = {rejectDeclineConfirmed}
                />
            )}
            {ApprovalConfirmDisplayed && 
                <BusinessDetailsApprove
                    setPopup={setApprovalConfirmDisplaed}
                    setButtonsDisabled={setApprovalButtonsDisabled}
                    confirmed = {acceptApproveConfirmed}
                    displayFYC = {myStatus && myStatus.status_name === 'PENDING'} 
                />
            }
        </div>


        <div className="container">
        <BusinessDetailsClient title = "Applicant Info" client={myClient} collectPayload = {collectUpdatePayload} writeAccess = {hasWriteAccess}/>
        <BusinessDetailsContact title= "Applicant Contact" address={applicantAddress} phone={applicantPhone} collectPayload = {collectUpdatePayload} writeAccess = {hasWriteAccess}/>
        </div>

        {!sameAsApplicant?
        (
        <div className="container">
        <BusinessDetailsClient title = "Insured Info" client={myInsuredClient} collectPayload = {collectUpdatePayload} writeAccess = {hasWriteAccess}/>
        <BusinessDetailsContact title= "Insured Contact" address={insuredAddress} phone={insuredPhone} collectPayload = {collectUpdatePayload} writeAccess = {hasWriteAccess}/>
        </div>
        ):('')
        }
        
        {
        // The display of checkbox cannot depend on sameAsApplicant variable because it changes the variable.
        // It should always display when the client info is the same as the insured info. When this is the case, the checkbox gives user option to display insured info and change insured info.
        // When client info is different from insured info, checkbox is not necessary because both applicant and the insured info have to be displayed.
        }
        { business.client===business.insurance_application[0].insured_client &&
            business.applicant_client_address===business.insurance_application[0].insured_client_address &&
            business.applicant_client_phone===business.insurance_application[0].insured_client_phone?
        (<div><input 
                   type="checkbox"
                   checked={sameAsApplicant}
                   onChange={()=>setSameAsApplicant(!sameAsApplicant)}
                   disabled
        />  <label>Insured Client Same as Applicant</label></div>):('')}

        <BusinessDetailsInsurance insurance={extractInsurance()} collectPayload = {collectUpdatePayload} writeAccess = {hasWriteAccess} />
        <BusinessDetailsAdvisors collectPayload = {collectUpdatePayload} business={myBusiness} writeAccess = {hasWriteAccess} update ={updateCounter} />
        <div className='container'>
        <BusinessDetailsFP docName = 'First Page' business = {business} refreshBusinesses = {refreshBusinesses} forApproval = {forApproval} writeAccess = {hasWriteAccess}/>
        <BusinessDetailsFP docName = 'Commission Report' business = {business} refreshBusinesses = {refreshBusinesses} forApproval = {forApproval} writeAccess = {hasWriteAccess}/>
        
        <BusinessDetailsFP docName = 'Delivery Receipt' business = {business} refreshBusinesses = {refreshBusinesses} forApproval = {forApproval} writeAccess = {hasWriteAccess} />
        <BusinessDetailsFP docName = 'JFW FOM' business = {business} refreshBusinesses = {refreshBusinesses} forApproval = {forApproval} writeAccess = {hasWriteAccess} />
        </div>
        
        <div>
            {
                // In PENDING status, PolicyDeliveryConfirmation should not be allowed to be edited
                // In DECLINED sttus, users should be able to re-upload the documment ad resubmit,
                myStatus && (myStatus.status_name === 'ACCEPTED' || myStatus.status_name === 'PENDING'||myStatus.status_name==='DECLINED') &&(<BusinessDetailsPolicyDelivery business={business} refreshBusinesses={refreshBusinesses} getStatus={getStatus} hasWriteAccess={myStatus.status_name !== 'PENDING'}/>)
            }
        </div>

        <Button 
        text='Close'
        color='red' 
        onClick={closeComponent} 
        />
        <Button
            text = 'test'
            onClick = {test}
            disabled = {true}
        />
        <Button
            text = 'Update'
            onClick = {sendUpdate}
            disabled = {!editMode || !hasWriteAccess}
        />
        <div>
            <div>hasWritAccess: {hasWriteAccess?"TRUE":"FALSE"}</div>
        </div>
        <Button
            text = 'Submit for Review'
            onClick = {submitForReview}
            // Submit for Reivew Button should not appear when:
            disabled = {!hasWriteAccess}//{isSubmitForReviewDisabled}
            /*{!hasWriteAccess  // User des not have write accesss. This happens at ACCEPTED status when user uploads Policy Delivery Confirmtno and submits ta instead
                        || forApproval // or the component us ued for approval process by an admin 
                        || (myStatus && myStatus.status_name === 'DECLINED') //or it is DECLINED and user should be resubmiting Policy Deliery Confirmation intead
                        || (myStatus && myStatus.status_name === 'PENDING')  // or it is PENDING
                    }      */                  
        />

        <div>
        {
        updateErrors.map(
            (error, index)=>{
                return <h5 key={index}>{error}</h5>
            }
        )
        }
    </div>

        </div>
    )
}

export default BusinessDetails