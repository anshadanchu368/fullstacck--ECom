import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import React from "react";
import { Button } from "../button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const CommonForm = ({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
}) => {
  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || ''
    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            type={getControlItem.type}
            name={getControlItem.name}
            id={getControlItem.name}
            placeholder={getControlItem.placeholder}
            value={value}
            onChange={(e)=>
                setFormData({
                    ...formData,
                    [getControlItem.name] :e.target.value
                })
            }
          />
        );
        break;
      case "select":
        element = (
          <Select onValueChange={(value)=>{
            setFormData({
                ...formData,
                [getControlItem.name] : value
            })
          }} value={value}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );
        break;
      case "textarea":
        element = (
          <Textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.id}
            value={value}
            onChange={(e)=>
                setFormData({
                    ...formData,
                    [getControlItem.name] :e.target.value
                })
            }
          />
        );
        break;

      default:
        element = (
          <input
            type={getControlItem.type}
            name={getControlItem.name}
            id={getControlItem.name}
            placeholder={getControlItem.placeholder}
            value={value}
            onChange={(e)=>
                setFormData({
                    ...formData,
                    [getControlItem.name] :e.target.value
                })
            }
          />
        );
        break;
    }
    return element;
  }
  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => {
          return (
            <div className="grid w-full" key={controlItem.name}>
              <label className="mb-1">{controlItem.label}</label>
              {renderInputsByComponentType(controlItem)}
            </div>
          );
        })}
      </div>
      <Button className="mt-4 w-full">{buttonText || 'Submit'}</Button>
    </form>
  );
};

export default CommonForm;
