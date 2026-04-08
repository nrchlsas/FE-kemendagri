import {React } from 'react';
import { FormGroup, Label } from 'reactstrap';
import { useForm } from "react-hook-form";

const FormInput = ({dynamicForm,changeValue,dataMenu,dataRoles}) => {

    const {
        register,
      } = useForm();
    const{
        id,
        label,
        rules,
        defaultValue,
        type
        } = dynamicForm;
    const onChange = (e) =>{
        //console.log(val.target.checked)
        console.log(e.target.checked);
        console.log(e.target.value)
        changeValue(e)
    }

    const renderOptions = (id) => {
        if (id === "ddl_menu") {
            <option value="">Pilih Menu</option>
            return dataMenu.map((val, i) => (
                <option key={i} value={val.value}>{val.text}</option>
            ));
        } else {
            return dataRoles.map((val, i) => (
                <option key={i} value={val.value}>{val.text}</option>
            ));
        }
    };

    switch(type){
        case "text":
            return (
                <FormGroup key={label}>
                    <Label  htmlFor={id}>
                        {label}
                    </Label>
                    <input type={type}
                        {...register(id, {
                            onChange: (e) => onChange(e),
                        })} // assign ref prop
                        className="form-control"
                    />
                </FormGroup>
            )
        case "checkbox":
            return(
                <FormGroup key={label} check>
                    <input type={type}
                        {...register(id, {
                            onChange: (e) => onChange(e),
                        })} // assign ref prop
                        className="form-check-input"
                    />
                    <Label  htmlFor={id}>
                        {label}
                    </Label>
                </FormGroup>
            )
        case "select":
            return(
                <FormGroup key={label}>
                    <Label>
                        {label}
                    </Label>
                    <select 
                        id={id} 
                        {...register(id, {
                            onChange: (e) => onChange(e),
                        })}
                        className="form-select"
                    >
                        {renderOptions(id)}
                        

                    </select>
                </FormGroup>
            )
    }
};

export default FormInput;