//rafce
import{ROOT_URL} from '../constants'
import BusinessDetailsFP from './BusinessDetailsFP'
import Button from './Button'
import { useAuth } from "../hooks/useAuth"

const BusinessDetailsPolicyDelivery = ({business, refreshBusinesses, getStatus, hasWriteAccess = true}) => {
  
    const { user } = useAuth()
    
    const submitForReview = async () =>{
        if(!hasWriteAccess){
            alert('Only the onwer or supervisor can SUBMIT')
            return
        }
        console.log('submitForReview')
        const url = ROOT_URL+'/api/editbusiness/update_status/' 
        const token = user['token']
        const auth_str = 'Token '+token
        const headers = new Headers()
        headers.set('Authorization', auth_str)
        headers.set('Content-Type', 'application/json')
        const options = {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({business_id:business.id, status:'PENDING'})
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
            console.log('no errors')
            alert('Update successful')
        }
    }
  
    const handleClick = async () =>{
        await submitForReview()
        refreshBusinesses()
    }
    
    return (
    <div className='container'>
        <h2>Policy Delivery Confirmation</h2>
        <div>
            <Button
                text = 'Submit for Approval'
                onClick={ handleClick}
                disabled = {!hasWriteAccess} 
            />
        </div>
        <BusinessDetailsFP docName = ' ' business = {business} refreshBusinesses = {refreshBusinesses}  writeAccess = {hasWriteAccess} />
    </div>
  )
}

export default BusinessDetailsPolicyDelivery