// rafce

import Button from "./Button"
import TextField from '@mui/material/TextField'
import {useState} from "react"

const BusinessDetailsApprove = ({setPopup, setButtonsDisabled, confirmed, displayFYC = true}) => {
    const [reason, setReason] = useState('')
    const [strSettledFYC, setStrSettledFYC] = useState('')

    const closePopup = () => {
        setPopup(false)
        setButtonsDisabled(false)
    }


    const handleApprove = () => {
        console.log('handleDecline')
        // submit to API
        setPopup(false)
        confirmed(reason, strSettledFYC)
        setButtonsDisabled(false)
    }

    const handleNotesChange = (e) => {
        console.log('handleNotesChange')
        console.log(e.target.value)
        //const { name, value } = e.target
        setReason(e.target.value)
    }

    const handleSettleFYCChange = (e) => {
        let { name, value } = e.target
        if(value.charAt(0) === '$'){
            value = value.substring(1)
        }
        let trailer = ''
        if(value.charAt(value.length-1) === '.'){
            console.log('setting trailer to period')
            trailer = '.'
        }
        value = parseFloat(value)
        if(isNaN(value)){
            console.log('NAN: '+value)
            setStrSettledFYC('')
        }else{
            console.log('Number ' + value)
            if(value.toString().indexOf('.')>=0)
                setStrSettledFYC(value)
            else
                setStrSettledFYC(value+trailer)
        }
    }

  return (
    <div>
        {displayFYC &&
        <div className="container">
                <TextField 
                    id="standard-basic" 
                    label="Settled FYC" 
                    variant="standard" 
                    name="SettledFYC"
                    onChange={handleSettleFYCChange}
                    disabled={false}
                    value={strSettledFYC? "$"+strSettledFYC:""}
                /> 
        </div>
        }
        <div>
            <TextField
                id="outlined-multiline-static"
                label="Notes"
                multiline    
                rows={4}
                name='myNotes'
                onChange={handleNotesChange}
            />
        </div>
        <div>
            <Button 
                text='Confirm' 
                onClick={handleApprove}
                disabled={displayFYC && !strSettledFYC} 
            />
            <Button 
                text='Cancelel' 
                onClick={closePopup} 
            />
        </div>
    </div>
  )
}

export default BusinessDetailsApprove