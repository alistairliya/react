// Client First and Last Name

import { useState } from 'react'
import {TEST} from '../constants'

const NBF1 = ({onAdd, setClient, onNextClicked, onPrevClicked, forInsured=false}) => {
    const [lastName, setLastName] = useState('')
    const [firstName, setFirstName] = useState('')

    const onSubmit = (e) =>{
        e.preventDefault() // avoiding submitting to a page.
        // some validation
        if(!lastName){
            alert('Please add Last Name')
            return
        }
        //setClient({lastName:lastName, firstName:firstName})
        setClient({search_last_name:lastName, search_first_name:firstName})
        onNextClicked()

        //onAdd({lastName, firstName})
        //setLastName('')
        //setFirstName('')


    }

    const previousClicked = (e) =>{
        e.preventDefault()
        console.log('previousClicked')
        onPrevClicked()
      }

    return (
    <form className="add-form" onSubmit={onSubmit}>
        <h2>New Business Form - {forInsured? ('Insured Information'):('Applicant Information')}</h2>
        <div className="form-control">
            <label>Last Name</label>
            <input type='text' placeholder="Client's Last Name" value={lastName} onChange={(e)=>setLastName(e.target.value)} />
        </div>
        <div className="form-control">
            <label>First Name</label>
            <input type='text' placeholder="Client's First Name" value={firstName} onChange={(e)=>setFirstName(e.target.value)} />
        </div>
        {forInsured && <input type='submit' value='Prev' onClick={previousClicked} className='btn btn-block'></input>}
        <input type='submit' value='Next' className='btn btn-block-2' />
    </form>
  )
}

export default NBF1