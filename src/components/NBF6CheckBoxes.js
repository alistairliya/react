import { useEffect, useState } from "react"
import Tooltip from "@mui/material/Tooltip"
import Checkbox from "@mui/material/Checkbox"
const NBF6CheckBoxes = ({id, item, collect}) => {

    const [checked, setChecked] = useState(false);

    const handleChange = (event) => {
        console.log(event.target.checked)
        setChecked(event.target.checked);
        //collect()
        collect(id, {'name' : item.medical_name, 'selected': event.target.checked})
    };

  useEffect(()=>{
    console.log('NBF6CheckBoxes useEffect')
   } ,[])

   const label = {}// { inputProps: { 'aria-label': 'controlled' } };
    return (
    <div>
        {<div>
                <Checkbox
                    checked={checked}
                    onChange={handleChange}
                    {...label} 
                />
                
            <Tooltip title={item.description}>
                <label>{item.medical_name}</label>
            </Tooltip>
        </div>
        }
    </div>
  )
}

export default NBF6CheckBoxes