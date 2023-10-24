import {useState, useEffect} from 'react'
import Select from 'react-select' // https://react-select.com/home
import Button from './Button'

const NewClient = ({client, onNextClicked, onPrevClicked, setClient, disabled}) => {

  const [lastName, setLastName] = useState(client.search_last_name)
  const [firstName, setFirstName] = useState(client.search_first_name)
  const [middleName, setMiddleName] = useState(client.middle_name)
  const [birthDate, setBirthDate] = useState(client.birthdate)
  const [sin, setSin] = useState(client.sin)
  const [gender, setGender] = useState(client.gender)
  const [selectedGender, setSelectedGender] = useState()

  useEffect(()=>{
    console.log('NewClient.js')
    console.log('NewClinet onNextClicked:')
    console.log(onNextClicked)
    console.log(client)
    console.log("selected gender "+ client.gender)
    //console.log(onNextClicked)
    //console.log(setClient)
    if(client.gender && client.gender === 'M'){
      setSelectedGender({value:'M', label:'Male'})
    }
    if(client.gender && client.gender === 'F'){
      setSelectedGender({value:'F', label:'Female'})
    }
    //console.log(selectedGender)

  },[])

  const onSubmit = (e) =>{
      e.preventDefault() // avoiding submitting to a page.
      setClient({last_name:lastName, first_name:firstName, middle_name:middleName, gender:gender, sin:sin, birthdate:birthDate, is_new_client:true, search_first_name:client.search_first_name, search_last_name:client.search_last_name})
      onNextClicked()
  }

  const handleChange=(e)=>{
    console.log(e)
    setGender(e.value)
    if(e.value === 'M')
        setSelectedGender({value:'M', label:'Male'})
    if(e.value === 'F')
        setSelectedGender({value:'F', label:'Female'})


  }

  const previousClicked = (e) =>{
    e.preventDefault()
    onPrevClicked()
  }

  return (
    <form className="add-form" onSubmit={onSubmit}>
        <div className="form-control">
            <label>Last Name</label>
            <input type='text' placeholder="Client's Last Name" value={lastName} onChange={(e)=>setLastName(e.target.value)} />
        </div>
        <div className="form-control">
            <label>Middle Name</label>
            <input type='text' placeholder="Client's Middle Name" value={middleName} onChange={(e)=>setMiddleName(e.target.value)} />
        </div>
        <div className="form-control">
            <label>First Name</label>
            <input type='text' placeholder="Client's First Name" value={firstName} onChange={(e)=>setFirstName(e.target.value)} />
        </div>
        <div className="form-control">
            <label>Birth Date</label>
            <input type='date'  value={birthDate} onChange={(e)=>setBirthDate(e.target.value)} />
        </div>
        <div className="form-control">
            <label>Social Insurance Number</label>
            <input type='text'  value={sin} onChange={(e)=>setSin(e.target.value)} />
        </div>
        <div className="form-control">
        <label>Gender</label>
          <Select value={selectedGender} options={[{value:'M',label:'Male'},{value:'F', label:'Female'}]} onChange={handleChange} />
        </div>
        <input type='submit' value='Prev' className='btn btn-block' onClick={previousClicked} />
        <input type='submit' value='Next' className='btn btn-block-2' />
    </form>
  )
}

export default NewClient