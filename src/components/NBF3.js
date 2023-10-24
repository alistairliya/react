// Addresses

import SelectAddress from './SelectAddress'
import NewAddress from './NewAddress'
import {useState, useEffect} from 'react'

const NBF3 = ({onNextClicked, onPrevClicked, client, setApplicantAddress, forInsured=false}) => {
  //const [address, setAddress] = useState({})
  const [existingAddresses, setExistingAddresses] = useState(client.client_addresses)
  const [checked, setChecked] = useState(false)

  useEffect(()=>{
    console.log('NBF3...')
    //console.log(setApplicantAddress)
    console.log('NBF3 onNextClicked')
    console.log(onNextClicked)
    console.log(existingAddresses)
    //if(client.client_addresses != null && client.client_addresses.length>0){
    if(existingAddresses && existingAddresses.length > 0){
      console.log('Existing client with existing addresses:')
      console.log(existingAddresses)
    }
  })

    const handleChange = ()=>{
        setChecked(!checked)
    }
  //const fetchAddress =  
  const checkBox = ( 
            <label>
                <input 
                    type="checkbox"
                    checked={checked}
                    onChange={handleChange}
                />
                Create new address
            </label>
  )
  return (
    // Create new address for new client.
    // Optional for existing client.
    <div>
        <h2>New Business Form -  {forInsured? ('Insured Address'):('Applicant Address')}</h2>
      {existingAddresses && existingAddresses.length > 0 && !checked? 
        ( 
          
        <div>
            <SelectAddress onNextClicked={onNextClicked} onPrevClicked={onPrevClicked} setAddress={setApplicantAddress} addresses={existingAddresses} />
            {checkBox}
        </div>
        ):
        (<div>
          {
            existingAddresses && existingAddresses.length > 0 ?
              <div><NewAddress onNextClicked={onNextClicked} onPrevClicked={onPrevClicked} setAddress={setApplicantAddress} />{checkBox}</div>:
              <NewAddress onNextClicked={onNextClicked} onPrevClicked={onPrevClicked} setAddress={setApplicantAddress}/>}
        </div>
        )
      }
    
    </div>
  )
}

export default NBF3