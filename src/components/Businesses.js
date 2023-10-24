// from Tasks in example
import Business from './Business'
import {useEffect, useState} from "react"
import Button from './Button'
import {ROOT_URL} from '../constants'

const Businesses = ({businesses, onEdit, onToggle, showDeclined = true}) => { 

  const [showDeclinedOnly, setShowDeclinedOnly] = useState(false)

  useEffect(()=>{
    console.log('useEffect for Businesses')
    //setShowDeclinedOnly(showDeclined)
  },[])

  const isBusinessDeclined = (business) => {
    if(!showDeclinedOnly){
      return true // show everything
    }
    
    if(showDeclinedOnly && business.status === ROOT_URL+"/api/businessstatus/4/"){
      return true
    }

    return false
  }

  return (
    <div className="container">
      <div>
        <Button 
          text = {showDeclinedOnly?'Show All':'Show Rejected Only'}
          onClick = {() => setShowDeclinedOnly(!showDeclinedOnly)}
          disabled = {!showDeclined}
        />
      </div>
    <table>
      <tbody className='business'>
      <tr align="center">
        <td>Application Date</td>
        <td>Settled Date</td>
        <td>Trans ID</td>
        <td>Policy Number</td>
        <td>Status</td>
        <td>Provider</td>
        <td>Client Name</td>
        <td>Advisor</td>
        <td>Projected FYC</td>
        <td>Settled FYC</td>
        <td></td>
     </tr>
     </tbody>
      {businesses.filter(isBusinessDeclined).map((business)=>(
        <Business key={business.id} business={business} onEdit={onEdit} onToggle={onToggle}/>
      ))}
    </table>
    </div>
  )
}

export default Businesses