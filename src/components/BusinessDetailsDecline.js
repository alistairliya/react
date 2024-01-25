// rafce

import Button from "./Button"
import TextField from '@mui/material/TextField'
import {useState} from "react"

const BusinessDetailsDecline = ({setDeclinePopup, setApprovalButtonDisabled, declineConfirmed}) => {

    const [reason, setReason] = useState('')

    const closePopup = () => {
        setDeclinePopup(false)
        setApprovalButtonDisabled(false)
    }


    const handleDecline = () => {
        // submit to API
        setDeclinePopup(false)
        declineConfirmed(reason)
        setApprovalButtonDisabled(false)
    }

    const handleReasonChange = (e) => {
        //const { name, value } = e.target
        setReason(e.target.value)
    }

  return (
    <div>
        <div>
            <TextField
                id="outlined-multiline-static"
                label="Reason"
                multiline    
                rows={4}
                name='myReason'
                onChange={handleReasonChange}
            />
        </div>
        <div>
            <Button text='Confirm' onClick={handleDecline} />
            <Button text='Cancelel' onClick={closePopup} />
        </div>
    </div>
  )
}

export default BusinessDetailsDecline