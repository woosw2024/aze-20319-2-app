import { Col, Row } from "react-bootstrap";
import { useForm, useWatch, Control, Controller } from "react-hook-form";
import Select from "react-select";

type FormValues = {
  blueBanChamp:string[];
  redBanChamp:string[];
};

type color = {
  label:string;
  value:string;
}

const selecColor:color[] = [
  {label:'흰색',value:'흰색'},
  {label:'검은색',value:'검은색'},
  {label:'노란색',value:'노란색'},
  {label:'빨강색',value:'빨강색'},
  {label:'적녹색',value:'적녹색'},
  {label:'푸른색',value:'푸른색'},
  {label:'간색',value:'간색'}
]


const reactSelect = () => {
   console.log('====react 랜더링===='); 
   const { register, control, handleSubmit, getValues } = useForm<FormValues>();
   const onSubmit = handleSubmit((data) => console.log(data));
 
   return (
     <form onSubmit={onSubmit}>
 
     <Row>
       <Col>
             <Controller
                 control={control}
                 name="blueBanChamp"
                 render={({ field: { onChange, value, ref, name } }) => (  
                   <Select
                     name="blueBanChamp"
                     isClearable
                     isMulti
                     options={selecColor}
                     // 참조를 전달해줌으로써 hook form이랑 select input이랑 연결 (전달시 에러가 있을시 자동으로 해당 인풋으로 포커스해줌)
                     ref={ref}
                     //value={value ? value : []}
                     //value={selecColor.map((v) => ({ v, label: v }))}
                     placeholder="레드 챔프 선택"
                     //onChange={onChange}
 /*                             onFocus={(e) => {
                       console.log(e);
                     }} */
                     onChange={(option, action) => {

                      const selectedValues = option.map((v) => v.value);
                      
/*                    
                      여러개 selectbox있을때 이거 선택 안되게 막을수 있다 이런게 있었네 좬당 24.04.08
                      //모두다 false 만들고 중복 되는걸 다시 true 만든다 다른 더 좋은거 있으면 바꾸기
                      selecColor.map((e) => {e.isDisabled = false})
                      selecColor.map((e) => {
                        option.map((v) => {
                          e.value===v.value ?   e.isDisabled=true :  e.isDisabled=e.isDisabled
                        })
                      })
                      console.log(selecColor)   */   

/*                        if(action.action !== 'remove-value') {
                        console.log(option);
                        console.log(getValues('blueBanChamp'));
                        const selectedValues = option.map((v) => v.value);
                        onChange(selectedValues);                                
                       }   */                            
                        onChange(selectedValues); 
                     }}
                   />
                 )}
               />        
             </Col>
             <Col>
                 <Controller
                         control={control}
                         name="redBanChamp"
                         render={({ field: { onChange, value, ref, name } }) => (  
                           <Select
                             name="redBanChamp"
                             isClearable
                             isMulti
                             options={selecColor}
                             // 참조를 전달해줌으로써 hook form이랑 select input이랑 연결 (전달시 에러가 있을시 자동으로 해당 인풋으로 포커스해줌)
                             ref={ref}
                             //value={value ? value : []}
                             //value={gameChampList?.filter((option) => option.value === value)}
                             placeholder="블루 챔프 선택"
                             onChange={onChange}
 /*                             onChange={(option, action) => {
                               onChange(option.value)
                             }} */
                           />
                         )}
                       />  
 </Col>                                            
 </Row>                            
 
       <input type="submit" />
     </form>
  )
}

export default reactSelect
