import Select from "react-select";
import { useController, UseControllerProps } from 'react-hook-form';


/* type FormValues = {
  redBanChamp:string[];
};
 */
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
//TODO  부모창에서 control을 넘겨서 관리 할 수 있는거 만들어 보기 너무 어렵네 이거
const ChildSelect = (props:UseControllerProps) => {

  const { field, fieldState } = useController(props);
  
   return (
      <>
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
      </>    

  )
}

export default ChildSelect
