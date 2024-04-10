import { useRef } from "react";
import { Col, Row } from "react-bootstrap";
import { useForm, useWatch, Control, Controller, useController, UseControllerProps } from "react-hook-form";
import Select from "react-select";
//import ChildSelect from "./testPage/ChildSelect";



type FormValues = {
  firstName: string;
  lastName: string;
  blueBanChamp:string[];
  redBanChamp:string[];
};

type color = {
  label:string;
  value:string;
  isDisabled:boolean;
}

const selecColor:color[] = [
  {label:'흰색',value:'흰색', isDisabled:false},
  {label:'검은색',value:'검은색', isDisabled:false},
  {label:'노란색',value:'노란색', isDisabled:false},
  {label:'빨강색',value:'빨강색', isDisabled:false},
  {label:'적녹색',value:'적녹색', isDisabled:false},
  {label:'푸른색',value:'푸른색', isDisabled:false},
  {label:'간색',value:'간색', isDisabled:false}
]

function IsolateReRender({ control }: { control: Control<FormValues> }) {
  const firstName = useWatch({
    control,
    name: "lastName",
    defaultValue: "default"
  });

  return <div>{firstName}</div>;
}

// 컨트롤러를 이용 할 경우에는 다른 페이지는 못 불러 온다 같은 페이지에서 사용 해야 된다
const CustomInputHooked = (props: UseControllerProps<FormValues>) => {
  const { field, fieldState } = useController(props);
  return (
    <div>
      <Select
        name={field.name}
        isClearable
        isMulti
        options={selecColor}
        placeholder="레드 챔프 선택"
        onChange={(option, action) => {
        //action 에 속성이 있다 그리고 value를 가져 올수 있다 multi와 단일등 action 에 따라 객체 속성 달라 진다
        //여러개의 select 일경우 객체 값이 자동 적용 된다
          const selectedValues = option.map((v) => v.value);
          field.onChange(selectedValues); 
        }}
      />
    </div>
  );
};

export default function App() {
  console.log('랜더링'); 

  const selectRef = useRef(null);
  const { register, control, handleSubmit } = useForm<FormValues>({
    mode:'onSubmit',
    defaultValues: { firstName: '', lastName: '', blueBanChamp:[], redBanChamp:[]}
  });
  const onSubmit = handleSubmit((data) => {
    //Select.ref.current.clearValue()
    //resetField('blueBanChamp').clearValue()
    //ref.Select.clearValue()
    console.log(data)
    selectRef.current = null;
    console.log(data)
  });

  
  return (
    <form onSubmit={onSubmit}>

 
      <CustomInputHooked control={control} name="blueBanChamp"/>          

      
                     
      <input {...register("firstName")} />
      <input {...register("lastName")} />
      <IsolateReRender control={control} />

      <input type="submit" />
    </form>
  );
}