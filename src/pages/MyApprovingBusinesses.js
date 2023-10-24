// 2023-06-06 Start working on approval button


import {useState, useEffect} from 'react'
import Booga from '../components/Header'
import Footer from '../components/Footer'
import Businesses from '../components/Businesses'
import NewBusiness from '../components/NewBusiness' 
import BusinessDetails from '../components/BusinessDetails'
//import About from '../components/About' 
import { useAuth } from "../hooks/useAuth";
import Select from 'react-select' // https://react-select.com/home
import { AiFillCodeSandboxSquare } from 'react-icons/ai'
import {ROOT_URL} from '../constants'

function MyApprovingBusinesses() {

    const { user } = useAuth();
  const [showAddBusiness, setShowAddBusiness] = useState(false)
  const [detailedBusiness, setDetailedBusiness] = useState(null) // for BusinessDetails
  const [refreshTrigger , setRefreshTrigger] = useState(0)

  const [businesses, setBusinesses] = useState([])
  const [showingStatus, setShowingStatus] = useState('ALL') // all, approved, declined

  useEffect(()=>{
    console.log('useEffect in MyApprovinngBusinesses.js')
    const getBusinesses = async() => {
        console.log('getBusinesses in MyApprovingBusinesses.js useEffect')
      const businessesFromServer = await fetchBusiness()
      setBusinesses(businessesFromServer.reverse())      
    }
    getBusinesses()
  }, [refreshTrigger, showingStatus])



  // curl -H 'Authorization: Token 9af7ed53fa7a0356998896d8224e67e65c8650a3' -H 'Content-Type: application/json' http://127.0.0.1:8000/api/businessapproval/
  const fetchBusiness = async()=>{
    let headers = new Headers()
    const token = user['token']
    console.log('About to fetch with token '+token)
    //const auth_str = 'Basic '+btoa('test:test123!') 
    
    const auth_str = 'Token '+token 
    console.log(auth_str)
    headers.set('Authorization', auth_str)
    const res = await fetch(ROOT_URL+'/api/businessapproval/',{headers:headers})
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

    // Triggers a refresh of this component.
    const refreshBusinesses = () => {
        console.log('refreshing...')
        setRefreshTrigger(refreshTrigger+1)
    }
    
    // Hack this for now
      const statusMap = {
        'PENDING':ROOT_URL+'/api/businessstatus/2/',
        'REVIEW':ROOT_URL+'/api/businessstatus/1/',
      }
    const filterSelection = (business) =>{
        if (showingStatus === 'ALL') {
            return true
        } else if (showingStatus === 'PENDING') {
            return business.status === statusMap['PENDING'] 
        } else if (showingStatus === 'REVIEW') {
            return business.status === statusMap['REVIEW']
        }
        return false
    }


    const options = [
      { value: 'ALL', label: 'ALL' },
      { value: 'PENDING', label: 'PENDING' },
      { value: 'REVIEW', label: 'REVIEW' }
    ]

  return (
    <div className="container">


        <div>
        <a href="http://localhost:3000/me/dashboard">Dashboard</a>
        </div>

              <header className='header'>
            <h2>Submitted Business</h2>
        </header>
      {detailedBusiness && <BusinessDetails business={detailedBusiness} closeComponent={closeBusinessDetailsComponent} refreshBusinesses={refreshBusinesses} forApproval={true}/>}
        <div>
        <Select options={options} onChange={(e)=>setShowingStatus(e.value)} />
        </div>
      {businesses.length > 0?(
        <Businesses 
          businesses = {businesses.filter(filterSelection)} 
          onEdit = {editBusiness} 
          onToggle={toggleReminder}
          showDeclined = {false}
        /> 
      ):( 
        'No business to show'
      )}
      <Footer />
    </div>
  );
}

export default MyApprovingBusinesses;
