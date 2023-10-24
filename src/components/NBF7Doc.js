// Purpose: Display a single document from the NBF7 collection
// checkbox for submitted - Done
// textbox for notes, such as where the doc is stored. - Done
// allows user to upload a document - will come back to it!


import { useEffect, useState } from "react"
import Tooltip from "@mui/material/Tooltip"
import Checkbox from "@mui/material/Checkbox"
const NBF7Doc = ({id, item, collect}) => {
    const [checked, setChecked] = useState(false);
    const [notes,  setNotes] = useState('');
    const handleChange = (event) => {
        console.log(event.target.checked)
        setChecked(event.target.checked);
        //collect()
        collect(id, {'name' : item.document_name, 'selected': event.target.checked, 'notes': notes})
    };

    const handleTextAreaChange = (event) => {
        console.log(event.target.value)
        setNotes(event.target.value);
        //collect()
        collect(id, {'name' : item.document_name, 'selected':checked, 'notes': event.target.value})
    }
    useEffect(()=>{
        console.log('NBF7Doc useEffect: '+id)
    } ,[id])

    const label = {}
  return (
    <div>
        {<div>
            <table>
                <tbody >
                <tr>
                <td >
                <Checkbox
                    checked={checked}
                    onChange={handleChange}
                    {...label} 
                />
                </td>
                <td width={"50%"}>
                <Tooltip title={item.description}>
                    <label>{item.document_name}</label>
                </Tooltip>
                </td>
                <td>
                <Tooltip title='Notes'>
                <textarea 
                    value={notes} 
                    onChange={handleTextAreaChange}
                /></Tooltip>
                </td>
            </tr>
            </tbody>
            </table>
        </div>
        }
    </div>
  )
}

export default NBF7Doc