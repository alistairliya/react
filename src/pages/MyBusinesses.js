

import {useState, useEffect} from 'react'
import Booga from '../components/Header'
import Footer from '../components/Footer'
import Businesses from '../components/Businesses'
import NewBusiness from '../components/NewBusiness' 
import BusinessDetails from '../components/BusinessDetails'
//import About from '../components/About' 
import { useAuth } from "../hooks/useAuth";
import {ROOT_URL} from '../constants'
function MyBusinesses() {

    const { user } = useAuth();
  const [showAddBusiness, setShowAddBusiness] = useState(false)
  const [detailedBusiness, setDetailedBusiness] = useState(null) // for BusinessDetails
  const [refreshTrigger , setRefreshTrigger] = useState(0)

  const [businesses, setBusinesses] = useState(
    [/*
      {
        "id": 1,
        "business_type": ROOT_URL+"/api/businesstype/1/",
        "product": ROOT_URL+"/api/product/1/",
        "client": ROOT_URL+"/api/clients/1/",
        "status": ROOT_URL+"/api/businessstatus/1/",
        "projected_FYC": 1.0,
        "application_date": "2022-12-09",
        "application_location": "Kaohsiung",
        "created_by": "eugene",
        "created_date": "2022-12-09T13:22:00Z",
        "modified_date": "2022-12-09T13:22:00Z",
        "highlighted": false
      },
      {
        "id": 2,
        "business_type": ROOT_URL+"/api/businesstype/1/",
        "product": ROOT_URL+"/api/product/1/",
        "client": ROOT_URL+"/api/clients/1/",
        "status": ROOT_URL+"/api/businessstatus/1/",
        "projected_FYC": 2.0,
        "application_date": "2022-12-12",
        "application_location": "Vancouver",
        "created_by": "eugene",
        "created_date": "2022-12-12T15:52:00Z",
        "modified_date": "2022-12-12T15:52:00Z",
        "highlighted": false
      }*/
    ]
  )

  useEffect(()=>{
    const getBusinesses = async() => {
      const businessesFromServer = await fetchBusiness()
      //setBusinesses(businessesFromServer.reverse())      
      setBusinesses(businessesFromServer)      
    }
    getBusinesses()
    console.log("user:")
    console.log(user)
  }, [showAddBusiness, refreshTrigger])

  const fetchBusiness = async()=>{
    let headers = new Headers()
    const token = user['token']
    console.log('About to fetch with token '+token)
    //const auth_str = 'Basic '+btoa('test:test123!') 
    
    const auth_str = 'Token '+token 
    console.log(auth_str)
    headers.set('Authorization', auth_str)
    const res = await fetch(ROOT_URL+'/api/mybusiness/',{headers:headers})
    const data = await res.json()
    console.log(data)
    return data
  }

  // from Add Task example, 1:09:33
  const addBusiness = (business) => {
    const id = Math.floor(Math.random() * 10000) + 1
    console.log(id)
    console.log(business)
    const newBusiness = {id, ...business}
    setBusinesses([...businesses, newBusiness])
  }
  
  // from Delete Task in example, 52:31, deleteTask
  const editBusiness = (business) =>{
    console.log('edit '+business.id)
    setDetailedBusiness(business)
    //setBusinesses(businesses.filter((business)=>business.id!=id)) // example from deleting task 55:30
  }

  const closeBusinessDetailsComponent = () => {
    setDetailedBusiness(null)
  }

  // Using toggleReminder in example 57:53
  const toggleReminder = (id) => {
    console.log('toggle', id)
    setBusinesses(businesses.map((business)=>business.id === id? {...business, highlighted: !business.highlighted }: business))
  }

  const closeAddBusinessComponent = () => {
    setShowAddBusiness(false)
  }

  // Triggers a refresh of this component.
  const refreshBusinesses = () => {
    console.log('refreshing...')
    setRefreshTrigger(refreshTrigger+1)
  }

  return (
    <div className="container">
       <div>
        <a href="http://localhost:3000/me/dashboard">Dashboard</a>
        </div>
      <Booga 
        title='My Businesses'
        onAdd={()=>setShowAddBusiness(!showAddBusiness)}
        showAdd = {showAddBusiness}
      />
      {showAddBusiness && <NewBusiness onAdd={addBusiness} close={closeAddBusinessComponent} />}
      {detailedBusiness && <BusinessDetails business={detailedBusiness} closeComponent={closeBusinessDetailsComponent} refreshBusinesses={refreshBusinesses} />}
      {businesses.length > 0?(
        <Businesses 
          businesses = {businesses} 
          onEdit = {editBusiness} 
          onToggle={toggleReminder}
        /> 
      ):( 
        'No business to show'
      )}
      <Footer />
    </div>
  );
}

export default MyBusinesses;
