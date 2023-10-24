import Phone from './NBF4PhonesPhone.js'
import {useState, useEffect} from 'react'
import Button from './Button'
import { useAuth } from "../hooks/useAuth"
import React from 'react'
import {ROOT_URL} from '../constants'
/**
 * Two problems:
 * 1. Adding new phone number wipes out previous seleciton.
 * 2. Two phoneObj's are created.
 * 
 * Feb 22 to Feb 23 broke the part about adding new phone number wipes out previous. 
 * 
 */

const Phones = ({setApplicantPhones,  existingPhones}) => {
    const [phoneElementList, setPhoneElementList] = useState([])
    const [phoneTypes, setPhoneTypes] = useState([])
    const [key, setKey] = useState(0)
    const [phoneObjs, setPhonesObjs] = useState([])
    const {user} = useAuth()

    /*
    // Not used now. May need it in the future.
    const removePhoneElement = (phoneElement) =>{
        console.log('removePhoneElement')
        console.log(phoneElement)
        console.log(phoneElementList)
        //const newArray = phoneElementList.filter((element)=>element!==phoneElement)
        //console.log(newArray)
        //setPhoneElementList(newArray)
        //setPhoneElementList(phoneElementList.filter((element)=>element!==phoneElement))
        //setPhoneElementList(old => old.filter((element)=>element!==phoneElement))
    }*/
    
    const addAnotherPhone = ()=>{
        let phoneObj = {}
        setPhoneElementList(old => [...old, <Phone phoneObj={phoneObj} key={key} id={key.toString()}   existingPhones = {existingPhones} phoneTypes={phoneTypes} />])
        console.log(phoneElementList)
        setPhonesObjs(old => [...old, phoneObj])
        setKey(key+1)
    }
    // https://stackoverflow.com/questions/54069253/the-usestate-set-method-is-not-reflecting-a-change-immediately
    useEffect(()=>{
        const fetchPhoneTypes = async() =>{
            let headers = new Headers()
            const token = user['token']
            const auth_str = 'Token '+token
            headers.set('Authorization', auth_str)

            const res = await fetch(ROOT_URL+'/api/phonetype/', {headers:headers})
            const data = await res.json()
            //setPhoneElementList([<Phone key='x' addPhone = {addPhone} existingPhones = {existingPhones} phoneTypes={data}/>])
            return data
        } 
        console.log('useEffect 1 in NBF4Phones.js')
        const getPhoneTypes = async () =>{
            const thePhoneTypes = await fetchPhoneTypes()
            setPhoneTypes(thePhoneTypes)
            // set the first phone element
            if(phoneElementList.length === 0 && phoneObjs.length === 0){
                console.log('Adding the first phoneObj to phoneObjs')
                let phoneObj = {}
                setPhoneElementList([<Phone phoneObj = {phoneObj} key='x'  id='x'   existingPhones = {existingPhones} phoneTypes={thePhoneTypes} isPrimary = {true}/>])
                setPhonesObjs([phoneObj])
            }else{
                console.log('phoneObjs: ')
                console.log(phoneObjs)
                // When the user clicks on Next button.
                setApplicantPhones(phoneObjs)
            }
        }
        getPhoneTypes()

    },[ phoneElementList, existingPhones,user, phoneObjs, setApplicantPhones])

    useEffect(()=>{
        console.log('useEffect 2 in NBF4Phones.js')
    },[key, phoneElementList])

    return (
    <div>
        {
        phoneElementList.map(
            (phoneElement)=>{
                return phoneElement
            }
        )
        }
    </div>
  )
}

export default Phones