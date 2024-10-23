import FormInput from "./FormInput"
import {Controller,useForm } from "react-hook-form"
import {FormGroup} from "reactstrap"

const FormBuilder =({dynamicForm})=>{
    const {
        control
    } = useForm();
    
    const { id,rules, defaultValue, label } = dynamicForm;
    console.log('ids',id);
    return (
          <FormGroup key={label}>
            <label>{label}</label>
            <Controller
              name={id}
              control={control}
              rules={rules}
              defaultValue={defaultValue}
              render={({ field }) => {
                console.log(field)
                return(
                
                <div>
                  <FormInput
                    id={id}
                    value={"field.value"}
                    onChange={field.onChange}
                    {...dynamicForm}
                  />
                </div>
              )}}
            />
            
          </FormGroup>
    );
    
} 

export default FormBuilder;