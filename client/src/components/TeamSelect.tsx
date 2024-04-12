import React from 'react'
import Select from 'react-select'
import { gameTeamListSelectBox } from '../model/MGameTeam'

// 확장을 해서 Menu를 가져 올 수 있다 price 까지 있음
// control:UseControllerProps 이걸 사용 할 수는 없나 자식창에서 부모창 control 을 가져 와서 ???
interface OwnProps {
   teamCode:string
   jsonData:gameTeamListSelectBox[]|undefined
   controlId:string
   //title:string
   //color:string
   setDisabled(changeData:string|undefined, isDisabled:boolean, gubun:string):void
   dataChange(teamName:string, temaCode:string):void
   chkJsonData:{title:string, color:string, name:string}

}
// 블루 레드팀 선택 하는 select
const TeamSelect = (props:OwnProps) => {
   //console.log('TeamSelect렌더링')
  return (
    <div>
         <Select
            name={props.chkJsonData.name}
            //options={gameTeamDataList}
            options={props.jsonData}
            styles={{
               container: (base) => ({
               ...base,
               backgroundColor: props.chkJsonData.color,
               padding: 2,
               }),
            }}          
            // 참조를 전달해줌으로써 hook form이랑 select input이랑 연결 (전달시 에러가 있을시 자동으로 해당 인풋으로 포커스해줌)
            placeholder={`${props.chkJsonData.title}팀 선택`}
            getOptionValue={(option) => option.teamCode} // changes here!!! 이걸 넣으면 option 목록에서 전체 색상이 파란색으로 되지 않는다
            //value={props.teamData?.filter((v) => v.teamCode === getValues("blueTeam.teamCode"))} //이건 어따 쓰는거지 초기화 안되는구나?
            value={props.jsonData?.filter((v) => v.teamCode === props.teamCode)} //이건 어따 쓰는거지 초기화 안되는구나?
            onChange={(option, action) => {
               //const blueTeamCode = getValues("blueTeam.teamCode")
               //아이템 선택
               //VALUE 이렇게 넘어 온다 mariadb 에는 VALUE가 대문자로 넘어 온다 어쩔 수 없이 다른거랑 비교를 한다
               //option 은 선택 했을때  action 은 동작한 상태를 가져 온다
               //console.log("value:"+value); //이전에 선택된 값을 가지고 있는다
               if(action.action==="select-option") {
                  props.setDisabled(props.teamCode, false, 'team')
                  props.setDisabled(option?.teamCode, true, 'team')
               }
               const teamName = option?.teamName===undefined?'':option?.teamName
               const teamCode = option?.teamCode===undefined?'':option?.teamCode
               props.dataChange(teamName, teamCode)
               //onChange(option?.teamCode)
               //blueTeamCodeChange(teamName, teamCode)


            }}
         />      
    </div>
  )
}

export default TeamSelect
