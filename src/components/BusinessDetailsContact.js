
import {ROOT_URL} from '../constants'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import {useEffect, useState} from "react"
import { useAuth } from "../hooks/useAuth"
// address and phone are urls
const BusinessDetailsContact = ({title, address, phone, collectPayload, writeAccess}) => {
    const { user } = useAuth()
    const [myAddress, setMyAddress] = useState(null)
    const [myPhone, setMyPhone] = useState(null)
    const [countries, setCountries] = useState(null)
    const [provinces, setProvinces] = useState(null)
    const [editMode, setEditMode] = useState(false)
    const [backgroundColor, setBackgroundColor] = useState('white');
    const [updatePayload, setUpdatePayload] = useState({})

    useEffect(()=>{

        const getAddress = async () => {
            let a = await fetchObject(address)
            a.province_state = await fetchObject(a.province_state)
            a.country = await fetchObject(a.country)
            
            return a
        }
        const getPhone = async () => {
            let p = await fetchObject(phone)
            return p
        }

        const getAvailableCountries = async () => {
            const url = ROOT_URL+'/api/country/'
            let countriesResults = await fetchObject(url)
            let countries = countriesResults['results']
            
            
            return countries
        }

        const getAvailableProvinces = async () => {
            const url = ROOT_URL+'/api/province_state/'
            let provincesResults = await fetchObject(url)
            const provinces = provincesResults['results']
            return provinces
        }

        if(!editMode){
        getAddress().then((a)=>{
            setMyAddress(a)
            
        })
        getPhone().then((p)=>{
            setMyPhone(p)
            
        })
        getAvailableCountries().then((c)=>{
            setCountries(c)
        })

        getAvailableProvinces().then((p)=>{
            setProvinces(p)
        })
      }
        if(editMode){
          setBackgroundColor('lightblue')
          collectPayload('contact', {...updatePayload, phone_id:myPhone.id, address_id:myAddress.id})
        }

    }, [address, phone, editMode, updatePayload])

    const fetchObject = async (url) =>{
        let headers = new Headers()
        const token = user['token']
        const auth_str = 'Token '+token
        headers.set('Authorization', auth_str)
        const res = await fetch(url,{headers:headers})
        const data = await res.json()
        return data
    }

    const handleChange = (event) => {
      setEditMode(true)
      const { name, value } = event.target

      switch(name){
        case 'myStreetAddress':
          setMyAddress({...myAddress, street_address:value})
          setUpdatePayload({...updatePayload, street_address:value})
          break
        case 'myUnit':
          setMyAddress({...myAddress, unit_number:value})
          setUpdatePayload({...updatePayload, unit:value})
          break
        case 'myCity':
          setMyAddress({...myAddress, city:value})
          setUpdatePayload({...updatePayload, city:value})
          break
        case 'myProvince':
          setMyAddress({...myAddress, province_state:{id:value}})
          setUpdatePayload({...updatePayload, province_state_id:value})
          break
        case 'myCountry':
          setMyAddress({...myAddress, country:{id:value}})
          setUpdatePayload({...updatePayload, country_id:value})
          break
        case 'myAreaCode':
          setMyPhone({...myPhone, area_code:value})
          setUpdatePayload({...updatePayload, area_code:value}) 
          break
        case 'myPhoneNumber':
          setMyPhone({...myPhone, phone_number:value})
          setUpdatePayload({...updatePayload, phone_number:value})
          break
        default:
          break
      }


    }

    const countryOptions = ['Canada', 'USA'];

    return (
    <div style={{backgroundColor}}>
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
            label="Street Address" 
            variant="standard" 
            value={myAddress ? myAddress.street_address : ''}
            name="myStreetAddress"
            onChange={handleChange}
            disabled={!writeAccess}
          /> 
          <TextField 
            id="standard-basic" 
            label="Unit" 
            variant="standard" 
            value={myAddress ? (myAddress.unit_number?myAddress.unit_number:"") : ''}
            name="myUnit"
            onChange={handleChange}
            disabled={!writeAccess}
          /> 
          <TextField 
            id="standard-basic" 
            label="City" 
            variant="standard" 
            value={myAddress ? myAddress.city : ''}
            name="myCity"
            onChange={handleChange}
            disabled={!writeAccess}
          /> 
        </div>
        <div> 
        <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Province</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="province-simple-select"
          value={myAddress? myAddress.province_state.id:''}
          label="Province"
          name='myProvince'
          onChange={handleChange}
          disabled={!writeAccess}
        >
        
          {provinces?provinces.map((province_state) => (
          <MenuItem key = {province_state.id} value={province_state.id}>
            {province_state.province_state_name}
          </MenuItem>
        )):''}
        
        </Select>
        </FormControl>
        </div>

        <br></br>
        <div>
        <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Country</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={myAddress? myAddress.country.id:''}
          label="Country"
          name='myCountry'
          onChange={handleChange}
          disabled={!writeAccess}
        >
          {countries?countries.map((country) => (
          <MenuItem key={country.id} value={country.id}>
            {country.country_name}
          </MenuItem>
        )):''}
        </Select>
        </FormControl>
        </div>

          
        <div>
          <TextField 
            id="standard-basic" 
            label="Area Code" 
            variant="standard" 
            value={myPhone ? myPhone.area_code : ''}
            name='myAreaCode'
            onChange={handleChange}
            disabled={!writeAccess}
          /> 
          <TextField 
            id="standard-basic" 
            label="Phone Number" 
            variant="standard" 
            value={myPhone? myPhone.phone_number : ''}
            name='myPhoneNumber'
            onChange={handleChange}
            disabled={!writeAccess}
          /> 
        </div>
        </Box>

    </div>
  )
}

export default BusinessDetailsContact