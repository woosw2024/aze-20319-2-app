import React, {useState, useRef } from 'react'
import { Accordion, Button, Col, Container, Form, InputGroup, ListGroup, Row } from 'react-bootstrap'
import { ModelGameTitle, ModelGameTitleDetail } from '../../model/MgameTitle';
import { gameChampList, positionData } from '../../model/MgameDefaultData';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';
import { gameTeamCode, gameTeamData } from '../../model/MGameTeam';
import DatePicker from 'react-datepicker';
import {ko} from 'date-fns/locale/ko';
import dayjs from 'dayjs';
import Select from 'react-select';
import { isDisabled } from '@testing-library/user-event/dist/utils';


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

type gamePlaySubmit = {
  gameInfo : {  
    gtdIdx : number;
    gtdTitle:string;
    gtIdx : number;    
    setNum:string;
    GameTime:string;
    gameDate:string;
    gameRs:boolean
  }
  blueTeam : TeamDetail
  redTeam : TeamDetail
}

type TeamDetail = {
  teamCode:number;
  teamName:string;    
  teamUser:string[];
  teamPositon:string[];
  teamCheckbox:string[];
  teamKillNum:string[];
  teamDeathNum:string[];
  teamAssNum:string[];
  champEng:string[];  
  banChamp:string[];
  penaltyChamp:string[];
}

type gamePlayList = {
  gwCode:number 
  gameDate:string, 
  gameTime:string, 
  gwdSetNo:number , 
  redTeamName:string,
  blueTeamName:string,
  redTeamCode:number,
  blueTeamCode:number,
  redTeamAllPoint:number,
  blueTeamAllPoint:number,			
  redTeamUser:string,
  blueTeamUser:string 
}
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
  
  console.log("===GamePlay 랜더링===")
  

  //const prevBlueSelectBox = useRef(0);
  //const prevRedSelectBox = useRef(0);
  //defaultValues 설정 하면 해당 값을 그대로 html dom 에서 받는다
  // 이중 구조로 도 된다 공식문서 보면 됨
  const {register, handleSubmit, setFocus, setValue, getValues, control, unregister, resetField, reset, watch} = useForm<gamePlaySubmit>({
    mode : 'onSubmit',
    // default 로 주니깐 value가 안바뀜 gameDate:dayjs(startDate).format('YYYY-MM-DD')
    defaultValues: {
      gameInfo:{gtdIdx : 0, gtdTitle:'', gtIdx :0, setNum:'1', GameTime:'18', gameDate:dayjs(startDate).format('YYYY-MM-DD'), gameRs:false}, 
      blueTeam:{teamCode:0, teamName:'', teamUser:[], teamPositon:[], teamCheckbox:[], teamKillNum:[], teamDeathNum:[], teamAssNum:[], champEng:[], banChamp:[], penaltyChamp:[]}, 
      redTeam:{teamCode:0, teamName:'', teamUser:[], teamPositon:[], teamCheckbox:[], teamKillNum:[], teamDeathNum:[], teamAssNum:[], champEng:[], banChamp:[], penaltyChamp:[]}, 
      //gameDate:dayjs(startDate).format('YYYY-MM-DD')
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
  const {data:gameTeamDataList, refetch:teamReftch} = useQuery<gameTeamCode[]>({
    queryKey:['teamCode'], 
    queryFn: async () => {
        const gtdIdxVal = getValues('gameInfo.gtdIdx');
        const resp = await axios.get(`${process.env.REACT_APP_API_ROOT}/api/gameTeam/teamList/`,
          {params : { gtdIdx : gtdIdxVal }}
        );
        return resp.data; 
    },    
    retry : 3, //실패시 3번만 실행 하게 한다
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
    //enabled : false
  });   

  //if(blueTeamisLoading) console.log('로딩');
  if(blueTeamIsReftch) console.log('리로딩');
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
  const {data:gameTeamPlayList, refetch:gameTeamPlayReftch, isRefetching:gameTeamPlayIsReftch} = useQuery<gamePlayList[]>({
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
  const teamInfoReset = () => {
    /*setValue  는 값 변경 . unregister은 Controll 이용 할 경우 리셋, reset 는 전체 리셋    */
    unregister(['blueTeam','redTeam'])
    //console.log("blueTeam.teamUser");
    teamReftch();// 팀목록도 리셋    
    gameTeamPlayReftch(); //등록된 경기 내용도 리셋
    blueTeamReftch(); //블루팀 원 초기화
    redTeamReftch(); //레드팀 원 초기화       
  }
  //대회명을 선택 하면 상세 정보를 가져 오게 한다
  // TODO selectbox 선택 시 선택 한 text가져 오는거 만들어야 됨
  const gtIdxChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
    setValue('gameInfo.gtIdx', parseInt(e.target.value));
    //gtdIdx 는 기존에 값을 가지고 있어서 초기화 시켜 준다
    setValue('gameInfo.gtdIdx',0); //이걸 해 줘야 화면이 초기화 된다
    setValue('gameInfo.gtdTitle',''); //이걸 해 줘야 화면이 초기화 된다
    detailRefetch(); // 대회 상세 명 useQuery  enabled 된걸 작동 시키게 한다
    teamInfoReset();//경기 정보 리셋
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

    teamInfoReset();  //경기 정보 리셋
    gameTeamPlayReftch(); //경기내용리셋
  }  

  //블루팀 select Change 선택시
  const blueTeamCodeChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
    //console.log(e.target.value);
    const blueTeamName = e.target.options[e.target.selectedIndex].text;
    const redTeamCode = getValues("redTeam.teamCode").toString();
    const blueTeamCode = e.target.value.toString();    
    if(parseInt(e.target.value) !==0 && redTeamCode === blueTeamCode) {
      alert('레드팀에 '+blueTeamName+' 선택 되어 있습니다.');
      setValue('blueTeam.teamCode', 0); //값을 셋팅 한다
      return false;
    }

/*     setValue('blueTeam',{
      teamUser: [],
      teamCode: parseInt(e.target.value),
      teamName: blueTeamName,
      teamPositon:[],
      teamCheckbox:[],
      teamKillNum:[],
      teamDeathNum:[],
      teamAssNum:[],
      champEng:[]
    }); //이걸 해 줘야 화면이 초기화 된다 */
    unregister('blueTeam')  //이걸 하면 Controll 에 value 값이 초기화
    
    setValue('blueTeam.teamCode', parseInt(e.target.value)); //값을 셋팅 한다
    setValue('blueTeam.teamName', blueTeamName);
    //console.log(getValues('blueTeam'))
    //선택한 팀원 목록을 가져 오도록 한다
    //prevBlueSelectBox.current = parseInt(e.target.value);
    blueTeamReftch();

    //text 가져 오는거 console.log(e.target.options[e.target.selectedIndex].text);
  }  

  //레드팀 선택시
  const redTeamCodeChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
    //e.preventDefault();
    //console.log(e.currentTarget.value);
    const redTeamName = e.target.options[e.target.selectedIndex].text;
    // console.log(typeof(getValues("blueTeamCode")))
    // console.log(typeof(e.target.value))
    const blueTeamCode = getValues("blueTeam.teamCode").toString();
    const redTeamCode = e.target.value.toString();
    if(parseInt(e.target.value) !==0 && redTeamCode === blueTeamCode) {
      alert('블루팀에 '+redTeamName+' 선택 되어 있습니다.');
      //unregister('redTeam.teamCode')
      setValue('redTeam.teamCode', getValues('redTeam.teamCode')); //값을 셋팅 한다
      return false;
    } 
/*  
    이것도 먹는다
     reset({
      redTeam : {
        teamUser: [],
        teamPositon:[],
        teamCheckbox:[],
        teamKillNum:[],
        teamDeathNum:[],
        teamAssNum:[],
        champEng:[]
    }
    }); //이걸 해 줘야 화면이 초기화 된다 */
    //unregister('redTeam')  //이걸 하면 Controll 에 value 값이 초기화    
    setValue('redTeam.teamCode', parseInt(e.target.value)); //값을 셋팅 한다
    setValue('redTeam.teamName', redTeamName);
    //prevRedSelectBox.current = parseInt(e.target.value);
    redTeamReftch();
    //text 가져 오는거 console.log(e.target.options[e.target.selectedIndex].text);
  }  

/*   const blueTeamChecked = (e:React.ChangeEvent<HTMLInputElement>) => {
    console.log(getValues("blueTeamUser"));
    return
  } */
  //정보 저장 하는거 useForm 에 저장 해 두면 한번에 submit로 보낼 수 있구나
  const onSubmitHandlerDetail = (data:gamePlaySubmit) => { 

    console.log(data);
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

    if(data.blueTeam.teamCode <= 0){
      alert('블루팀을 선택 하세요.');
      setFocus('blueTeam.teamCode');
      return;
    }    
    
    const blueUserCount = getValues('blueTeam.teamUser').filter((e) => e!=='').length
    //선수 선택 수
    //if(data.blueTeam.teamUser.length < 5){
    if(blueUserCount < 5){
      alert('블루팀 출전 선수 최소 5명은 선택 하세요.');
      return;
    } 

    if(data.redTeam.teamCode <= 0){
      alert('레드팀을 선택 하세요.');
      setFocus('redTeam.teamCode');
      return;
    }    
    
    const redUserCount = getValues('redTeam.teamUser').filter((e) => e!=='').length        
    if(redUserCount < 5){
      alert('레드팀 출전 선수 최소 5명은 선택 하세요.');
      return;
    }     


    //경기결과 체크에 따라 입력값 체크 한다
    if(isRsChecked) {
      const blueChampCount = getValues('blueTeam.champEng').filter((e) => e!=='').length
      //챔프 선택 수
      if(data.blueTeam.champEng.length < 5){
      //if(blueChampCount < 5){
        alert('블루팀 챔프는 최소 5개 입니다.');
        return;
      } 

      const redChampCount = getValues('redTeam.champEng').filter((e) => e!=='').length    
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
          teamInfoReset(); //팀정보 리셋             
        } else {
          setNo++
          setValue('gameInfo.setNum', setNo.toString())
          gameTeamPlayReftch(); //경기 등록 정보 리셋
        }
          // 선택된 정보 초기화
          reset({
            blueTeam : {
            teamCode:0,
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
            teamCode:0,
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
        });
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

/*   const aaaaa = (e:React.ChangeEvent<HTMLInputElement>, i:number) => {
    setValue(`blueTeam.teamCheckbox.${i}`, e.target.checked.toString());
  } */
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
            
            <Row className="mb-3">
              <Row>
                <Form.Group as={Col} controlId="formGridSetNum">
                  <Form.Label column="lg" lg={7}>게임 세트</Form.Label>
                  <Form.Select {...register("gameInfo.setNum")}>
                    <option key={1} value={1}>1 SET</option>
                    <option key={2} value={2}>2 SET</option>
                    <option key={3} value={3}>3 SET</option>
                  </Form.Select>  
                </Form.Group>                 
                <Form.Group as={Col} controlId="formGridGameDate">
                  <Form.Label column="lg" lg={7}>경기날짜</Form.Label>
                  {/* //TODO hook form Controll 사용 해 보기 */}
                  <DatePicker 
                    {...register("gameInfo.gameDate")}  
                    showIcon
                    selected={startDate}
                    dateFormat="YYYY-MM-dd" 
                    locale={ko}
                    onKeyDown={e => e.preventDefault()}
                    onChange={(data:Date) => setStartDate(data)} />
                </Form.Group>
                <Form.Group size="sm" as={Col} controlId="formGridGameTime">
                  <Form.Label column="lg" lg={7}>경기시간</Form.Label>
                  <Form.Select {...register("gameInfo.GameTime")}>
                    <option key={1} value="18">오후 6시</option>
                    <option key={2} value="19">오후 7시</option>
                    <option key={3} value="20">오후 8시</option>
                    <option key={4} value="21">오후 9시</option>
                    <option key={5} value="22">오후 10시</option>
                    <option key={6} value="23">오후 11시</option>
                  </Form.Select>  
                </Form.Group>
              </Row>
              <Row>
                <div>동일한 경기날짜,세트,경기시간에 같은 팀은 입력 되지 않습니다.</div>
                <div>게임세트 3SET 일 경우 입력 완료 후 팀 선택은 초기화 됩니다.</div>
              </Row>
            </Row>

            <Row>
              <Col>
                <Form.Check // prettier-ignore
                  key={0}
                  type="switch"
                  id="geamRs"
                  label="경기결과 입력 (경기결과 입력을 원하시면 선택 하세요)"
                  {...register(`gameInfo.gameRs`,{value:false})}
                />        
              </Col> 
            </Row>
            {/* 레드 블루팀 선택 */}
            <Row className="mb-3">
              <Col>
                <h3 className="text-center">블루팀</h3>
                <Form.Group controlId="formGridBlueTeamCode">
                  <Form.Select {...register("blueTeam.teamCode")} id="formGridBlueTeamCode" onChange={blueTeamCodeChange}>
                  <option key={0} value={0}>블루팀 을 선택 하세요</option>            
                  {
                    gameTeamDataList?.map((item, index) => (
                      <option key={index} value={item.teamCode}>{item.teamName}</option>
                    ))
                  }
                  </Form.Select>
                </Form.Group>  
                <Form.Group controlId="formGridBlueBanChamp" className="mt-1"> 
                  <Form.Label> 밴 챔프</Form.Label>
                  {/* //TODO Select 상호 작용 레드랑 같이 되는지 체크 하기 블루에서 A를 고르면 레드에서는 A를 못 고르게(반대상황도 물론 필요) */}
                  {/* //TODO 선택 하면 다른팀 데이터도 같이 disabled 가능 한지 확인 */}
                  <Controller
                    control={control}
                    name="blueTeam.banChamp"
                    render={({ field: { onChange, value, ref, name } }) => (  
                      <Select
                        name="formGridBlueBanChamp"
                        isClearable
                        isMulti
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
                        placeholder="블루 밴 챔프 선택"
                        value={gameChampList?.filter((option) =>getValues('blueTeam.banChamp').includes(option.value))}
                        onChange={(option) => {
                          



                          //value는 방금 선택 한 값이 들어 가있는데? json으로 파싱 히면 값을 구할 수 있다 방금 선택 한값
                          //TODO 챔피언 목록을 별도로 지정 해 놓고 그걸 한번에 사용 하는걸로 가면 편할꺼 같다 해야 될 일
                          //TODO 이거 지금 해야 될꺼 같은데 ㅋ
                          // 위에 생각 간거 챔피언 목록을 별도 저장 해 놓고 챔프 선택 하는 창에서 선택 할때 마다 지우거나 추가 하거나 또는 disabled를 해 보기

                          // 아래는 중복된 챔피언 선택 못 하게 하기, 블루, 레드 밴 및 페널티 챔프
                          const selectedValues = option.map((v) => v.value)                                                    
                          const redBanChamp = getValues("redTeam.banChamp")
                          const redPenaltyChampChk = getValues("redTeam.penaltyChamp")
                          const bluePenaltyChamp = getValues("blueTeam.penaltyChamp")
                          const AllChamp = [...redBanChamp,...redPenaltyChampChk, ...bluePenaltyChamp, ...selectedValues]
                          const result = AllChamp.filter((item, index) => AllChamp.indexOf(item) !== index)




                          if(result.length > 0) {
                            alert("밴 및 패널티 챔프와 중복");
                            //const resetChamp = selectedValues.filter((v) => v!==JSON.stringify(value[0]))
                            onChange(value); //선택한 요소를 제외 하고 다시 리턴 시킨다
                          } else {
                            //console.log('===밴 챔프 값 셋팅==')
                            onChange(selectedValues);
                          }                      
                        }}
                      />
                    )}
                  />
                </Form.Group>    

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
                          onChange={(option, action) => {
                            const selectedValues = option.map((v) => v.value);
                            onChange(selectedValues);
                          }}
                        />
                      )}
                    />
                  </Form.Group>                                                          
              </Col>
              <Col>
                  <h3 className="text-center">레드팀</h3>
                  <Form.Group controlId="formGridRedTeamCode">
                    <Form.Select {...register("redTeam.teamCode")} onChange={redTeamCodeChange}>
                    <option key={0} value={0}>레드팀 을 선택 하세요</option>            
                    {
                      gameTeamDataList?.map((item, index) => (
                        <option key={index} value={item.teamCode}>{item.teamName}</option>
                      ))
                    }
                    </Form.Select>
                  </Form.Group>                
                  <Form.Group controlId="formGridRedBanChamp" className="mt-2"> 
                    <Form.Label> 밴 챔프</Form.Label>
                    {/* //TODO 컴포넌트로 만들어서 적용 한번 시켜 보기 컴포넌트 완료 되면 적용 할때 많음  Select Css로 적용 해보기 */}
                    {/* //TODO 선택 하면 다른팀 데이터도 같이 disabled 가능 한지 확인 */}
                    <Controller
                      control={control}
                      name="redTeam.banChamp"
                      render={({ field: { onChange, value, ref, name } }) => (  
                        <Select
                          name="formGridRedBanChamp"
                          isClearable
                          isMulti
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
                          placeholder="레드 밴 챔프 선택"
                          onChange={(option, action) => {
                            const selectedValues = option.map((v) => v.value);
                            onChange(selectedValues);
                          }}
                        />
                      )}
                    />
                  </Form.Group>       

                  <Form.Group controlId="formGridRedPenaltyChamp" className="mt-2"> 
                    <Form.Label> 페널티 챔프</Form.Label>
                    {/* //TODO 컴포넌트로 만들어서 적용 한번 시켜 보기 컴포넌트 완료 되면 적용 할때 많음  Select Css로 적용 해보기 */}
                    {/* //TODO 선택 하면 다른팀 데이터도 같이 disabled 가능 한지 확인 */}
                    <Controller
                      control={control}
                      name="redTeam.penaltyChamp"
                      render={({ field: { onChange, value, ref, name } }) => (  
                        <Select
                          name="formGridRedPenaltyChamp"
                          isClearable
                          isMulti
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
                          placeholder="레드 페널티 챔프 선택"
                          onChange={(option) => {
                            const selectedValues = option.map((v) => v.value);
                            onChange(selectedValues);
                          }}
                        />
                      )}
                    />
                  </Form.Group>                                   
              </Col>
            </Row>
            <Row className="mb-3 mt-2">
              <Col>
                  <ListGroup>
                    {
                      positionData.map((item, index) => (
                        <ListGroup.Item key={index}>
                          <Row>    
                            <Col xxl={3}>
                              <Form.Check // prettier-ignore
                                key={item.gameLine}
                                type="switch"
                                id={`custom-switch-blue-${item.gameLine}`}
                                label={item.gameLineName}
                                value={item.gameLine}
                                {...register(`blueTeam.teamPositon.${index}`)}
                                checked
                              />
                            </Col>               
                            <Col>
                              <Form.Group as={Col} controlId={`formGridBlueTeamUser${index}`}>                   
                                <Controller
                                  control={control}
                                  name={`blueTeam.teamUser.${index}`}
                                  defaultValue=''
                                  render={({ field: { onChange, value, ref, name } }) => (  
                                    <Select
                                      //inputId={`blueTeam.teamUser.${index}`}
                                      //autoFocus
                                      name={`formGridBlueTeamUser${index}`}
                                      isClearable
                                      options={gameBlueTeamList}
                                      //defaultValue = {gameBlueTeamList}
                                      // 참조를 전달해줌으로써 hook form이랑 select input이랑 연결 (전달시 에러가 있을시 자동으로 해당 인풋으로 포커스해줌)
                                      ref={ref}
                                      value={gameBlueTeamList?.filter((option) => option.value === value)}
                                      placeholder="블루 팀원 선택"
                                      onChange={(option, action) => {
                                        //액션이 클리어면 초기화
                                        const blueTeamUser = getValues("blueTeam.teamUser");
                                        if(action.action === 'clear') {
                                          resetField(name)
                                          blueTeamUser.splice(index,1);
                                          //gamePlaySubmit.blueTeam.teamUser.splice(index,1)
                                          
                                          return false
                                        }
                                        //처음에 값이  undefined 값이라 빈값으로 변경                                  
                                        const paraValue = option?.value===undefined ? '' : option?.value
                                        //현재 입력된 user를 가져옴 본인 index 빼고 중복 되는게 있는지 검사
                                        const blueTemaUserChk = blueTeamUser.filter((a,i) => i !==index).includes(paraValue);
                                        if(blueTemaUserChk) {
                                            alert("블루팀 "+option?.label+" 중복 선택")
                                            //중복이라서 unregister 함
                                            unregister([`blueTeam.teamUser.${index}`]) 
                                            return false
                                        } else {
                                            onChange(option?.value)
                                        }
                                    
                                      }}
                                    />
                                  )}
                                />
                              </Form.Group>                                                                                                     
                            </Col>                            
                          </Row>
                          <Row className='mt-2'>
                            <Col>
                                <Form.Label>{item.gameLineName} 챔프</Form.Label>
                                {/* //TODO 컴포넌트로 만들어서 적용 한번 시켜 보기 컴포넌트 완료 되면 적용 할때 많음  Select Css로 적용 해보기 */}
                                <Controller
                                  control={control}
                                  name={`blueTeam.champEng.${index}`}
                                  render={({ field: { onChange, value, ref, name} }) => (  
                                    <Select
                                      //inputId={`blueTeam.champEng.${index}`}
                                      //autoFocus
                                      name={`formGridBlueChampEng${index}`}
                                      isClearable
                                      isDisabled={!isRsChecked}
                                      options={gameChampList}
                                      //defaultValue = {gameBlueTeamList}
                                      // 참조를 전달해줌으로써 hook form이랑 select input이랑 연결 (전달시 에러가 있을시 자동으로 해당 인풋으로 포커스해줌)
                                      ref={ref}
                                      value={gameChampList?.filter((option) => option.value === value)}
                                      placeholder="블루 챔프 선택"
                                      onChange={(option, action) => {
                                        const blueTeamChamp = getValues("blueTeam.champEng")
                                        //액션이 클리어면 초기화
                                        if(action.action === 'clear') {
                                          resetField(name)
                                          blueTeamChamp.splice(index,1);                                          
                                          return false
                                        }
                                        //처음에 값이  undefined 값이라 빈값으로 변경                                  
                                        const paraValue = option?.value===undefined ? '' : option?.value
                                        //현재 입력된 user를 가져옴 본인 index 빼고 중복 되는게 있는지 검사
                                        const blueChampChk = blueTeamChamp.filter((a,i) => i !==index).includes(paraValue);
                                        const redChampChk = getValues("redTeam.champEng").includes(paraValue); //레드팀일 경우 블루팀챔프모두 검색
                                        if(blueChampChk || redChampChk) {
                                            alert("블루팀 "+option?.label+" 챔프 중복 선택")
                                            //중복이라서 unregister 함
                                            unregister([`blueTeam.champEng.${index}`]) 
                                            return false
                                        } else {
                                            onChange(option?.value)
                                        }
                                    
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
              </Col>
              <Col>

                  <ListGroup>
                    {
                      positionData.map((item, index) => (
                        <ListGroup.Item  key={index}>
                          <Row>    
                            <Col xxl={3}>
                              <Form.Check // prettier-ignore
                                key={item.gameLine}
                                type="switch"
                                id={`custom-switch-red-${item.gameLine}`}
                                label={item.gameLineName}
                                value={item.gameLine}
                                {...register(`redTeam.teamPositon.${index}`)}
                                //onChange={(e)=>aaaaa(e, index)}
                                checked
                              />   
                            </Col>               
                            <Col>
                              <Form.Group as={Col} controlId={`formGridRedTeamUser${index}`}>
                                {/* TODO unregister은 등록된 값을 빈값으로 초기화 함 완전 지울수 있는 방법 찾기 */}
                              <Controller
                                control={control}
                                name={`redTeam.teamUser.${index}`}
                                defaultValue=''
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
                                      //액션이 클리어면 초기화
                                      if(action.action === 'clear') {
                                        resetField(name)
                                        redTemaUser.splice(index,1); 
                                        //.splice(1,1);//banana 객체 삭제
                                        return false
                                      }
                                      //처음에 값이  undefined 값이라 빈값으로 변경                                  
                                      const paraValue = option?.value===undefined ? '' : option?.value
                                      //현재 입력된 user를 가져옴 본인 index 빼고 중복 되는게 있는지 검사
                                      const redTemaUserChk = redTemaUser.filter((a,i) => i !==index).includes(paraValue);
                                      if(redTemaUserChk) {
                                          alert("레드팀 "+option?.label+" 중복 선택")
                                          //중복이라서 unregister 함
                                          unregister([`redTeam.teamUser.${index}`]) 
                                          return false
                                      } else {
                                          onChange(option?.value)
                                      }
                                  
                                    }}
                                  />
                                )}
                              />                
                              </Form.Group>   

                            </Col>                                                                             
                          </Row>
                          <Row className='mt-2'>
                            <Col>
                                  <Form.Label>{item.gameLineName} 챔프</Form.Label>
                                  {/* //TODO 컴포넌트로 만들어서 적용 한번 시켜 보기 컴포넌트 완료 되면 적용 할때 많음  Select Css로 적용 해보기 */}
                                  {/* //TODO 선택 하면 다른팀 데이터도 같이 disabled 가능 한지 확인 */}
                                  <Controller
                                    control={control}
                                    name={`redTeam.champEng.${index}`}
                                    defaultValue=''
                                    render={({ field: { onChange, value, ref, name } }) => (  
                                      <Select
                                        name={`formGridRedChampEng${index}`}
                                        isClearable
                                        isDisabled={!isRsChecked}
                                        options={gameChampList}
                                        // 참조를 전달해줌으로써 hook form이랑 select input이랑 연결 (전달시 에러가 있을시 자동으로 해당 인풋으로 포커스해줌)
                                        ref={ref}
                                        value={gameChampList?.filter((option) => option.value === value)}
                                        placeholder="레드 챔프 선택"
                                        onChange={(option, action) => {

                                          const redTeamChamp = getValues("redTeam.champEng")
                                          //액션이 클리어면 초기화
                                          if(action.action === 'clear') {
                                            resetField(name)
                                            redTeamChamp.splice(index,1);                                           
                                            return false
                                          }
                                          //처음에 값이  undefined 값이라 빈값으로 변경                                  
                                          const paraValue = option?.value===undefined ? '' : option?.value
                                          //현재 입력된 user를 가져옴 본인 index 빼고 중복 되는게 있는지 검사
                                          //챔프는 블루 레드 중복 되지 않게 체크 해 본다
                                          const redChampChk = redTeamChamp.filter((a,i) => i !==index).includes(paraValue);
                                          const blueChampChk = getValues("blueTeam.champEng").includes(paraValue); //레드팀일 경우 블루팀챔프모두 검색
                                          
                                          if(redChampChk || blueChampChk) {
                                              alert("레드팀 "+option?.label+" 챔프 중복 선택")
                                              //중복이라서 unregister 함
                                              unregister([`redTeam.champEng.${index}`])
                                              return false
                                          } else {
                                              onChange(option?.value)
                                          }
                                      
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

