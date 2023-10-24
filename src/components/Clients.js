import Select from 'react-select' // https://react-select.com/home
import {useState} from 'react'
//import Button from "@mui/material/Button"
import NewClient from './NewClient'
import Button from './Button'

const Clients = ({clients, client, setClient, onNextClicked, onPrevClicked}) => {
    
    const [checked, setChecked] = useState(false)
    const [clientId, setClientId] = useState()

    const clientOptions = clients.map(
        (client)=>({
            value:client,//client.id,
            label: client.last_name + ', '+client.first_name+' (SIN:'+client.sin+')'
        })
    )

    const handleChange = ()=>{
        setChecked(!checked)
    }
    const buttonClicked = ()=>{
        console.log(clientId)
        
        //setClient({clientId:clientId})
        onNextClicked()
    }

    const onSubmit = (e) =>{
        e.preventDefault()
        onNextClicked()
    }
  
    const previousClicked = (e) =>{
        e.preventDefault()
        onPrevClicked()
    }

    const handleSelection = (selected)=>{
        console.log('handleSelection')
        console.log(selected)
        setClientId(selected.value)
        let value = selected.value
        value.search_first_name = client.search_first_name
        value.search_last_name = client.search_last_name
        //setClient(selected.value)
        setClient(value)
    }

  return (
    <div>
        {!checked && (
        <div>
            <label>Select from existing clients:</label>
            <Select 
                options={clientOptions} 
                disabled={true}
                onChange={handleSelection}
            />
            <form onSubmit={onSubmit}>
            <input type='submit' value='Prev' className='btn btn-block' onClick={previousClicked} />
            <input type='submit' value='Next' className='btn btn-block-2' />  
            </form>
        </div>
        )}
        {checked && <div><NewClient setClient={setClient} onNextClicked={onNextClicked} onPrevClicked={onPrevClicked} client={client}></NewClient></div>}
        <div>
            <label>
                <input 
                    type="checkbox"
                    checked={checked}
                    onChange={handleChange}
                />
                Create new client
            </label>
        </div>
    </div>
  )
}

export default Clients