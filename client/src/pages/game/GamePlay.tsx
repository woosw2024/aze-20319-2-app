import React, {useState, useRef, useEffect } from 'react'
import { Accordion, Button, Col, Container, Form, InputGroup, ListGroup, Row } from 'react-bootstrap'
import { ModelGameTitle, ModelGameTitleDetail } from '../../model/MgameTitle';
import { gameChampList, positionData } from '../../model/MgameDefaultData';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Controller, UseControllerProps, useController, useForm } from 'react-hook-form';
import axios from 'axios';
import { gameTeamData, gameTeamListSelectBox } from '../../model/MGameTeam';
import DatePicker from 'react-datepicker';
import {ko} from 'date-fns/locale/ko';
import dayjs from 'dayjs';
import Select from 'react-select';
import { gamePlayList, gamePlaySubmit, teamDefaultValue } from '../../model/MgameReg';
import TeamSelect from '../../components/TeamSelect';
import MultiBanSelect from '../../components/MultiBanSelect';





/* interface testData {
  label:string;
  value:string;
}


const options:testData[] = [
  { value:'1', label: 'Chocolate' },
  { value:'2', label: 'Strawberry' },
  { value:'2', label: 'Vanilla' },
]; */

//let rename:testData = [];

//TODO core-js 사용 해보기
//TODO 달력을 한국 정서에 맞게 변경 하기
//TODO 점수에 따른 패널티에 관련 해서 적용 되는거 알려주기??

//특별한거 아니면 모드 다 string로 하는게 맞는거 같다 hook form getvalues type은 string 으로 되어 에러 발생 한다



//registerLocale('ko', ko); //날짜 한국어로 표시

//TODO 경기 등록 하는거 콤포넌트화로 만들어서 경기날짜+경기시간을 통해서 동시에 3경기를 등록 하도록 해 본다 가능 할려나?
//이유는 다르게 입력 하게 되면 1세트 2세트 3세트 번호가 틀려 진다 
//예를 들어 게임 정보 최 상단에 코드가 2024-04-03-1-18 로 되어 있다면
//A,B  A,D 팀이 등록 할때 A 팀은 중복 등록이 된다 이때 시간을 바꿔 주면 되나???
const GamePlay = () => {
  

  //const queryClient = useQueryClient();   
  //useState 무조건 써야 되나 ?  이것도 hook form Controll을 이용 해보자
  const [startDate, setStartDate] = useState<Date | null>(new Date()); //TODO 달력 사용 이방법 밖에 없나???
  //const [titleSelected, setTitleSelected] = useState<string>('');
  const titleSelected = useRef<string>();
  //const selectRef = useRef()
  console.log("===GamePlay 랜더링===")
  

  //const prevBlueSelectBox = useRef(0);
  //const prevRedSelectBox = useRef(0);
  //defaultValues 설정 하면 해당 값을 그대로 html dom 에서 받는다
  // 이중 구조로 도 된다 공식문서 보면 됨
  const {register, handleSubmit, setFocus, setValue, getValues, control, unregister, resetField, reset, watch} = useForm<gamePlaySubmit>({
    mode : 'onSubmit',
    // default 로 주니깐 value가 안바뀜 gameDate:dayjs(startDate).format('YYYY-MM-DD')
    defaultValues: {
      gameInfo:{gtdIdx : 0, gtdTitle:'', gtIdx :0, setNum:'1', GameTime:'18', gameDate:dayjs(startDate).format('YYYY-MM-DD'), gameRs:false, teamWin:''}, 
      blueTeam:teamDefaultValue, redTeam:teamDefaultValue
      //blueTeam:{teamCode:'0', teamName:'', teamUser:[], teamPositon:[], teamCheckbox:[], teamKillNum:[], teamDeathNum:[], teamAssNum:[], champEng:[], banChamp:[], penaltyChamp:[], teamMvp:''}, 
      //redTeam:{teamCode:'0', teamName:'', teamUser:[], teamPositon:[], teamCheckbox:[], teamKillNum:[], teamDeathNum:[], teamAssNum:[], champEng:[], banChamp:[], penaltyChamp:[], teamMvp:''}, 
    } 
  });  

  const isRsChecked = watch('gameInfo.gameRs'); // 체크박스 상태 감시
  
  //console.log(isRsChecked);
  //console.log(getValues('gameInfo.gameRs'));
  //const isChecked = useWatch({ control, name: 'gameInfo.gameRs', defaultValue: true });  
  //setValue('blueTeam.teamCheckbox', false);


  //첫번째 값으로 설정 함 
  //setValue('gameInfo.gameDate',dayjs(startDate).format('YYYY-MM-DD'));


  //TODO 이거 콤포넌트 화 시켜서 가져 오기 
  // 대회명 데이터를 가져 온다 - 사용방법이 여러 가지 있다 
  const {data:gameTitleData} = useQuery<ModelGameTitle[]>({
    queryKey:['gtIdx'], 
    queryFn: async () => {
      const resp = await axios.get(`${process.env.REACT_APP_API_ROOT}/api/gameTitle`);
      //   //console.log(JSON.stringify(resp.data[0])+'---------------');
      return resp.data;    
    },
    retry : 3, //실패시 3번만 실행 하게 한다    
    //queryFn:getGameTitle
  });

  //대회명 상세를 가져 온다
  //TODO 이거 콤포넌트 화 시켜서 가져 오기
  const {data:gameTitleDetailData, refetch:detailRefetch} = useQuery<ModelGameTitleDetail[]>({
    queryKey:['gtdIdx'], 
    queryFn: async () => {
      const gtIdxVal = getValues('gameInfo.gtIdx');
      //const resp = await axios.get(`${process.env.REACT_APP_API_ROOT}/api/gameTitleDetail/${gtIdxRef.current}`);
      const resp = await axios.get(`${process.env.REACT_APP_API_ROOT}/api/gameTitleDetail/${gtIdxVal}`);
      //   //console.log(JSON.stringify(resp.data[0])+'---------------');
      return resp.data;    
    },
    retry : 3, //실패시 3번만 실행 하게 한다
    enabled:false
    //queryFn:getGameTitle
  });  
  


 //선택한 대회에 등록된 팀 목록 가져 온다  
  //TODO 에러 발생시 처리 방법 넣기 queryFn 에서  에러가 axios에서 나서 error 이게 안되는거 같다
  //typescript 제네릭으로 선언 되면 변경 할 수 없고 해당 타입만 와야 된다
  //TODO 이게 외 3번이 로딩 되지 여기 GameTeam 컴포넌트도 3번 랜더링 된다 머지 이거
  //블루, 레드 팀목록 selectbox 데이터 불러 오는거
  const {data:gameTeamDataList, refetch:teamReftch} = useQuery<gameTeamListSelectBox[]>({
    queryKey:['teamCode'], 
    queryFn: async () => {
        const gtdIdxVal = getValues('gameInfo.gtdIdx');
        const resp = await axios.get(`${process.env.REACT_APP_API_ROOT}/api/gameTeam/teamList/`,
          {params : { gtdIdx : gtdIdxVal }}
        );
        return resp.data; 
    },    
    retry : 3, //실패시 3번만 실행 하게 한다
    enabled:false
  }); 


  //블루팀 선택시 팀원 목록 가져 오기 한번에 가져 와서 컨트롤 하면 되지 않을까????
  //TODO 레드 블루팀을 선택시 한개로 할 수 있는 방법 없나???
  //아니면 팀 전체를 미리 불러 와서 골라야 되나???
  const {data:gameBlueTeamList, refetch:blueTeamReftch, isRefetching:blueTeamIsReftch} = useQuery<gameTeamData[]>({
    queryKey:['blueTeamCode'], 
    queryFn: async () => {
        //const teamCodeVal = getValues('blueTeam.teamCode');
        const resp = await axios.get(`${process.env.REACT_APP_API_ROOT}/api/gameTeam/teamUserList`,
          {params : { teamCode : getValues('blueTeam.teamCode') }}
        );
        //console.log(resp.data);
        return resp.data; 
    },    
    retry : 3, //실패시 3번만 실행 하게 한다
    enabled : false
  });   

  //if(blueTeamisLoading) console.log('로딩');
  //if(blueTeamIsReftch) console.log('리로딩');

  //레드팀 선택 시
  const {data:gameRedTeamList, refetch:redTeamReftch, isRefetching:redTeamIsReftch} = useQuery<gameTeamData[]>({
    queryKey:['redTeamCode'],  //TODO  사용용도 한번더 체크 해보기
    queryFn: async () => {
        //const teamCodeVal = getValues('redTeam.teamCode');
        const resp = await axios.get(`${process.env.REACT_APP_API_ROOT}/api/gameTeam/teamUserList`,
          {params : { teamCode : getValues('redTeam.teamCode') }}
        );
        return resp.data; 
    },    
    retry : 3, //실패시 3번만 실행 하게 한다
    enabled : false
  });

  //선택한 대회에 등록된 경기 리스트 확인
  const {data:gameTeamPlayList, refetch:gamePlayReftch, isRefetching:gameTeamPlayIsReftch} = useQuery<gamePlayList[]>({
    queryKey:['gwCode'], 
    queryFn: async () => {
        const gtdIdxVal = getValues('gameInfo.gtdIdx');
        const resp = await axios.get(`${process.env.REACT_APP_API_ROOT}/api/gamePlay/teamPlayAll`,
          {params : { gtdIdx : gtdIdxVal }}
        );
        return resp.data; 
    },    
    retry : 3, //실패시 3번만 실행 하게 한다
  });     

  //TODO 초기화 하는 방법이 이거 뿐인가? unregister 안되나?
  // blue, red 설정값 모두 초기화, 등록된 경기목록 새로 고침, 블루팀원 새로고침, 레드팀원 세로 고침, 챔프 disabled 모두 초기화
  const teamInfoReset = () => {
    /*setValue  는 값 변경 . unregister은 Controll 이용 할 경우 리셋, reset 는 전체 리셋    */
    unregister(['blueTeam','redTeam'])
    //console.log("blueTeam.teamUser");
    teamReftch();// 팀목록도 리셋    
    gamePlayReftch(); //등록된 경기 내용도 리셋
    blueTeamReftch(); //블루팀원 초기화
    redTeamReftch(); //레드팀원 초기화    
    champDisabledReset() //챔프 disabled 초기화   

  }
  
  //대회명을 선택 하면 상세 정보를 가져 오게 한다
  // TODO selectbox 선택 시 선택 한 text가져 오는거 만들어야 됨
  const gtIdxChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
    setValue('gameInfo.gtIdx', parseInt(e.target.value));
    //gtdIdx 는 기존에 값을 가지고 있어서 초기화 시켜 준다
    resetField('gameInfo.gtdIdx')
    resetField('gameInfo.gtdTitle')
    resetField('gameInfo.teamWin')
    resetField('gameInfo.gameRs')
    
    //setValue('gameInfo.gtdIdx',0); //이걸 해 줘야 화면이 초기화 된다
    //setValue('gameInfo.gtdTitle',''); //이걸 해 줘야 화면이 초기화 된다
    detailRefetch(); // 대회 상세 명 useQuery  enabled 된걸 작동 시키게 한다
    teamInfoReset();//모든 정보 리셋
  }

  //대회명 상세를 선택 하면 등록된 팀 정보를 정보를 가져 오게 한다
  //대회 상세명 선택시 초기화 해야 될꺼 블루팀 레드팀 목록이랑 팀원 목록
  const gtdIdxChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
    setValue('gameInfo.gtdIdx', parseInt(e.target.value)); //값을 셋팅 한다
    if(e.target.value !== "0") {
      setValue('gameInfo.gtdTitle', e.target.options[e.target.selectedIndex].text);  
      titleSelected.current = e.target.options[e.target.selectedIndex].text
      //setTitleSelected(e.target.options[e.target.selectedIndex].text);
    } else {
      setValue('gameInfo.gtdTitle', '');    
      titleSelected.current = '';
      //setTitleSelected('');      
    }
    resetField('gameInfo.teamWin')
    resetField('gameInfo.gameRs')
    teamInfoReset();  //모든 정보 리셋

  }  

  //블루팀 모든 정보 초기화 select Change => 이거 사용 안할꺼 같다
  //const blueTeamCodeChange = (teamName:string, teamCode:string) => {
  const blueTeamCodeChange = (teamName:string, teamCode:string) => {

    const banChamp = getValues('blueTeam.banChamp');
    const penaltyChamp = getValues('blueTeam.penaltyChamp');
    const champEng = getValues('blueTeam.champEng');
    //resetField('blueTeam') //이걸 하니깐 filter 에서 오류가 난다 모드 사라지는건가?
    unregister('blueTeam')  //이걸 하면 유효성 검사 규칙 및 입력필드 값 제외
    setValue('blueTeam.banChamp', banChamp); // 밴챔프 그대로
    setValue('blueTeam.penaltyChamp', penaltyChamp); //페널티 그대로
    setValue('blueTeam.teamCode', teamCode); //팀코드값을 셋팅 한다
    setValue('blueTeam.teamName', teamName); //팀명 셋팅
    blueTeamReftch(); //블루팀원 초기화
    //챔프가 모두 지워 지므로 disabled 초기화 시켜야 된다.
    gameChampList.map((e) => {
      champEng.map((v) => {
        selectDisabled(v, false,'champ');
      })
    })    
    //champDisabledReset() //챔프 disabled 초기화 이거 하면 어떻게 되지?
    //selectRef.current.select.clearValue();
    //text 가져 오는거 console.log(e.target.options[e.target.selectedIndex].text);
  }  

  //레드팀 선택시 이제는 disabled가 되어서 
  const redTeamCodeChange = (teamName:string, teamCode:string) => {
    //const redTeamName = e.target.options[e.target.selectedIndex].text;
    const banChamp = getValues('blueTeam.banChamp');
    const penaltyChamp = getValues('blueTeam.penaltyChamp');
    const champEng = getValues('blueTeam.champEng');
    unregister('redTeam')  //이걸 하면 Controll 에 value 값이 초기화
    setValue('redTeam.banChamp', banChamp); // 밴챔프 그대로
    setValue('redTeam.penaltyChamp', penaltyChamp); //페널티 그대로    
    setValue('redTeam.teamCode', teamCode); //값을 셋팅 한다
    setValue('redTeam.teamName', teamName);
    redTeamReftch();
    //챔프가 모두 지워 지므로 disabled 초기화 시켜야 된다.
    gameChampList.map((e) => {
      champEng.map((v) => {
        selectDisabled(v, false,'champ');
      })
    })    

  }  

/*   const blueTeamChecked = (e:React.ChangeEvent<HTMLInputElement>) => {
    console.log(getValues("blueTeamUser"));
    return
  } */
  //정보 저장 하는거 useForm 에 저장 해 두면 한번에 submit로 보낼 수 있구나
  const onSubmitHandlerDetail = (data:gamePlaySubmit) => { 

    console.log("blueTeam:"+JSON.stringify(data.blueTeam));
    console.log("redTeam:"+JSON.stringify(data.redTeam));
    //resetField('redTeam', {keepDirty:true})
    if(data.gameInfo.gtIdx === 0){
      alert('대회명을 선택 하세요!');
      setFocus('gameInfo.gtIdx');
      return false;
    }

    if(data.gameInfo.gtdIdx === 0){
      alert('대회 상세명을 선택 하세요!');
      setFocus('gameInfo.gtdIdx');
      return;
    }

    if(data.gameInfo.gameDate === ''){
      alert('경기 날짜를 선택 하세요!');
      setFocus('gameInfo.gameDate');
      return;
    }

    //console.log('blueTeam.teamCode'+data.blueTeam.teamCode);
    if(data.blueTeam.teamCode === ''){
      alert('블루팀을 선택 하세요.');
      setFocus('blueTeam.teamCode');
      return;
    }
    
    const blueUserCount = getValues('blueTeam.teamUser').filter((e) => e!=null).length
    //선수 선택 수
    //if(data.blueTeam.teamUser.length < 5){
    if(blueUserCount < 5){
      alert('블루팀 출전 선수 최소 5명은 선택 하세요.');
      return;
    } 

    if(data.redTeam.teamCode === ''){
      alert('레드팀을 선택 하세요.');
      setFocus('redTeam.teamCode');
      return;
    }    
    
    const redUserCount = getValues('redTeam.teamUser').filter((e) => e!=null).length        
    if(redUserCount < 5){
      alert('레드팀 출전 선수 최소 5명은 선택 하세요.');
      return;
    }     


    //경기결과 체크에 따라 입력값 체크 한다
    if(isRsChecked) {
      const blueChampCount = getValues('blueTeam.champEng').filter((e) => e!=null).length
      //챔프 선택 수
      if(data.blueTeam.champEng.length < 5){
      //if(blueChampCount < 5){
        alert('블루팀 챔프는 최소 5개 입니다.');
        return;
      }

      const redChampCount = getValues('redTeam.champEng').filter((e) => e!=null).length    
      //챔프 선택 수
      if(redChampCount < 5){
        alert('레드팀 챔프는 최소 5개 입니다.');
        return;
      }    

    } else {
      data.redTeam.teamKillNum.fill('0');
      data.redTeam.teamAssNum.fill('0');
      data.redTeam.teamDeathNum.fill('0');
      data.blueTeam.teamKillNum.fill('0');
      data.blueTeam.teamAssNum.fill('0');
      data.blueTeam.teamDeathNum.fill('0');      
    }


 

    const gameTitle = data.gameInfo.gtdTitle;
    const blueTeam = data.blueTeam.teamName;
    const regTeam = data.redTeam.teamName;

    const msg = `${gameTitle}\n${blueTeam} vs ${regTeam} \n ${data.gameInfo.setNum}SET 경기를 등록 하시겠습니까?`

    //TODO 선택된 seletbox에 대한 text 가져 와서 뿌려 주는거 하기
    if (window.confirm(msg)) {
      saveGroupMutation.mutate(data);
    } else {
      return false;
    }  
  }
  // TODO  팀원 선택 하면 선택 한 사람 위쪽으로 배치 될 수 있도록 해 보기
  // label 에 커서 손모양으로 바꾸도록 해보기
  //대회에 참가할 팀 데이터 입력
  const saveGroupMutation = useMutation({
    mutationFn: async (param:gamePlaySubmit) => {
      //return updateGroupApi(gameTitle, done, gubun);
      //console.log('===== 데이터 전송 =====');
      //console.log(param);
      // 가공해서 넘기는데 userForm 에 있을 필요 있나????
      //let userIdxArray = param.teamData.map((item) => item.userIdx); //userIdx 값을 배열로 만듬
/*       const userIdxArray = teamAddUserData.map((item) => item.userIdx); //userIdx 값을 배열로 만듬
      const teamUserArray = userIdxArray.join('##'); */
      //TODO bossFlag radio 로 넘기는 방법 만들기
      //console.log(param.bossFlag);
   
     const response = await axios.post(`${process.env.REACT_APP_API_ROOT}/api/gamePlay`,param);
      return response;
    },
    onSuccess: (res) => {

      if(res.data.errno > 0) {
        alert("에러 : "+res.data.sqlMessage+"\n 세트, 경기날짜, 시간을 확인 하세요.");
      } else {
        //3경기 까지 할 수 있므로 
        let setNo = parseInt(getValues('gameInfo.setNum'));
        //이게 맞나 3세트면 올 리셋 아니면 그냥 둔다 맞을려나 아니면 다 리셋을 하까?  
        //이거 참 애메 하네  
        if(setNo === 3) { 
          //세트번호초기화
          setValue('gameInfo.setNum', "1");
          teamInfoReset(); //모든정보리셋          
        } else {
          setNo++
          setValue('gameInfo.setNum', setNo.toString())
          gamePlayReftch(); //경기 등록 정보 리셋
        }
          // 선택된 정보 초기화
        reset({blueTeam:teamDefaultValue, redTeam:teamDefaultValue});
          /* reset({
            blueTeam : {
            teamCode:'0',
            teamName:'',
            teamUser:[],
            teamPositon:[],
            teamCheckbox:[],
            teamKillNum:[],
            teamDeathNum:[],
            teamAssNum:[],
            champEng:[],
            banChamp:[],
            penaltyChamp:[]
          },
          redTeam : {
            teamCode:'0',
            teamName:'',
            teamUser:[],
            teamPositon:[],
            teamCheckbox:[],
            teamKillNum:[],
            teamDeathNum:[],
            teamAssNum:[],
            champEng:[],
            banChamp:[],
            penaltyChamp:[]           
          }    
        }); */
        alert("등록 완료 되었습니다.");
        return;
      } 

    },
  });    
  
  // 함수로 루프를 돌린다
  const teamRendering = (teamUser:string) => {
    const result = [];
    const teamUserArray = teamUser.split('|');
    for (let i = 0; i < teamUserArray.length; i++) {
      result.push(<div key={i}>{teamUserArray[i]}</div>);
    }
    return result;
  };



  //선택한 챔프 disabled
  const selectDisabled = (item:string|undefined, isDisabled:boolean,  gubun:string) => {

    if (gubun === "champ") gameChampList?.map((e) => {if(e.value===item)  e.isDisabled=isDisabled})   
    if (gubun === "team") gameTeamDataList?.map((e) => {if(e.teamCode===item)  e.isDisabled=isDisabled})
      
  }   

  //챔프 선택 하는곳 모두 다 disabled 초기화
  const champDisabledReset = () => {gameChampList.map((e) => {e.isDisabled = false})}

  //밴 챔프 관리
  const champBan = (data:string[], name:string) => {
    
    //console.log("champBan:"+data);
    //console.log("champBan:"+name);
    if(name==="redTeam.banChamp") setValue('redTeam.banChamp', data)
    if(name==="redTeam.penaltyChamp") setValue('redTeam.penaltyChamp', data)

      
    if(name==="blueTeam.banChamp") setValue('blueTeam.banChamp', data)
    if(name==="blueTeam.penaltyChamp") setValue('blueTeam.penaltyChamp', data)

    //setValue(`${name}`, data) //이거 상요 방법 없나?
    
  }
  //첫 로딩시 모두 초기화
  useEffect(()=>{
    detailRefetch(); // 대회 상세 명 useQuery  enabled 된걸 작동 시키게 한다
    teamInfoReset();// 모든정보리셋
  },[])  


// 컨트롤러를 이용 해서 컴포넌트를 만들어 볼려고 했는데 안된다 머지
/* 
const CustomGameTeam = (control: UseControllerProps<gamePlaySubmit>) => {
  const { field, fieldState } = useController(control);
  //console.log(getValues(`${field.name}`))
  console.log(field)
  return (
    <div>
      <Select
          //name="formGridBlueTeamCode"
          options={gameTeamDataList}
          styles={{
            container: (base) => ({
              ...base,
              backgroundColor: "#0052CC",
              padding: 2,
            }),
          }}          
          // 참조를 전달해줌으로써 hook form이랑 select input이랑 연결 (전달시 에러가 있을시 자동으로 해당 인풋으로 포커스해줌)
          placeholder="블루 팀 선택"
          getOptionValue={(option) => option.teamCode} // changes here!!! 
          value={gameTeamDataList?.filter((v) => v.teamCode === getValues(`${field.name}`))} //이건 어따 쓰는거지 초기화 안되는구나?
          onChange={(option, action) => {
          
            const blueTeamCode = getValues(`${field.name}`)
            //아이템 선택
            //VALUE 이렇게 넘어 온다 mariadb 에는 VALUE가 대문자로 넘어 온다 어쩔 수 없이 다른거랑 비교를 한다
            //option 은 선택 했을때  action 은 동작한 상태를 가져 온다
            //console.log("value:"+value); //이전에 선택된 값을 가지고 있는다
            if(action.action==="select-option") {
              //console.log("option-value:"+option?.teamCode)
              //gameTeamDataList?.map((e) => {if(e.teamCode===option?.teamCode)  console.log(option?.value)})
              selectDisabled(blueTeamCode, false, 'team')
              selectDisabled(option?.teamCode, true, 'team')
              //console.log(gameTeamDataList);                            
            }
            const teamName = option?.teamName===undefined?'':option?.teamName
            const teamCode = option?.teamCode===undefined?'':option?.teamCode
            blueTeamCodeChange(teamName, teamCode)
            //onChange(option?.teamCode)

          }}
        />
    </div>
  );
};
 */

  //아코디언 형태 다르게 해보기 header에 두줄이 안된다
  return (
    <Container fluid>
      <Row>
        <Col xxl={8}>
          <form id="mainForm" onSubmit={handleSubmit(onSubmitHandlerDetail)}>  
            <h3 className="text-center">경기 선택</h3>   
            <Row>
              <Form.Group as={Col} controlId="formGridGtIdx">
                <Form.Select {...register("gameInfo.gtIdx")} onChange={gtIdxChange}>
                <option key={0} value={0}>대회명 선택</option>            
                {
                  gameTitleData?.map((item, index) => (
                    <option key={index} value={item.gtIdx}>{item.gtTitle}</option>
                  ))
                }
                </Form.Select>
              </Form.Group>     

              <Form.Group as={Col} controlId="formGridGtdIdx">
                <Form.Select {...register("gameInfo.gtdIdx")} onChange={gtdIdxChange}>
                <option key={0} value={0}>상세 대회명 선택</option>            
                {
                  gameTitleDetailData?.map((item, index) => (
                    <option key={index} value={item.gtdIdx}>{item.gtdTitle}</option>
                  ))
                }
                </Form.Select>  
              </Form.Group> 
            </Row>
            
            <Row className="mb-3 mt-3">
              <Row>
                <Form.Group as={Row} controlId="formGridGameDate">
                  <Form.Label column sm="1">경기날짜</Form.Label>
                  {/* //TODO hook form Controll 사용 해 보기 */}
                  <Col sm="3">
                    <DatePicker 
                      {...register("gameInfo.gameDate")}  
                      showIcon
                      selected={startDate}
                      dateFormat="YYYY-MM-dd" 
                      locale={ko}
                      onKeyDown={e => e.preventDefault()}
                      onChange={(data:Date) => setStartDate(data)} />
                      {/* onChange={(data:Date) => setValue('gameInfo.gameDate', data.toString())} /> 이거 안됨 */}
                    </Col>                    
                  <Form.Label column sm="1">경기시간</Form.Label>  
                  <Col sm="2">
                    <Form.Select {...register("gameInfo.GameTime")}>
                      <option key={1} value="18">오후 6시</option>
                      <option key={2} value="19">오후 7시</option>
                      <option key={3} value="20">오후 8시</option>
                      <option key={4} value="21">오후 9시</option>
                      <option key={5} value="22">오후 10시</option>
                      <option key={6} value="23">오후 11시</option>
                    </Form.Select>  
                  </Col>                
                  <Form.Label column sm="1">게임 세트</Form.Label>
                  <Col sm="2">
                  <Form.Select {...register("gameInfo.setNum")}>
                    <option key={1} value={1}>1 SET</option>
                    <option key={2} value={2}>2 SET</option>
                    <option key={3} value={3}>3 SET</option>
                  </Form.Select>  
                  </Col>                  
                </Form.Group>                 
              </Row>
              <Row className="mt-2">
                <div>* 동일한 경기날짜,세트,경기시간에 같은 팀은 입력 되지 않습니다.</div>
                <div>* 게임세트 3SET 일 경우 입력 완료 후 팀 선택은 초기화 됩니다.</div>
              </Row>
            </Row>
            {/* 경기결과선택 체크박스 */}
            <Row>
              <Col>
                <Form.Check // prettier-ignore
                  key={0}
                  type="switch"
                  id="geamRs"
                  label="경기결과 입력 (경기결과 입력을 원하시면 선택 하세요)"
                  className='mb-2'
                  {...register(`gameInfo.gameRs`, {
                      value:false,
                      onChange: (e) => {
                        //팀별 챔프 정상화 시켜야 됨
                        //MVP 원복
                        //킬 데스 어시 원복
                        if(!e.target.checked) {
                          //리셋을 모두 시켜야 되는구나
                          //console.log('==geamRs 리셋 시작==');
                          unregister('redTeam.banChamp')    //레드 챔프초기화
                          unregister('redTeam.penaltyChamp')    //레드 챔프초기화
                          unregister('redTeam.champEng')    //레드 챔프초기화 - inputbox들어가 있는 값 까지 모두 다 지워줌
                          resetField('redTeam.teamMvp')    //레드 mvp 초기화
                          resetField('redTeam.teamKillNum') //레드 킬 초기
                          resetField('redTeam.teamAssNum')  //레드 어시 초기
                          resetField('redTeam.teamDeathNum')  //레드 데스 초기      
                          resetField('redTeam.assignFlag')  //레드 지정챔 초기      
                                              

                          resetField('blueTeam.banChamp')    //레드 챔프초기화
                          resetField('blueTeam.penaltyChamp')    //레드 챔프초기화                          
                          //resetField('blueTeam.champEng')    //블루 챔프초기화
                          unregister('blueTeam.champEng')    //블루 챔프초기화
                          resetField('blueTeam.teamMvp')    //블루 mvp 초기화
                          resetField('blueTeam.teamKillNum') //블루 킬 초기
                          resetField('blueTeam.teamAssNum')  //블루 어시 초기
                          resetField('blueTeam.teamDeathNum')  //블루 데스 초기
                          resetField('blueTeam.assignFlag')  //블루 지정챔 초기      
                          //챔프는 화면에서 초기화가 안된다 해결 방법 찾아야 되는데 큰일이네
                          champDisabledReset(); //챔프 관련 disabled 모두 리셋 시킨다
                        }
                      }
                    })}
                />        
              </Col> 
            </Row>
            <Row className="mb-3">
              {/* 블루팀 시작 
                TODO PartialForm 으로 input 가능 할뜻 객체 ID를 통해서 가능 한듯 roop 돌면서 할 수 있는 방법 찾아 보기
                    {name:, label:} 이걸로 해서 라벨과 동시에 되는거 같다
              */}
              <Col>
                
                <Form.Group controlId="formGridBlueTeamCode">
                  {/* 컨트롤러 필요 없다 새로 값을 리셋 해야 되는 상태 이다  컨트롤러로 한번 해보기*/}
                  {/* 블루 팀 선택  콤포넌트 페이지로  여기는 name을 선언할수 없다 비제어 콤포넌트 */}

                  <Form.Check // prettier-ignore
                    key='blueTeamWin'
                    type="radio"
                    id='teamWin'
                    label="블루팀 승리"
                    value="blue"
                    {...register('gameInfo.teamWin')}
                  />                    
                  <TeamSelect teamCode={getValues('blueTeam.teamCode')}  jsonData={gameTeamDataList}
                    chkJsonData={{title:'블루', color:'#0052CC', name:'blueTeam.banChamp'}} 
                    setDisabled={selectDisabled} dataChange={blueTeamCodeChange} controlId="formGridBlueTeamCode" />

{/*                    <Select
                    name="formGridBlueTeamCode"
                    options={gameTeamDataList}
                    styles={{
                      container: (base) => ({
                        ...base,
                        backgroundColor: "#0052CC",
                        padding: 2,
                      }),
                    }}          
                    // 참조를 전달해줌으로써 hook form이랑 select input이랑 연결 (전달시 에러가 있을시 자동으로 해당 인풋으로 포커스해줌)
                    placeholder="블루 팀 선택"
                    getOptionValue={(option) => option.teamCode} // changes here!!! 
                    value={gameTeamDataList?.filter((v) => v.teamCode === getValues("blueTeam.teamCode"))} //이건 어따 쓰는거지 초기화 안되는구나?
                    onChange={(option, action) => {
                    
                      const blueTeamCode = getValues("blueTeam.teamCode")
                      //아이템 선택
                      //VALUE 이렇게 넘어 온다 mariadb 에는 VALUE가 대문자로 넘어 온다 어쩔 수 없이 다른거랑 비교를 한다
                      //option 은 선택 했을때  action 은 동작한 상태를 가져 온다
                      //console.log("value:"+value); //이전에 선택된 값을 가지고 있는다
                      if(action.action==="select-option") {
                        //console.log("option-value:"+option?.teamCode)
                        //gameTeamDataList?.map((e) => {if(e.teamCode===option?.teamCode)  console.log(option?.value)})
                        selectDisabled(blueTeamCode, false, 'team')
                        selectDisabled(option?.teamCode, true, 'team')
                        //console.log(gameTeamDataList);                            
                      }
 
                      //액션이 클리어면 초기화    x 표 사용 안한다 지금은                                    
                      // if(action.action === 'clear') {
                      //   selectDisabled(action.removedValues[0].teamCode, false, 'team')                                        
                      //   //return false
                      // }  
                      const teamName = option?.teamName===undefined?'':option?.teamName
                      const teamCode = option?.teamCode===undefined?'':option?.teamCode
                      blueTeamCodeChange(teamName, teamCode)
                      //onChange(option?.teamCode)

                    }}
                    /> 
  */}
                </Form.Group>  
                {/* 블루 팀 밴 */}
                <Form.Group controlId="formGridBlueBanChamp" className="mt-2"> 
                  <Form.Label>밴 챔프</Form.Label>
                  {/* //TODO Select 상호 작용 레드랑 같이 되는지 체크 하기 블루에서 A를 고르면 레드에서는 A를 못 고르게(반대상황도 물론 필요) */}
                  {/* //TODO 선택 하면 다른팀 데이터도 같이 disabled 가능 한지 확인 
                      이것도 굳이 컨트롤러기 필요 없을거 같긴 한데
                      편한점 알아서 지워지고 등록 된다, 아니면 setValue로 다 해줘야 된다
                    */}
                  <Controller
                    control={control}
                    name="blueTeam.banChamp"
                    render={({ field: { onChange, value, ref, name } }) => (  
                      <Select
                        name="formGridBlueBanChamp"
                        isClearable
                        isMulti
                        isDisabled={!isRsChecked}
                        options={gameChampList}
                        styles={{
                          container: (base) => ({
                            ...base,
                            background: "white",
                            backgroundColor: "#0052CC",
                            padding: 2,
                          }),
                        }}          
                        // 참조를 전달해줌으로써 hook form이랑 select input이랑 연결 (전달시 에러가 있을시 자동으로 해당 인풋으로 포커스해줌)
                        ref={ref}
                        placeholder="블루 밴 챔프 선택"  
                        value={gameChampList?.filter((option) => value.includes(option.value))}
                        onChange={(option, action) => {
                          //console.log(value);
                          //TODO 선택을 하면 3 2 1 이 되어야 되는데 1 2 3 으로 자꾸 변한다
                          //챔피언 목록을 별도로 json으로 넣어둠

                          //console.log(getValues('blueTeam.banChamp').filter((v) => v!==''));
                          //const aaaa = gameChampList?.filter((option) => value.includes(option.value));
                          //gameChampList?.filter((option) =>getValues('redTeam.banChamp')?.includes(option.value))
                          //console.log("aaaa:"+JSON.stringify(aaaa));
                          //value는 컨트롤에서 전달 받는 값으로 선택 한 값 뺴고 이전값을 가져 온다
                          const selectedValues = option?.map((v) => v.value)                            

                          if(action.action==="remove-value") {
                            //이건 삭제시 본인것만 푼다
                            selectDisabled(action.removedValue.value, false,'champ')
                          }
                          if(action.action==="select-option") {
                            selectDisabled(action.option?.value, true,'champ')
                          }

                          // 한꺼번에 지워 지는거라 배열로 지워야 된다
                          if(action.action==="clear") {
                              action.removedValues.map((v) => {
                                selectDisabled(v.value, false,'champ');
                              })
                          }
                          onChange(selectedValues);
   
                        }}
                      />
                    )}
                  />
                </Form.Group>    
                {/* 블루 팀 페널티 */}
                <Form.Group controlId="formGridBluePenaltyChamp" className="mt-2"> 
                    <Form.Label> 페널티 챔프</Form.Label>
                    {/* //TODO 컴포넌트로 만들어서 적용 한번 시켜 보기 컴포넌트 완료 되면 적용 할때 많음  Select Css로 적용 해보기 */}
                    {/* //TODO 선택 하면 다른팀 데이터도 같이 disabled 가능 한지 확인 */}
                    <Controller
                      control={control}
                      name="blueTeam.penaltyChamp"
                      render={({ field: { onChange, ref} }) => (  
                        <Select
                          name="formGridBluePenaltyChamp"
                          isClearable
                          isMulti
                          isDisabled={!isRsChecked}
                          options={gameChampList}
                          styles={{
                            container: (base) => ({
                              ...base,
                              backgroundColor: "#0052CC",
                              padding: 2,
                            }),
                          }}
                          // 참조를 전달해줌으로써 hook form이랑 select input이랑 연결 (전달시 에러가 있을시 자동으로 해당 인풋으로 포커스해줌)
                          ref={ref}
                          placeholder="블루 페널티 챔프 선택"
                          value={gameChampList?.filter((option) =>getValues('blueTeam.penaltyChamp')?.includes(option.value))}
                          onChange={(option, action) => {
                            const selectedValues = option.map((v) => v.value)   

                            if(action.action==="remove-value") {
                              //이건 삭제시 본인것만 푼다
                              selectDisabled(action.removedValue.value, false,'champ')
                            }
                            if(action.action==="select-option") {
                              selectDisabled(action.option?.value, true,'champ')
                            }
                            if(action.action==="clear") {
                              //action.removedValues.value
                              gameChampList.map((e) => {
                                action.removedValues.map((v) => {
                                  selectDisabled(v.value, false,'champ');
                                  //e.value===v.value ?   e.isDisabled=true :  e.isDisabled=e.isDisabled
                                })
                              })
                            }                            
                            onChange(selectedValues);
                          }}
                        />
                      )}
                    />
                </Form.Group>  
                
                {/* 블루 팀 게임 결과 */} 
                <Form.Group controlId='formBlueTeamGameData' className='mt-3'>
                <ListGroup>
                    {
                      positionData.map((item, index) => (
                        <ListGroup.Item key={index}>
                          <Row>    
                            <Col xxl={5}>
                              <div className="mt-2">
                                <Form.Check // prettier-ignore
                                  inline
                                  key={item.gameLine}
                                  type="switch"
                                  id={`blueTeamPositon-${item.gameLine}`}
                                  label={item.gameLineName}
                                  value={item.gameLine}
                                  {...register(`blueTeam.teamPositon.${index}`)}
                                  checked
                                />
                                <Form.Check // prettier-ignore
                                  inline
                                  key={`mvp-${item.gameLine}`}
                                  type="radio"
                                  id={`blue-mvp-${item.gameLine}`}
                                  label='MVP'
                                  value={item.gameLine}
                                  disabled={!isRsChecked}
                                  {...register('blueTeam.teamMvp')}
                                />
                              </div>
                            </Col>           
                            {/*  as Col 이 <Col> 이거랑 동일 하다 블루팀유저 */}
                            <Col xxl={7}>
                              <Form.Group controlId={`formGridBlueTeamUser${index}`}>                   
                                <Controller
                                  control={control}
                                  name={`blueTeam.teamUser.${index}`}
                                  render={({ field: { onChange, value, ref, name } }) => (  
                                    <Select
                                      name={`formGridBlueTeamUser${index}`}
                                      isClearable
                                      options={gameBlueTeamList}
                                      // 참조를 전달해줌으로써 hook form이랑 select input이랑 연결 (전달시 에러가 있을시 자동으로 해당 인풋으로 포커스해줌)
                                      ref={ref}
                                      value={gameBlueTeamList?.filter((option) => option.value === value)}
                                      placeholder="블루 팀원 선택"
                                      onChange={(option, action) => {

                                        //액션이 클리어면 초기화
                                        const blueTeamUser = getValues("blueTeam.teamUser");

                                        console.log(action);
                                        if(action.action==="select-option") {
                                          //selectDisabled(option?.value, true, 'user')
                                          gameBlueTeamList?.map((e) => {if(e.value===option?.value)  e.isDisabled=true})
                                        }
                                        //액션이 클리어면 초기화                                        
                                        if(action.action === 'clear') {
                                          resetField(name)
                                          blueTeamUser.splice(index,1);  
                                          gameBlueTeamList?.map((e) => {if(e.value===action.removedValues[0].value)  e.isDisabled=true})
                                          return false
                                        }                                        
                                        onChange(option?.value)                             
              
                                      }}
                                    />
                                  )}
                                />
                              </Form.Group> 
                            </Col>                               
                          </Row>
                          <Row className='mt-2'>
                            <Col>
                              
                                <Form.Check // prettier-ignore
                                  key={`blue-assign-${item.gameLine}`}
                                  type="switch"
                                  id={`blue-assign-${item.gameLine}`}
                                  label={`${item.gameLineName} 지정챔프`}
                                  value={item.gameLine}
                                  disabled={!isRsChecked}
                                  {...register('blueTeam.assignFlag')}
                                  className='mb-2'
                                />

                                {/* //TODO 컴포넌트로 만들어서 적용 한번 시켜 보기 컴포넌트 완료 되면 적용 할때 많음  Select Css로 적용 해보기 */}
                                <Controller
                                  control={control}
                                  name={`blueTeam.champEng.${index}`}
                                  render={({ field: { onChange, value, ref, name} }) => (  
                                    <Select
                                      name={`formGridBlueChampEng${index}`}
                                      isClearable
                                      isDisabled={!isRsChecked}
                                      options={gameChampList}
                                      //defaultValue = {gameBlueTeamList}
                                      // 참조를 전달해줌으로써 hook form이랑 select input이랑 연결 (전달시 에러가 있을시 자동으로 해당 인풋으로 포커스해줌)
                                      ref={ref}
                                      value={gameChampList?.filter((option) => option.value === value)}
                                      placeholder={`블루 ${item.gameLineName} 챔프 선택`}
                                      onChange={(option, action) => {

                                        const blueTeamChamp = getValues("blueTeam.champEng")
                                        //아이템 선택
                                        if(action.action==="select-option") {
                                          selectDisabled(option?.value, true,'champ')
                                        }

                                        //액션이 클리어면 초기화                                        
                                        if(action.action === 'clear') {
                                          resetField(name)
                                          blueTeamChamp.splice(index,1);  
                                          selectDisabled(action.removedValues[0].value, false,'champ')
                                          return false
                                        }                                        
                                        onChange(option?.value)

                                      }}
                                    />
                                  )}
                                />                                
                            </Col>                            
                            <Col xxl={2}>
                              {/* //TODO 이거 동일 한건데 콤포넌트로 만들어 보기 */}
                              <Form.Label>킬</Form.Label>
                              <Form.Control type="number" defaultValue="0"
                                {...register(`blueTeam.teamKillNum.${index}`,{
                                  disabled: !isRsChecked,
                                  setValueAs: v => parseInt(v),
                                  valueAsNumber : true,                                      
                                  validate: {
                                    positive: v => parseInt(v) > -1,
                                  }                                      
                                })} 
                              />
                            </Col>
                            <Col xxl={2}>
                              <Form.Label>데스</Form.Label>
                              <Form.Control type="number" defaultValue="0" 
                                {...register(`blueTeam.teamDeathNum.${index}`,{
                                  disabled: !isRsChecked,
                                  setValueAs: v => parseInt(v),
                                  valueAsNumber : true,                                      
                                  validate: {
                                    positive: v => parseInt(v) > -1,
                                  }                                      
                                })} 
                              />                                  
                            </Col>
                            <Col xxl={2}>
                              <Form.Label>어시</Form.Label>
                              <Form.Control type="number" defaultValue="0"
                                {...register(`blueTeam.teamAssNum.${index}`,{
                                  disabled: !isRsChecked,
                                  setValueAs: v => parseInt(v),
                                  valueAsNumber : true,                                      
                                  validate: {
                                    positive: v => parseInt(v) > -1,
                                  }                                      
                                })} 
                              />                                   
                            </Col>
                                                                      

                          </Row>
                        </ListGroup.Item>

                      ))
                    }
                  </ListGroup>  
                </Form.Group>                                                                       
              </Col>
              {/* 레드팀 시작 */}
              <Col>
                  {/* 레드 팀 선택 
                     TODO 재렌더링이 발생 하면 disabled 가 풀린다
                  */}
                <Form.Group controlId="formGridRedTeamCode">
                  {/* 컨트롤러가 필요 없는게 onchange 시 수동으로 셋팅을 해야 되는게 있다 굳이 필요가 없네 */}
                  <Form.Check // prettier-ignore
                    key="redTeamWin"
                    type="radio"
                    id='redTeamWin'
                    label="레드팀 승리"
                    value="red"
                    {...register('gameInfo.teamWin')}
                  />                   
                  <TeamSelect teamCode={getValues('redTeam.teamCode')}  jsonData={gameTeamDataList} 
                    chkJsonData={{title:'레드', color:'#FF5630', name:'redTeam.banChamp'}} 
                    setDisabled={selectDisabled} dataChange={redTeamCodeChange} controlId="formGridRedTeamCode"/>                
{/*                   <Select
                    name="formGridRedTeamCode"
                    options={gameTeamDataList}
                    styles={{
                      container: (base) => ({
                        ...base,
                        backgroundColor: "#FF5630",
                        padding: 2,
                      }),
                    }}                        
                    // 참조를 전달해줌으로써 hook form이랑 select input이랑 연결 (전달시 에러가 있을시 자동으로 해당 인풋으로 포커스해줌)
                    placeholder="레드 팀 선택"
                    value={gameTeamDataList?.filter((v) => v.teamCode === getValues('redTeam.teamCode'))}
                    getOptionValue={(option) => option.teamCode} // changes here!!!
                    onChange={(option, action) => {
                      const redTeamCode = getValues("blueTeam.teamCode")
                      //아이템 선택
                      //console.log("value:"+value); //이전에 선택된 값을 가지고 있는다
                      //console.log("option:"+JSON.stringify(option));
                      if(action.action==="select-option") {
                        //console.log("option-value:"+option?.teamCode)
                        //gameTeamDataList?.map((e) => {if(e.teamCode===option?.teamCode)  console.log(option?.value)})
                        selectDisabled(redTeamCode, false, 'team') //이전에 선택 된 값은 false
                        selectDisabled(option?.teamCode, true, 'team')
                        //console.log(gameTeamDataList);                            
                      }
                      const teamName = option?.teamName===undefined?'':option?.teamName
                      const teamCode = option?.teamCode===undefined?'':option?.teamCode
                      redTeamCodeChange(teamName, teamCode)
                      //onChange(option?.teamCode)   이게 필요 가 없는게 새로 셋팅을 해야 되는게 있어서 따로 뺏다
                    }}
                  /> */}
                </Form.Group>                    
                {/*  레드 밴 챔프 */}           
                <Form.Group controlId="formGridRedBanChamp" className="mt-2"> 
                  <Form.Label> 밴 챔프</Form.Label>
                  {/* //TODO 컴포넌트로 만들어서 적용 한번 시켜 보기 컴포넌트 완료 되면 적용 할때 많음  Select Css로 적용 해보기 */}
                  {/* //TODO 선택 하면 다른팀 데이터도 같이 disabled 가능 한지 확인  valueData={getValues('redTeam.banChamp')} 값전달 안됨*/}

                    <MultiBanSelect  controlId="formGridRedbanChamp" setDisabled={selectDisabled} dataChange={champBan} 
                      chkJsonData={{title:'레드 밴', color:'#FF5630', isRsChecked:isRsChecked, name:'redTeam.banChamp'}} 
                       />       
              {/*    
                    <Controller
                      control={control}
                      name="redTeam.banChamp"
                      render={({ field: { onChange, value, ref, name } }) => (  
                        <Select
                          name="formGridRedBanChamp"
                          isClearable
                          isMulti
                          options={gameChampList}
                          isDisabled={!isRsChecked}
                          styles={{
                            container: (base) => ({
                              ...base,
                              backgroundColor: "#FF5630",
                              padding: 2,
                            }),
                          }}
                          // 참조를 전달해줌으로써 hook form이랑 select input이랑 연결 (전달시 에러가 있을시 자동으로 해당 인풋으로 포커스해줌)
                          ref={ref}
                          placeholder="레드 밴 챔프 선택"
                          value={gameChampList?.filter((option) =>getValues('redTeam.banChamp')?.includes(option.value))}
                          onChange={(option, action) => {

                            //선택한거 사용 못하게 만들려고 한다. 이거 하나로 다 될려나?
                            //이건 이중배열 
                            //TODO 이거 한개로 만들어서 함수 호출 해보기
                            const selectedValues = option.map((v) => v.value)                               
                            
                            if(action.action==="remove-value") {
                              //이건 삭제시 본인것만 푼다
                              selectDisabled(action.removedValue.value, false,'champ')
                            }
                            if(action.action==="select-option") {
                              selectDisabled(action.option?.value, true,'champ')
                            }
                            if(action.action==="clear") {
                              gameChampList.map((e) => {
                                action.removedValues.map((v) => {
                                  selectDisabled(v.value, false,'champ');
                                })
                              })
                            }                            

                            onChange(selectedValues);

                          }}
                        />
                      )}
                    /> 
 */}
                </Form.Group>       
                {/*  레드  페널티 챔프 */}
                <Form.Group controlId="formGridRedPenaltyChamp" className="mt-2"> 
                  <Form.Label> 페널티 챔프</Form.Label>
                  {/* //TODO 컴포넌트로 만들어서 적용 한번 시켜 보기 컴포넌트 완료 되면 적용 할때 많음  Select Css로 적용 해보기 */}
                  {/* //TODO 선택 하면 다른팀 데이터도 같이 disabled 가능 한지 확인  valueData={getValues('redTeam.penaltyChamp')}  갑 전달 안됨*/}

                   <MultiBanSelect controlId="formGridRedPenaltyChamp" setDisabled={selectDisabled} dataChange={champBan}
                      chkJsonData={{title:'레드 패널티', color:'#FF5630', isRsChecked:isRsChecked,  name:'redTeam.penaltyChamp'}} 
                      />


{/*                   <Controller
                    control={control}
                    name="redTeam.penaltyChamp"
                    render={({ field: { onChange, value, ref, name } }) => (  
                      <Select
                        name="formGridRedPenaltyChamp"
                        isClearable
                        isMulti
                        isDisabled={!isRsChecked}
                        options={gameChampList}
                        styles={{
                          container: (base) => ({
                            ...base,
                            backgroundColor: "#FF5630",
                            padding: 2,
                          }),
                        }}
                        // 참조를 전달해줌으로써 hook form이랑 select input이랑 연결 (전달시 에러가 있을시 자동으로 해당 인풋으로 포커스해줌)
                        ref={ref}
                        placeholder="레드 패널티 챔프 선택"
                        value={gameChampList?.filter((option) =>getValues('redTeam.penaltyChamp')?.includes(option.value))}
                        onChange={(option, action) => {

                          const selectedValues = option.map((v) => v.value)           

                          if(action.action==="remove-value") {
                            //이건 삭제시 본인것만 푼다
                            selectDisabled(action.removedValue.value, false,'champ')
                          }
                          if(action.action==="select-option") {
                            selectDisabled(action.option?.value, true,'champ')
                          }
                          if(action.action==="clear") {
                            //action.removedValues.value
                            gameChampList.map((e) => {
                              action.removedValues.map((v) => {
                                selectDisabled(v.value, false,'champ');
                                //e.value===v.value ?   e.isDisabled=true :  e.isDisabled=e.isDisabled
                              })
                            })
                          }                            
                          onChange(selectedValues);
                        }}
                      />
                    )}
                  /> */}
                </Form.Group>  
                {/* 레드팀 팀 게임 결과 */}            
                <Form.Group controlId='formRedTeamGameData' className='mt-3'>
                  <ListGroup>
                    {
                      positionData.map((item, index) => (
                        <ListGroup.Item  key={index}>
                          <Row>    
                            {/* 레드팀원 선택 */}
                            <Form.Group as={Col} controlId={`formGridRedTeamUser${index}`}>
                              {/* TODO unregister은 등록된 값을 빈값으로 초기화 함 완전 지울수 있는 방법 찾기 */}
                              <Controller
                                control={control}
                                name={`redTeam.teamUser.${index}`}
                                render={({ field: { onChange, value, ref, name } }) => (  
                                  <Select
                                    name={`formGridRedTeamUser${index}`}
                                    isClearable
                                    options={gameRedTeamList}
                                    // 참조를 전달해줌으로써 hook form이랑 select input이랑 연결 (전달시 에러가 있을시 자동으로 해당 인풋으로 포커스해줌)
                                    ref={ref}
                                    value={gameRedTeamList?.filter((option) => option.value === value)}
                                    placeholder="레드 팀원 선택"                                          
                                    onChange={(option, action) => {

                                      const redTemaUser = getValues("redTeam.teamUser")

                                        if(action.action==="select-option") {
                                        selectDisabled(option?.value, true,'user')
                                      }

                                      //액션이 클리어면 초기화                                        
                                      if(action.action === 'clear') {
                                        resetField(name)
                                        redTemaUser.splice(index,1);  
                                        selectDisabled(action.removedValues[0].value, false,'user') 
                                        return false
                                      }
                                      onChange(option?.value)
                                  
                                    }}
                                  />
                                )}
                              />                
                            </Form.Group>                             
                            <Col xxl={5}>
                              <div className="mt-2">
                              <Form.Check // prettier-ignore
                                inline
                                key={item.gameLine}
                                type="switch"
                                id={`red-line-${item.gameLine}`}
                                label={item.gameLineName}
                                value={item.gameLine}
                                {...register(`redTeam.teamPositon.${index}`)}
                                //onChange={(e)=>aaaaa(e, index)}
                                checked
                              />   
                              <Form.Check // prettier-ignore
                                inline
                                key={`mvp-${item.gameLine}`}
                                type="radio"
                                id={`red-mvp-${item.gameLine}`}
                                label="MVP"
                                value={item.gameLine}
                                disabled={!isRsChecked}
                                {...register('blueTeam.teamMvp')}
                              />     
                              </div>                         
                            </Col>               


                                                                                                      
                          </Row>
                          <Row className='mt-2'>
                            <Col>
                                <Form.Check // prettier-ignore
                                  key={`red-assign-${item.gameLine}`}
                                  type="switch"
                                  id={`red-assign-${item.gameLine}`}
                                  label={`${item.gameLineName} 지정챔프`}
                                  value={item.gameLine}
                                  disabled={!isRsChecked}
                                  {...register('redTeam.assignFlag')}
                                />
                                  {/* //TODO 컴포넌트로 만들어서 적용 한번 시켜 보기 컴포넌트 완료 되면 적용 할때 많음  Select Css로 적용 해보기 */}
                                  {/* //TODO 선택 하면 다른팀 데이터도 같이 disabled 가능 한지 확인 */}
                                  <Controller
                                    control={control}
                                    name={`redTeam.champEng.${index}`}
                                    render={({ field: { onChange, value, ref, name } }) => (  
                                      <Select
                                        name={`formGridRedChampEng${index}`}
                                        isClearable
                                        isDisabled={!isRsChecked}
                                        options={gameChampList}
                                        // 참조를 전달해줌으로써 hook form이랑 select input이랑 연결 (전달시 에러가 있을시 자동으로 해당 인풋으로 포커스해줌)
                                        ref={ref}
                                        value={gameChampList?.filter((option) => option.value === value)}
                                        placeholder={`레드 ${item.gameLineName} 챔프 선택`}
                                        onChange={(option, action) => {

                                          const redTeamChamp = getValues("redTeam.champEng")

                                          //아이템 선택
                                          if(action.action==="select-option") {
                                            selectDisabled(option?.value, true,'champ')
                                          }
  
                                          //액션이 클리어면 초기화                                        
                                          if(action.action === 'clear') {
                                            resetField(name)
                                            redTeamChamp.splice(index,1);  
                                            selectDisabled(action.removedValues[0].value, false,'champ')
                                            return false
                                          }                                        
                                          onChange(option?.value)                                          

                                        }}
                                      />
                                    )}
                                  />
                            </Col>                          
                            <Col xxl={2}>
                              <Form.Label>킬</Form.Label>
                              <Form.Control type="number" defaultValue="0"
                                  {...register(`redTeam.teamKillNum.${index}`,{
                                    disabled: !isRsChecked,
                                    setValueAs: v => parseInt(v),
                                    valueAsNumber : true,                                      
                                    validate: {
                                      positive: v => parseInt(v) > -1,
                                    }                                      
                                  })} 
                                />                              
                            </Col>         
                            <Col xxl={2}>
                              <Form.Label>데스</Form.Label>
                              <Form.Control type="number" defaultValue="0"
                                  {...register(`redTeam.teamDeathNum.${index}`,{
                                    disabled: !isRsChecked,
                                    setValueAs: v => parseInt(v),
                                    valueAsNumber : true,                                      
                                    validate: {
                                      positive: v => parseInt(v) > -1,
                                    }                                      
                                  })} 
                                />                              
                            </Col>                                             
                            <Col xxl={2}>
                              <Form.Label>어시</Form.Label>
                              <Form.Control type="number" defaultValue="0"
                                  {...register(`redTeam.teamAssNum.${index}`,{
                                    disabled: !isRsChecked,
                                    setValueAs: v => parseInt(v),
                                    valueAsNumber : true,                                      
                                    validate: {
                                      positive: v => parseInt(v) > -1,
                                    }                                      
                                  })} 
                                />                                
                            </Col>                                                                       
                          </Row>
                        </ListGroup.Item>

                      ))
                    }
                  </ListGroup>  
                </Form.Group>
              </Col>
            </Row>
            <div className="d-grid gap-2 mt-2">
              <Button variant="success" type="submit" size="lg">경기 등록</Button>      
            </div> 
          </form>
        </Col>  

        <Col> 
          <h2>{titleSelected.current}</h2>
 
          {
            gameTeamPlayList?.length !== 0 ?
            gameTeamPlayList?.map((item, index) => (
              
              <div key={index}>

                  <div className="mt-2">{item.gameDate} : {item.gwdSetNo} 경기</div>
                  <Accordion>                    
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>    
                        <Col>{item.blueTeamName}</Col>
                        <Col xs={1}>Vs</Col>
                        <Col>{item.redTeamName}</Col>                      
                    </Accordion.Header>
                    <Accordion.Body>   
                      <Row>
                        <Col xs={1}></Col>
                        <Col>{teamRendering(item.blueTeamUser)}</Col>
                        <Col>{teamRendering(item.redTeamUser)}</Col>       
                      </Row>                                     
                    </Accordion.Body>
                  </Accordion.Item>     
                </Accordion>      
              </div>                                        
            )) : <div key={0}><h1>등록된 경기가 없습니다.</h1></div> 
      


          }        

        </Col>

      </Row>
    </Container>
  )
}

export default GamePlay

