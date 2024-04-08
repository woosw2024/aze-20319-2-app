import { Col, Row } from "react-bootstrap";
import { useForm, useWatch, Control, Controller } from "react-hook-form";
import Select from "react-select";
import { isDisabled } from '@testing-library/user-event/dist/utils';

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

export default function App() {
  console.log('랜더링'); 
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
                      
                      //console.log(value.entries()); 이거 안됨
/*                       console.log(JSON.stringify(value));
                      console.log(Array.isArray(value));
                      let aaaa = JSON.stringify(value) */
/*                       option.map((v) => {
                          console.log(v.value);
                          selecColor.map((e) => {
                            e.value===v.value ?  e.isDisabled=true :  e.isDisabled=false
                          })
                      }) */

                      //모두 true 만든 후에 다시 disabled 한다
                      selecColor.map((e) => {e.isDisabled = false})
                      selecColor.map((e) => {
                        option.map((v) => {
                          e.value===v.value ?   e.isDisabled=true :  e.isDisabled=e.isDisabled
                        })
                      })
                      console.log(selecColor)                      

                      //const disabledChange= selecColor.map((e) => {e.isDisabled = true})
                      //console.log(disabledChange)
    /*                   const aaa = {selecColor, 'isDisabled':true}
                      console.log(aaa) */

                      //console.log(selectedValues);

                      if(action.action !== 'remove-value') {
                        //console.log(option);
                        //console.log(getValues('blueBanChamp'));
                        onChange(selectedValues);                                
                      } else {
                        const aaaa = selectedValues.filter((v) => v!==JSON.stringify(value[0]))

                        console.log(aaaa); //삭제한 데이터를 가져 온다
                      }                 
                      
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
      <input {...register("firstName")} />
      <input {...register("lastName")} />
      <IsolateReRender control={control} />

      <input type="submit" />
    </form>
  );
}