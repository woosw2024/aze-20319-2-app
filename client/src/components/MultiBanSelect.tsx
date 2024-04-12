import React, { RefObject, forwardRef, memo, useRef } from 'react'
import ReactSelect from 'react-select'
import { gameChampList } from '../model/MgameDefaultData'
import { Controller, useForm } from 'react-hook-form'


// //확장을 해서 Menu를 가져 올 수 있다 price 까지 있음
// 결론 부모창에서 선택 한 밴 및 패널티 챔프 데이터는 못 받는다 hook form 이라 렌더링이 안되어서
// 경기결과 입력 checkbox 의 값에 따라 전체 값을 좌지 우지 한다
interface OwnProps {
   controlId:string
   //name:string 이게 필요 한가??? 
   setDisabled(changeData:string|undefined, isDisabled:boolean, gubun:string):void
   dataChange(changeData:string[], name:string):void
   chkJsonData:{title:string, color:string, isRsChecked:boolean, name:string}
   //valueData:string[]  //여기에는 값이 안들어 온다 valueData={getValues('redTeam.penaltyChamp')}  부모창에서 넘겨줘도 값 전달이 안됨
}

//멀티 밴 할때 사용 하는걸로 한다
// hook form 값 초기화 할려니깐 리렌더링 많이 난다고 에러   useState 도 리 렌더링 에러 그럼 데이터는 어떻게 주고 받지?
// 리렌더링 에러 나는건 value 를 초기 화 하면 onChange가 발생 해서 계속 렌더링 발생 해서 에러 남
// 결국 경기결과 입력 check 에 따라서 값을 조정 하도록 함 맞는지는 몰겠다
//TODO 이상하게 TeamSelect 에서는 부모창에서 teamCode를 받아 오는거 같긴 하다
//TODO Did you mean to use React.forwardRef()? GamePlay 에서 난다는데 잘 모르겠다 찾아 보자 에러남 왜 날까?
//TODO 나중에는 hook form controller를 이용 해 보자 잘 되는지 될수도 있을꺼 같긴 하다
const MultiBanSelect = (props:OwnProps) => {

   let firstSelectRef = useRef<any>();

   //getValue는 언제 작동 되지 값이 바뀔때 가져 오는거 같은데 부모창에서?
   //console.log("getValue():" + JSON.stringify(firstSelectRef.current?.getValue()));
   //console.log("hasValue():" + JSON.stringify(firstSelectRef.current?.hasValue()));
   //​​const secondSelectRef = useRef<any>(null);
   //hasValue가 value 가 사라지면 작동을 한다. 렌디링 할때 나는 에러는 잡았다 
   if(!props.chkJsonData.isRsChecked) {
      if(firstSelectRef.current?.hasValue()) firstSelectRef.current?.clearValue(); //이게 되면서 onChange가 발생 한다
   }
  

   //OnChange 가 발생시 렌더링이 계속 되니 그걸 안되게 해야 되는거 같다 그럼 되는듯 그럼 컨트롤러로 해도??? 되지 않나?
   return (
      <>
         <ReactSelect
            ref={firstSelectRef}
            name={props.chkJsonData.name}
            isClearable
            isMulti
            isDisabled={!props.chkJsonData.isRsChecked}
            options={gameChampList}
            styles={{
               container: (base) => ({
                  ...base,
                  background: "white",
                  backgroundColor: props.chkJsonData.color,
                  padding: 2,
               }),
            }}
            // 참조를 전달해줌으로써 hook form이랑 select input이랑 연결 (전달시 에러가 있을시 자동으로 해당 인풋으로 포커스해줌)
            placeholder={`${props.chkJsonData.title} 챔프 선택`}
            //value={!props.chkJsonData.isRsChecked? value | ''}
            onChange={(option, action) => {
               //console.log(action);
               //TODO 선택을 하면 3 2 1 이 되어야 되는데 1 2 3 으로 자꾸 변한다
               //챔피언 목록을 별도로 json으로 넣어둠

               //console.log(getValues('blueTeam.banChamp').filter((v) => v!==''));
               //const aaaa = gameChampList?.filter((option) => value.includes(option.value));
               //gameChampList?.filter((option) =>getValues('redTeam.banChamp')?.includes(option.value))
               //console.log("aaaa:"+JSON.stringify(aaaa));
               //value는 컨트롤에서 전달 받는 값으로 선택 한 값 뺴고 이전값을 가져 온다
               //활성화 댈때만?  //clearValue 가 되면 clear이 작동을 하고 모두 초기화 된다
               if(props.chkJsonData.isRsChecked)  {
                  const selectedValues = option?.map((v) => v.value)                            
                  if(action.action==="remove-value") {
                     //이건 삭제시 본인것만 푼다
                     props.setDisabled(action.removedValue.value, false, 'champ')
                  }
                  if(action.action==="select-option") {
                     props.setDisabled(action.option?.value, true, 'champ')
                  }
   
                  // 한꺼번에 지워 지는거라 배열로 지워야 된다
                  if(action.action==="clear") {
                     action.removedValues.map((v) => {
                        props.setDisabled(v.value, false,'champ');
                     })
                  }
                  //console.log('===갑전달==='+selectedValues)
                  //setChampData = selectedValues
                  //selectValueData.current = selectedValues
                  props.dataChange(selectedValues, props.chkJsonData.name);
   
               }
               

            }}
         />

      </>
  )
}

export default MultiBanSelect
