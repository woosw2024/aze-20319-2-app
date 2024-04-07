import React, {useEffect } from 'react'
import { ModelGameTitle, ModelGameTitleDetail } from '../../model/MgameTitle';
import axios from 'axios';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { ModelAzeUser, ModelAzeUserDel } from '../../model/MazeUser';
import {Button, Row, Col, Form, Container, Accordion } from 'react-bootstrap';
import { gameTeamList, gameTimeRegister } from '../../model/MGameTeam';




// teamUser
//TODO 나중에 useState 로 하던지 json_server를 이용 하던지 해보자
const teamAddUserData:ModelAzeUserDel[]=[{userIdx:0, lolNick:''}];

// TODO 팀원 추가 후 삭제 버튼을 눌르면 선택한 팀원 모두 삭제 되는 경우가 가끔 발생 찾아 보기
const GameTeam = () => {

  //TODO 추가 , 삭제 버튼 선택시 리렌더링 됨 - 확인된 이유 : onClick 에 함수형으로 만들어서 발생
  //TODO 등록된 팀을 볼 수 있는 걸 만들어야 된다
  //TODO 선택된 대회에 등록된 선수는 안보이게 하는 기능 추가 또는 회원목록 선택 되면 사라지고 팀원선택리스트에서 선택 하면 회원목록에 나오도록 하기

  //console.log('======= 대회팀관리 시작 =======');
  //const queryClient = useQueryClient(); 
  //상세 대회및 대회명 검색시 사용
  //useState 가 자동으로 0으로 변경이 된다.
  //const gtIdxRef = useRef<number>(0); //검색을 할때를 컴파일 안되게 useRef로 사용 해봄
  //const gtdIdxRef = useRef<number>(0); //검색을 할때를 컴파일 안되게 useRef로 사용 해봄
  


  //defaultValues 설정 하면 해당 값을 그대로 html dom 에서 받는다
  const {register, handleSubmit, setFocus, setValue, resetField, getValues} = useForm<gameTimeRegister>({
    mode : 'onSubmit',
    //defaultValues: {gtdIdx:gtdIdxRef.current, gtIdx:gtIdxRef.current, teamName:'', teamData:teamAddUserData}
    defaultValues: {gtdIdx:0, gtIdx:0, teamName:''}
  }); 

  //TODO 웹 특성상 한번 열어 놓으면 새로운 데이터를 가져 오지 않는다 이걸 useQuery에서 처리가 가능 할까?
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
  const {data:gameTitleDetailData, refetch:detailRefetch} = useQuery<ModelGameTitleDetail[]>({
    queryKey:['gtdIdx'], 
    queryFn: async () => {
      const gtIdxVal = getValues('gtIdx');
      //const resp = await axios.get(`${process.env.REACT_APP_API_ROOT}/api/gameTitleDetail/${gtIdxRef.current}`);
      const resp = await axios.get(`${process.env.REACT_APP_API_ROOT}/api/gameTitleDetail/${gtIdxVal}`);
      //   //console.log(JSON.stringify(resp.data[0])+'---------------');
      return resp.data;    
    },
    retry : 3, //실패시 3번만 실행 하게 한다
    enabled:false
    //queryFn:getGameTitle
  });  


  //회원 목록을 가져 온다
  //TODO 입력된 회원을 제외 하고 리스트 뿌리는거 만들기
  const {data:azeUserData} = useQuery<ModelAzeUser[]>({
    queryKey:['userIdx'], 
    queryFn: async () => {
      const resp = await axios.get(`${process.env.REACT_APP_API_ROOT}/api/azeUser`, {
        params:{
            schVal : ''
        }
      });
      //   //console.log(JSON.stringify(resp.data[0])+'---------------');
      return resp.data;
    },
    retry : 3, //실패시 3번만 실행 하게 한다
    //TODO 실행된 결과물에 대해서 다시 필터 해서 가져오는 방법 select 만 실행 1. 서버에 데이터를 또 요청 한다. 그거 없이 하는 방법은? 
    //select: (data) => data.filter((user) => user.lolNick.includes(filters))  //이걸로 필터를 할 수는 있는데 재 실행을 해서 값을 넘겨 주는 방법은?
    //queryFn:getGameTitle
  });



  //선택한 팀 회원 목록을 가져 온다 
  // TODO isRefetching 사용방법 확인 하기
  const {data:teamUserData, refetch:teamUserRefetch, isRefetching:teamUserIsRefetch} = useQuery<ModelAzeUserDel[]>({
    queryKey:['userTeamIdx'], 
    queryFn: () => {
      return teamAddUserData
    }    
    //TODO 실행된 결과물에 대해서 다시 필터 해서 가져오는 방법 select 만 실행 1. 서버에 데이터를 또 요청 한다. 그거 없이 하는 방법은? 
    //select: (data) => data //이걸로 필터를 할 수는 있는데 재 실행을 해서 값을 넘겨 주는 방법은?
    //queryFn:getGameTitle
  });
  

  //선택한 대회에 등록된 팀 목록 가져 온다  
  //TODO 에러 발생시 처리 방법 넣기 queryFn 에서  에러가 axios에서 나서 error 이게 안되는거 같다
  //typescript 제네릭으로 선언 되면 변경 할 수 없고 해당 타입만 와야 된다
  //TODO 이게 외 3번이 로딩 되지 여기 GameTeam 컴포넌트도 3번 랜더링 된다 머지 이거
  const {data:gameTeamDataList, refetch:teamReftch} = useQuery<gameTeamList[]>({
    queryKey:['teamCode'], 
    queryFn: async () => {
        //console.log(schGtdIdx+'====');
        //에러가 나면 어떻게 처리 하지????
        console.log("데이터 실행")
        const gtdIdxVal = getValues('gtdIdx');
        const resp = await axios.get(`${process.env.REACT_APP_API_ROOT}/api/gameTeam/teamListAll/`,
         {params : { gtdIdx : gtdIdxVal }}
        );
        return resp.data; 
    },    
    retry : 3, //실패시 3번만 실행 하게 한다
    //enabled:false
    //queryFn:getGameTitle
  });  

/*   if(gameTeamErrorStatus) return (
    <>
      <div>{gameTeamError.toString()}</div>
    </>
  ) */

  //계속 되는건가 렌더링이?
  //console.log(isRefetching);
  //console.log(teamAddUserData);
  
  // 팀을 추가 한다 json 을 이용 해서 클라이언트에서 생성 한다
  // e:React.MouseEvent<HTMLButtonElement, MouseEvent>
  const teamAddUser = (userIdx:number, lolNick:string) => {
    if (getValues('gtIdx') === 0) {
      alert("대회명을 선택 하세요");
      return false;
    } else if (getValues('gtdIdx') === 0) {
      alert("대회 상세명을 선택 하세요");
      return false;
    }

    //일단 undefiend를 반환 하는걸로 처리 함 json 으로 저장 했다가 이걸 다시 사용 하도록 한다
    const found = teamAddUserData.find((element) => userIdx === element.userIdx); //undefined 를 반환 하면 없다는뜻
    if (found === undefined) {
      teamAddUserData.push({userIdx, lolNick});      
    }    
    
    //새로 가공 해서 넣을 필요 업음 이유는 formsubmit 할때 값을 가공 해서 넘겨서
    //setValue('teamData', teamAddUserData); //여기다가 하니깐 일단 되긴 된다 

    //console.log(teamAddUserData);
    //queryClient.invalidateQueries({queryKey:['userTeamIdx']}); //기존 캐싱값 제거       
    teamUserRefetch(); //새로 고침 역할        
    //TODO 로컬스토리지 사용 해보기 setItem은 한번 밖에 안됨
  };      

  
  // === 데이터 저장 ===
  const onSubmitHandlerDetail = (data:gameTimeRegister) => { 
      //console.log("폼 전송11221");
      //data는 객체로 form 안에 있는 모든 값이 들어 있다
      //console.log('----------');
      //console.log(data);
      //console.log(teamAddUserData);
      //setValue('teamData', teamAddUserData);  //여기다 하니깐 첫번째 로딩에는 데이터가 들어 가지 않는다
      if(data.gtIdx === 0){
        alert('대회명을 선택 하세요!');
        setFocus('gtIdx');
        return false;
      }

      if(data.gtdIdx === 0){
        alert('대회 상세명을 선택 하세요!');
        setFocus('gtdIdx');
        return;
      }

      if(data.teamName.trim() === ''){
        alert('대회 팀명을 입력 하세요!'); 
        setFocus('teamName');
        return false;
      }

      if(teamAddUserData.length <= 0){
        alert('팀원을 선택 하세요!'); 
        return false;
      }

      //TODO 선택된 seletbox에 대한 text 가져 와서 뿌려 주는거 하기
      if (window.confirm("선택한 대회에 "+data.teamName+"팀(으)로 등록 하시겠습니까?")) {
        saveGroupMutation.mutate(data);
      } else {
        return false;
      }        
  }

  //대회에 참가할 팀 데이터 입력
  const saveGroupMutation = useMutation({
    mutationFn: async (param:gameTimeRegister) => {
      //return updateGroupApi(gameTitle, done, gubun);
      //console.log('===== 데이터 전송 =====');
      //console.log(param);
      // 가공해서 넘기는데 userForm 에 있을 필요 있나????
      //let userIdxArray = param.teamData.map((item) => item.userIdx); //userIdx 값을 배열로 만듬
      const userIdxArray = teamAddUserData.map((item) => item.userIdx); //userIdx 값을 배열로 만듬
      const teamUserArray = userIdxArray.join('##');
      //TODO bossFlag radio 로 넘기는 방법 만들기
      //console.log(param.bossFlag);
/*    
      let gtdIdx = req.body.gtdIdx;
      let teamName = req.body.teamName;
      let temaUserArray = req.body.temaUserArray;
      let bossFlagArray = req.body.bossFlagArray;
      let arrayCount = req.body.arrayCount;
*/      
     const response = await axios.post(`${process.env.REACT_APP_API_ROOT}/api/gameTeam`, {
          gtdIdx:param.gtdIdx,
          teamName:param.teamName,
          arrayCount:userIdxArray.length,
          teamUserArray : teamUserArray,
          bossFlagArray : '' //이거 수정 되면 DB 쪽에도 수정 들어 가야 됨
       });
      return response;
    },
    onSuccess: (res) => {

      if(res.data.errno > 0) {
        alert("에러 : "+res.data.sqlMessage);
      } else {
        //form data reset - 팀명칭이랑 팀데이터
        //reset({teamName:'', teamData:[]});  //defaultValues 의 양식변경
        resetField("teamName")
        //TODO 이것도 공통으로 사용 하기 useEffect 에 있음
        teamAddUserData.length = 0; //입력된 팀원데이터 초기화 
        //console.log(teamAddUserData);
        teamUserRefetch(); //json으로 저장 된 팀원 목록 새로 고침 함
        teamReftch(); //등록된 팀리스트 새로고침
        // 회원정보 다시 가져오기 해야 되나????
        // queryClient.invalidateQueries({queryKey:['gtIdx']}); // queryKey 유효성 제거
      } 

    },
  });    
  
  
  //대회명을 선택 하면 상세 정보를 가져 오게 한다
  // TODO selectbox 선택 시 선택 한 text가져 오는거 만들어야 됨
  const gtIdxChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
    //console.log(e.target.selectedOptions.);
    setValue('gtIdx', parseInt(e.target.value));
    //gtdIdx 는 기존에 값을 가지고 있어서 초기화 시켜 준다
    //gtIdxRef.current = parseInt(e.target.value);
    //gtdIdxRef.current = 0; //초기화 해 줘야 된다 이거 
    setValue('gtdIdx',0); //이걸 해 줘야 화면이 초기화 된다
    azeUserReload();
  }

  //대회명 상세를 선택 하면 등록된 팀 정보를 정보를 가져 오게 한다
  const gtdIdxChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
    //console.log(e.target.value);
    //setSchGtdIdx(parseInt(e.target.value));
    setValue('gtdIdx', parseInt(e.target.value)); //값을 셋팅 한다
    //gtdIdxRef.current = parseInt(e.target.value);
    //queryClient.invalidateQueries({queryKey:['teamCode']}); // queryKey 유효성 제거
    teamReftch();//teamListRefetch();
  }  

  //대회 상세 정보 쿼리 재 시작
  const azeUserReload = () => {
    //console.log('== 재시작 ==');
    teamReftch(); //teamListRefetch(); 등록된 팀원 목록 새로고침
    detailRefetch(); // 대회 상세 명 useQuery  enabled 된걸 작동 시키게 한다
    //queryClient.invalidateQueries({queryKey:['gtdIdx']}); // queryKey 유효성 제거
  }

  //useEffect 이거 사용 안하면 setState(비동기라 바로 적용이 안되어서) 사용 해도 바로 적용이 안된다 머지?
  //대회명 변경시 대회 상세명 가져 오도록 하는거
  //다시 렌더링 되지 않는 걸 넣으면 에러가 나네
/*   useEffect(()=>{
    azeUserReload();
  },[gtIdxRef.current]) */

  //처음 로딩시 팀리스트 값 초기 화 시킴
  useEffect(()=>{  teamAddUserData.length=0;},[])
  
  //TODO 팀 생성시 스크롤에 따라 다니는 기능 추가
  

  // === 데이터 저장 ===
  const removeTeamUserData = (index:number) => { 
    teamAddUserData.splice(index,1);
    //setValue('teamData', teamAddUserData); //TODO 이걸 한곳에서 할 수 없나??
    teamUserRefetch(); //팀리스트 새로 고침
  }
  
  // 함수로 루프를 돌린다
  const rendering = (teamUser:string) => {
    const result = [];
    const teamUserArray = teamUser.split('|');
    for (let i = 0; i < teamUserArray.length; i++) {
      result.push(<div key={i}>{teamUserArray[i]}</div>);
    }
    return result;
  };

  return (

    
    <Container fluid>
      <header>
        <div className="header-title">대회 팀 관리</div>
      </header>      

      <form id="mainForm" onSubmit={handleSubmit(onSubmitHandlerDetail)}>  
      <Row className="mb-3 w-75 p-2">
        <Form.Group as={Col} controlId="formGridGtIdx">
          <Form.Select {...register("gtIdx")} onChange={gtIdxChange}>
          <option key={0} value={0}>대회명을 선택 하세요</option>            
          {
            gameTitleData?.map((item, index) => (
              <option key={index} value={item.gtIdx}>{item.gtTitle}</option>
            ))
          }
          </Form.Select>
        </Form.Group>     

        <Form.Group as={Col} controlId="formGridGtdIdx">
          <Form.Select {...register("gtdIdx")} onChange={gtdIdxChange}>
          <option key={0} value={0}>상세 대회명을 선택 하세요 선택 하세요</option>            
          {
            gameTitleDetailData?.map((item, index) => (
              <option key={index} value={item.gtdIdx}>{item.gtdTitle}</option>
            ))
          }
          </Form.Select>  
        </Form.Group> 

    
      </Row>
      {/* 여러개 묶을려면 Row 한줄로 사용 할려면 Form.Group로 */}
      <Row className="mb-3 p-2">
        <Col>
        <Form.Group as={Col} controlId="formGridUserList">
          <h4>회원 목록</h4>
          <table style={{width:'100%'}} className='table_board'>
          <thead>
              <tr>
                  <th style={{width:'25%'}}>롤 Nick</th>
                  <th style={{width:'20%'}}>비고</th>
              </tr>
          </thead>
          <tbody>
            {azeUserData?.length !== 0 ?
              azeUserData?.map((item, index) => (

              <tr key={index}>
                  <td>{item.lolNick}</td>
                  {/* {deleteGameTitle} 그냥 함수 호출 */}
                  {/* 삭제는 바로 호출 해도 되는구나 경고문 띄울려면 함수 만들어야 됨* 지금은 index 값을 넘김 json 이라 */}
                  {/* <td><button  onClick={()=> deleteGroupMutation.mutate(item.id)}>삭제</button></td> */}
                  <td>
                    {/* TODO  버튼을 선택 하면 리렌더링 된다 onClick 빼면 리렌더링 안됨 확인 해야 됨 */}
                    <Button as="a" size="sm" variant="primary" onClick={(e)=> { e.preventDefault(); teamAddUser(item.userIdx,item.lolNick)}}>추가</Button>
                  </td>
              </tr>
              )) : <tr><td colSpan={2}>이미 선택 되었거나 등록된 내용이 없습니다</td></tr>
            }
          </tbody>
          </table>   
        </Form.Group>
        </Col>
        <Col>
        <Form.Group as={Col} controlId="formGridUserChoiceList">
          <h4>팀원 선택 리스트</h4>
          <div className="mb-2">
          <Form.Group as={Col} controlId="formGridTeamName">
            {/* htmlFor="teamName" visuallyHidden 에는 안됨 에러 남*/}
            <Form.Label  visuallyHidden>팀 명칭 </Form.Label>          
            <Form.Control {...register('teamName')} placeholder='팀 명칭을 입력 하세요' size="lg"/>
          </Form.Group>
          </div>

          <table style={{width:'100%'}} className='table_board'>
          <thead>
              <tr>
                  <th style={{width:'70%'}}>팀원</th>
                  <th style={{width:'15%'}}>비고</th>
              </tr>
          </thead>
          <tbody>
            {
            teamUserData?.length !== 0 ?
              teamUserData?.map((item, index) => (
              //TODO 추가 해야 될 내용이 많을꺼 같다 예를들어 점수 라던지 포지션이라던지
              <tr key={index}>
                  <td>{item.lolNick}</td>
                  {/* {deleteGameTitle} 그냥 함수 호출 */}
                  {/* 삭제는 바로 호출 해도 되는구나 경고문 띄울려면 함수 만들어야 됨* 지금은 index 값을 넘김 json 이라 */}
                  {/* <td><button  onClick={()=> deleteGroupMutation.mutate(item.id)}>삭제</button></td> */}                          
                  <td><Button as="a" size="sm" onClick={(e)=> {e.preventDefault(); removeTeamUserData(index)}}>삭제</Button></td>                          
              </tr>
              )) : <tr><td colSpan={3}>선택된 팀원이 없습니다.</td></tr>
            }
          </tbody>
          </table>              
          <div className="d-grid gap-2 mt-2">
            <Button variant="secondary" type="submit" size="lg">팀 등록</Button>      
          </div>       
        </Form.Group>
        </Col>
        <Col>
        <Form.Group as={Col} controlId="formGridUserChoiceList">
          <h4>팀 목록</h4>
          <Accordion defaultActiveKey="0">          
            {
              gameTeamDataList?.length !== 0 ?
                gameTeamDataList?.map((item, index) => (
                    <Accordion.Item eventKey={item.teamCode.toString()} key={index}>
                      <Accordion.Header>{item.teamName}</Accordion.Header>
                      <Accordion.Body>   
                        {rendering(item.lolNick)}
                      </Accordion.Body>
                    </Accordion.Item>                 
              )) : <div>등록된 팀이 없습니다.</div> 
            }      
            </Accordion>                
        </Form.Group>  
        </Col>      
      </Row>
      </form>  
    </Container>                 

  )
}

export default GameTeam;

