
import {useEffect, useState, useRef} from "react"
import { useAuth } from "../hooks/useAuth"
import Button from './Button'
import {ROOT_URL} from '../constants'

const BusinessDetailsFP = ({docName, business, refreshBusinesses, forApproval=false, writeAccess}) => {
    const [file, setFile] = useState(null) // file ready for upload
    const [fileUploadResult, setFileUploadResult] = useState(null)
    const [fileData, setFileData] = useState(business.files)// uploaded files for the business
    const [fileIndex, setFileIndex] = useState(-1) // index of the file to be uploaded
    const { user } = useAuth()
    const fileInputRef = useRef(null);

    
    const fetchFromAPI = async(resource) =>{
        let headers = new Headers()
        const token = user['token']
        const auth_str = 'Token '+token
        headers.set('Authorization', auth_str)
        const url = ROOT_URL+'/api/'+resource+'/'
        const res = await fetch(url, {headers:headers})
        const data = await res.json()
        return data
    }
        const getFileData = async () =>{
            let resource = ""
            if(forApproval){
                resource = 'businessapproval/'+business.id              
            }else{
                resource = 'mybusiness/'+business.id
            }

            const businessData = await fetchFromAPI(resource)
            const fileData = businessData['files']
            setFileData(fileData)
            business.files = fileData
        }

    useEffect(()=>{
        setFileIndex(-1)

        //getFileData()
        setFileData(business.files)
        for(let i=0; i<business.files.length; i++){
            if(business.files[i].remark === docName){
                setFileIndex(i)
            }
        }
        //if(file) // reset if file has a value
        //    setFile(null)
        setFileUploadResult("")
    
    }, [file, business, fileIndex, fileData])

    const handleFileChange = (event) => {
        //event.preventDefault()
        const files = event.target.files;

        if(files && files[0] && files[0].type !== 'application/pdf'){
            alert('Only PDF files are allowed')
            setFile(null)
            return
        }else if(files){
            setFile(files[0])
        }
    }

    const handleUpload = async (event) =>{
        // Sample Upload:
        // curl -X POST -F "file=@/Users/eugenelin/dev_insure/myproject/readme.txt" -F "remark=foobar2" http://127.0.0.1:8000/file/upload/
        const postToFileUpload = async () =>{
            
            let headers = new Headers()
            const token = user['token']
            const auth_str = 'Token '+token
            headers.set('Authorization', auth_str)
            //headers.set('Content-Type', 'application/json')
            const formData = new FormData()
            formData.append('file', file)
            formData.append('remark', docName)
            formData.append('businessId', business.id)
            //const res = await fetch(ROOT_URL+'/file/upload/',{
            const res = await fetch(ROOT_URL+'/api/files/upload_file/',{
                method:'POST',
                body: formData,
                headers: headers
            })
            const data = await res.json()
            return data
        }
        setFileUploadResult('Uploading...')
        const uploadResult = await postToFileUpload()
        if(uploadResult['id']){
            setFileUploadResult('Upload Success')
            getFileData()
            fileInputRef.current.value = ''
            setFile(null)
            refreshBusinesses()
        } 
    }

    const showFileDetails = () =>{
        //const original_filename = fileData[fileData.length - 1].original_filename
        const original_filename = fileData[fileIndex].original_filename
        //const utcString = fileData[fileData.length - 1].timestamp
        const utcString = fileData[fileIndex].timestamp
        const localDateTimeString = new Date(utcString).toLocaleString();
        
        //const url = fileData[fileData.length - 1].file
        const url = fileData[fileIndex].file
        const viewFP = () =>{
            window.open(url, '_blank', 'fullscreen=yes')
        }
        const result = 
        <div>
            <div>Latest Uploaded File: {original_filename}</div>
            <div>Updloaded on: {localDateTimeString}</div>
            <Button 
                text='View File' 
                color='steelblue'
                onClick={viewFP} 
            />
        </div>
        return result 
    }


  return (
    <div className='container'>
        <h2>{docName?docName:'First Page'}</h2>
        {fileData&&fileData.length > 0 && fileIndex > -1?showFileDetails():"No Uploaded File"}
<br/>
        <h3>Upload:</h3>
        <input type="file" onChange={handleFileChange} className='btn' ref={fileInputRef} disabled={!writeAccess} />
        <div>
        {file && 
        <Button
            text='Upload File'
            color='steelblue'
            onClick={handleUpload}
        />
        }</div>


        {fileUploadResult && <div>{fileUploadResult}</div>}
    </div>
  )
}

export default BusinessDetailsFP