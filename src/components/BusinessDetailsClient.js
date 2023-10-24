
// First Name
// Middle Name
// Last Name
// Birth Date
// Gender
// SIN
// Edit Button

import {useEffect, useState} from "react"
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'

const BusinessDetailsClient = ({title, client, collectPayload, writeAccess}) => {
    const [editMode, setEditMode] = useState(false)
    const [myClient, setMyClient] = useState({})
    const [myLastName , setMyLastName] = useState('Last')
    const [myFirstName , setMyFirstName] = useState('First')
    const [myMiddleName , setMyMiddleName] = useState('Middle')
    const [myBirthDate , setMyBirthDate] = useState('Birth Date')
    const [myGender, setMyGender] = useState('')
    const [mySIN, setMySIN] = useState('')
    const [backgroundColor, setBackgroundColor] = useState('white');
    const [updatePayload, setUpdatePayload] = useState({})

    useEffect(()=>{
        //console.log('#######################################')
        console.log('### BusinessDetailsClient useEffect ###')
        console.log(client)
        setMyClient(client)
        if(client && !editMode){
          setMyLastName(client.last_name)
          setMyFirstName(client.first_name)
          setMyMiddleName(client.middle_name)
          setMyBirthDate(client.birthdate)
          if(client.gender)
            setMyGender(client.gender)
          setMySIN(client.sin)
        }
        if(editMode){
          console.log('EDIT MODE')
          setBackgroundColor('lightblue')
          collectPayload('client', {...updatePayload, id:client.id})
        }
        //console.log("^^^ BusinessDetailsClient useEffect")
        //console.log('#######################################')
    },[myLastName, myClient, client, editMode, updatePayload])


    const handleChange = (event) => {
      setEditMode(true)
      const { name, value } = event.target
      console.log('handleChange')
      console.log(event.target.value)
      console.log(name)
      /*
      if(name === 'myFirstName'){
        console.log('set MyFirstName')
        setMyFirstName(event.target.value);
      }*/
      switch(name){
        case 'myFirstName':
          setMyFirstName(value)
          setUpdatePayload({...updatePayload, first_name: value})
          break
        case 'myMiddleName':
          setMyMiddleName(value)
          setUpdatePayload({...updatePayload, middle_name: value})
          break
        case 'myLastName':
          setMyLastName(value)
          setUpdatePayload({...updatePayload, last_name: value})
          break
        case 'myBirthDate':
          setMyBirthDate(value)
          setUpdatePayload({...updatePayload, birthdate: value})
          break
        case 'mySIN':
          setMySIN(value)
          setUpdatePayload({...updatePayload, sin: value})
          break
        case 'myGender':
          setMyGender(value)
          setUpdatePayload({... updatePayload, gender:value})
          break
        default:
          console.log('default')
      }
    }

    // https://mui.com/material-ui/react-text-field/
    return (
    <div  style={{backgroundColor}}>
        <h2>{title}</h2>   
        <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    > 
        <div>        
          <TextField 
                 
            id="standard-basic" 
            label="First Name" 
            variant="standard" 
            value={myFirstName}
            name="myFirstName"
            onChange={handleChange}
            disabled={!writeAccess}
          /> 
          <TextField 
            id="standard-basic" 
            label="Middle Name" 
            variant="standard" 
            value={myMiddleName}
            name="myMiddleName"
            onChange={handleChange}
            disabled={!writeAccess}
          /> 
          <TextField 
            id="standard-basic" 
            label="Last Name" 
            variant="standard" 
            value={myLastName}
            name="myLastName"
            onChange={handleChange}
            disabled={!writeAccess}
          /> 
        </div>
        <div>
          <TextField 
            id="standard-basic" 
            label="Birth Date" 
            variant="standard" 
            value={myBirthDate}
            name="myBirthDate"
            onChange={handleChange}
            disabled={!writeAccess}
          /> 
        </div>
        <div>
          <TextField 
            id="standard-basic" 
            label="SIN" 
            variant="standard" 
            value={mySIN}
            name="mySIN"
            onChange={handleChange}
            disabled={!writeAccess}
          /> 
        </div>
        <div>
          <TextField 
            id="standard-basic" 
            label="Gender" 
            variant="standard" 
            value={myGender}
            name="myGender"
            onChange={handleChange}
            disabled={!writeAccess}
          /> 

        </div>
        </Box>

    </div>
  )
}

export default BusinessDetailsClient