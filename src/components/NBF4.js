// Phone Numbers

import Phones from './NBF4Phones.js'

import {useState, useEffect} from 'react'

const NBF4 = ({onNextClicked, onPrevClicked,onCreateClicked, setApplicantPhones, client, forInsured=false}) => {
    const [trigger, setTrigger] = useState(0) // https://timmousk.com/blog/react-call-function-in-child-component/
    const [sameAsApplicant, setSameAsApplicant] = useState(true)
    useEffect(()=>{
        console.log('useEffect in NBF4.js')
        setTrigger(0)
    },[setTrigger])

    const previousClicked = (e) =>{
      e.preventDefault()
      onPrevClicked()
    }

    const onSubmit = (e) =>{
        e.preventDefault()
        console.log('Create pressed')
        setTrigger((trigger) => trigger + 1)
        //onNextClicked()
        //onCreateClicked()
        if (forInsured)
            onCreateClicked()
        else if(!forInsured){
          if(sameAsApplicant)
            onCreateClicked()
          else
            onNextClicked()
        }
    }



    const insuredInfo = (
      <div className='container'>
        <h3>Insured Information</h3>     
            <input 
                   type="checkbox"
                   checked={sameAsApplicant}
                   onChange={()=>setSameAsApplicant(!sameAsApplicant)}
               />
               <label>Same as Applicant</label>
               <form>
                <input type='submit' value='Create Application' disabled={!sameAsApplicant} className='btn btn-block-4' onClick={onSubmit} />
               </form>
      
      </div>
    )    

    return (
    <div>
      <h2>New Business Form -  {forInsured? ('Insured Contact'):('Applicant Contact')} </h2>
      <Phones setApplicantPhones={setApplicantPhones} trigger = {trigger}  existingPhones = {client.phone_list}/>
      {!forInsured && insuredInfo}
      <form className="add-form" onSubmit={onSubmit}>
            <input type='submit' value='Prev' className='btn btn-block' onClick={previousClicked} />
            <input type='submit' value={forInsured? 'Create Application':'Next'} className={forInsured?'btn btn-block-4': 'btn btn-block-2'}  disabled={sameAsApplicant && !forInsured}/>
      </form>
    </div>
  )
}

export default NBF4

// Next Up: Insurnace Information
// Provider, plan type, ...etc