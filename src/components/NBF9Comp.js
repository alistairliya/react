// Purpose: Display a single entity from the NBF9 collection


import { useEffect, useState } from "react"
import Tooltip from "@mui/material/Tooltip"
import Checkbox from "@mui/material/Checkbox"
const NBF9Comp = ({id, item, collect}) => {
    const [checked, setChecked] = useState(false);
    const [notes,  setNotes] = useState('');
    const handleChange = (event) => {
        console.log(event.target.checked)
        setChecked(event.target.checked);
        //collect()
        collect(id, {'id':id,  'name' : item.compliance_entity_name, 'selected': event.target.checked, 'notes': notes})
    };

    const handleTextAreaChange = (event) => {
        console.log(event.target.value)
        setNotes(event.target.value);
        //collect()
        collect(id, {'name' : item.compliance_entity_name, 'selected':checked, 'notes': event.target.value})
    }
    useEffect(()=>{
        console.log('NBF9Comp useEffect: '+id)
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
                <td width={"80%"}>
                <Tooltip title={item.compliance_entity_name}>
                    <label>{item.compliance_entity_name}</label>
                </Tooltip>
                </td>
                <td>
                <Tooltip title={item.description}>
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

export default NBF9Comp