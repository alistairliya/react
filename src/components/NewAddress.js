import Select from 'react-select' // https://react-select.com/home
import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import {ROOT_URL} from '../constants'

const NewAddress = ({onNextClicked, onPrevClicked, setAddress}) => {
    const {user} = useAuth()
    const [unitNumber, setUnitNumber] = useState('')
    const [streetAddress, setStreetAddress] = useState('')
    const [city, setCity] = useState('')
    const [postalCode, setPostalCode] = useState('') 
    const [countryOptions, setCountryOptions] = useState([])
    const [selecteddCountry, setSelectedCountry] = useState({})
    const [provinceOptions, setProvinceOptions] = useState([])
    const [selectedProvince, setSelectedProvince] = useState([])


    const onSubmit = (e) =>{
        e.preventDefault()
        
        setAddress({
            unit_number:unitNumber,
            street_address: streetAddress,
            city: city,
            postal_code: postalCode,
            province: selectedProvince,
            country: selecteddCountry,
            is_new_address: true
        })
        
        onNextClicked()
    }

  const previousClicked = (e) =>{
    e.preventDefault()
    onPrevClicked()
  }

    const fetchSomeList = async(what) =>{
        console.log('start fetchSomeList')
        let headers = new Headers()
        const token = user['token']
        const auth_str = 'Token '+token
        headers.set('Authorization', auth_str)
        let url = ROOT_URL+'/api/'+what+'/'
        const res = await fetch(url, {headers:headers})
        const data = await res.json()
        console.log('done fetchSomeList')
        return data

    }

    useEffect(()=>{
        const getCountryList = async () =>{
            const theCountryList = await fetchSomeList('country')
            console.log("The Country List:")
            console.log(theCountryList)
            setCountryOptions(
                theCountryList.map(
                    (country)=>(
                        {
                            value:country,
                            label:country.country_name
                        }
                    )
                    
                )
            )
            console.log("The country options:")
            console.log(countryOptions)
        }
        const getProvinceList = async () => {
            const theProvinceList = await fetchSomeList('province_state')
            setProvinceOptions(
               theProvinceList.map(
                (province)=>(
                    {
                        value:province,
                        label:province.province_state_name
                    }
                )
               ) 
            )

        }
        getProvinceList()
        getCountryList()
    },[])

    const handleCountrySelection=(selected)=>{
        setSelectedCountry(selected.value)
        setProvinceOptions(
            selected.value.provinces_states.map(
                (province)=>({
                    value:province,
                    label:province.province_state_name
                })
            )
        )
    }
    const handleProvinceSelection=(selected)=>{
        setSelectedProvince(selected.value)
    }

  return (
    <div>
        <div className="form-control">
            <label>Unit Number:</label>
            <input type='text' placeholder="Unit Number" value={unitNumber} onChange={(e)=> setUnitNumber(e.target.value)} />
        </div>
        <div className="form-control">
            <label>Street Address</label>
            <input type='text' placeholder="Street Address" value={streetAddress} onChange={(e)=>setStreetAddress(e.target.value)} />
        </div>
        <div className="form-control">
            <label>City</label>
            <input type='text' placeholder="City" value={city} onChange={(e)=>setCity(e.target.value)} />
        </div>
        <div className="form-control">
            <label>Province</label>
            <Select
                options={provinceOptions}
                onChange={handleProvinceSelection}
            />
        </div>
        <div className="form-contorl">
            <label>Country</label>
            <Select
                options={countryOptions}
                onChange={handleCountrySelection}
            />
        </div>
        <div className="form-control">
            <label>Postal Code</label>
            <input type='text' placeholder="Postal Code" value={postalCode} onChange={(e)=>setPostalCode(e.target.value)} />
        </div>
        <form className="add-form" onSubmit={onSubmit}>
            <input type='submit' value='Prev' className='btn btn-block' onClick={previousClicked} />
            <input type='submit' value='Next' className='btn btn-block-2' />
        </form>
    </div>
  )
}

export default NewAddress