import {useState, useEffect} from 'react'
import Select from 'react-select' // https://react-select.com/home
//import Button from './Button'

const Phone = ({phoneObj, id,  existingPhones, phoneTypes, isPrimary=false}) => {
    const [checked, setChecked] = useState(false)
    const [areaCode, setAreaCode] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    // Adding phone to application when NEXT is pressed in grand parent.
    useEffect(()=>{
        console.log('useEffect for NBF4PhonesPhone ID: '+id)
        console.log(phoneTypes)
    })


    const checkBox = ( 
           <div>
               <input 
                   type="checkbox"
                   checked={checked}
                   onChange={()=>setChecked(!checked)}
                   label="Create new phone number"
               />
               <label>Create new phone number</label>
           </div>
    )
  
  
    const phoneOptions = existingPhones? existingPhones.map(
        (existingPhone)=>({
            value:existingPhone,
            label: existingPhone.area_code+' '+existingPhone.phone_number
        })
    ):null

    const phoneTypeOptions = phoneTypes.map(
        (phoneType)=>({
            value:phoneType,
            label: phoneType.phone_type_name
        }))

    const handlePhoneTypeSelection = (selected)=>{
        phoneObj['phone_type'] = selected.value
    }

    const handleSelection = (selected)=>{
        console.log('handleSelection')
        //setPhoneObj(selected.value)
        phoneObj['selection'] = selected.value
        console.log(phoneObj)

        // clear out other fields
        phoneObj['area_code'] = null
        phoneObj['phone_number'] = null
        phoneObj['phone_type'] = null
        
    }
    
    const upddateAreaCode = (areaCode)=>{
        phoneObj['area_code'] = areaCode
        setAreaCode(areaCode)
        phoneObj['selection'] = null
    }

    const updatePhoneNumber = (phoneNumber)=>{
        phoneObj['phone_number'] = phoneNumber
        setPhoneNumber(phoneNumber)
        phoneObj['selection'] = null
    }
/*
    // Not being used right now, but may need it later
    const removeMe = ()=>{
        console.log('removeMe')
        console.log(this)
        removeFromElementList(this) // function passed in as parameter
    }
*/
    return (
        <div className="container">
        {isPrimary?(<h3>Applicant Phone Number</h3>):(<h3>Additional Phone Number</h3>)}
        {               existingPhones && existingPhones.length > 0? 
             ( 
                 // User may select from exisiting number or create one  
                 !checked?(
                     // User select from existing phone
                     <div>
                     <label>Select from existing phones:</label>
                     <Select
                        options={phoneOptions}
                        onChange={handleSelection}//{setSelectedPhone}     
                     /> 
                        <div>{checkBox}</div>
                     </div>
                 ):(
                     // User create new phonne
                     <div>
                     <label>Create new phone</label>
                     <div className="form-control">
                        <label>Area Code:</label>
                        <input type='text' placeholder="Area Code:" value={areaCode} onChange={(e)=> upddateAreaCode(e.target.value)} />
                     <div className="form-control">
                        <label>Phone Number:</label>
                        <input type='text' placeholder="Phone Number" value={phoneNumber} onChange={(e)=>updatePhoneNumber(e.target.value)} />
                    </div>
                    <div className="form-control">
                        <label>Phone Type:</label>
                        <Select
                            options={phoneTypeOptions} 
                            onChange={handlePhoneTypeSelection}
                        />
                    </div>
                    </div>
                        <div>{checkBox}</div>
                     </div>
                 )
             ):
             (
                 // user must create a new number
                     <div>
                     <h2>User creates new phone</h2>
                     <div className="form-control">
                        <label>Area Code:</label>
                        <input type='text' placeholder="Area Code:" value={areaCode} onChange={(e)=> upddateAreaCode(e.target.value)} />
                     <div className="form-control">
                        <label>Phone Number:</label>
                        <input type='text' placeholder="Phone Number" value={phoneNumber} onChange={(e)=>updatePhoneNumber(e.target.value)} />
                    </div>
                    <div className="form-control">
                        <label>Phone Type:</label>
                        <Select
                            options={phoneTypeOptions} 
                            onChange={handlePhoneTypeSelection}
                        />
                    </div>
                    </div>
                     </div>
             ) 
        }
        <div>
        {
        /* May need it for the future    
        !isPrimary? 
        <Button
            text='Remove'
            color='red'
            //onClick={removeMe}
        />
        :
        ""
        */
        }</div>
        </div>
    )
}

export default Phone