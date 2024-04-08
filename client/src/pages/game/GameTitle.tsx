import React, { useState, useEffect } from 'react'
import { ModelGameTitle, ModelGameTitleInput } from '../../model/MgameTitle';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import GameTitleDetail from './GameTitleDetail';
import { useForm } from 'react-hook-form';
import { Col, Container, Row } from 'react-bootstrap';

const GameTitle = () => {

  console.log('부모창 실행');    
  const queryClient = useQueryClient(); 

  //TODO 여기서도 submit가 되는거 같은데 확인 해보기
  const {register, handleSubmit, setFocus, setValue} = useForm<ModelGameTitleInput>({
    defaultValues: {gtTitle:''}});

  const onSubmitHandler = (data:ModelGameTitleInput) => { 
      //console.log("폼 전송11221");
      //data는 객체로 form 안에 있는 모든 값이 들어 있다
      if(data.gtTitle.trim().length <= 0){
        alert('대회명을 입력 하세요!');
        return false;
      } else {
        if (window.confirm("입력한 대회명 "+data.gtTitle+"을(를) 등록 하시겠습니까?")) {
          saveGroupMutation.mutate(data);
        } else {
          return false;
        }        
      }
            
  }
  //const [gameTitleDataList, setGameTitleDataList] = useState<MgameTitleList[]>();
  //const inputTitle = useRef<HTMLInputElement|null>(null); //이건 오류가 난다
  //const inputTitle = useRef() as React.MutableRefObject<HTMLInputElement>  //이건 안난다
  //const { replace } = useFieldArray({ name: 'gameTitle' })

  const [propGameTitleData, setPropGameTitleData] = useState<ModelGameTitle>({gtTitle:'', gtIdx:0});
  const {gtTitle, gtIdx} = propGameTitleData; //비구조화 할당 해서 값을 넣는다 이거 필요 한가?????


  //자식 페이지에 값 넘겨 주기 위해 셋팅
  const subPage = (gtTitle:string, gtIdx:number) => {
    setPropGameTitleData({
      gtTitle : gtTitle,
      gtIdx : gtIdx,
    }); 
    //console.log(propGameTitle, propId);   
    //console.log("===========");   
  }  

  // // 대회 명칭을 가져 온다 리스트 가져 올때만 async  await 꼭 사용 해야 되나 비동기 방식인데? 동기 방식쓸때만 사용 하면 되는거 아님?
  // const getGameTitle = async() => { 
  //   //console.log(`${process.env.REACT_APP_API_ROOT}`); 
  //   //const resp = await (await axios.get('//localhost:4000/api/gameTitle')).data;
  //   const resp = await axios.get(`${process.env.REACT_APP_API_ROOT}/api/gameTitle`);
  //   //console.log(JSON.stringify(resp.data[0])+'---------------');
  //   return resp.data;
  //   //setGameTitleDataList(resp.data);
  // };



/*   //대회 명칭을 저장 시킨다
  const saveGameTitle = () => {
    
    //여기에서는 별도로 파라메타를 넣지 않는다 
    saveGroupMutation.mutate();
  }; */

  // //대회 명칭을 삭제 함수
  const deleteGameTitle = (gtTitle:string, gtIdx:number) => {
      //console.log(id);
      if (window.confirm("선택한 "+gtTitle+" 내용을 삭제 하시겠습니까?")) {
        deleteGroupMutation.mutate(gtIdx);
      } else {
        return false;
      }
     
  };  

  // 데이터를 가져 온다 - 사용방법이 여러 가지 있다 
  const gameTitleData = useQuery<ModelGameTitle[]>({
    queryKey:['gtIdx'], 
    queryFn: async () => {
      const resp = await axios.get(`${process.env.REACT_APP_API_ROOT}/api/gameTitle`);
      //   //console.log(JSON.stringify(resp.data[0])+'---------------');
      return resp.data;    
    },
    retry : 3,
    //queryFn:getGameTitle
  });

  //console.log(gameTitleData.isLoading);
  //데이터 입력
  const saveGroupMutation = useMutation({
    mutationFn: (param:ModelGameTitleInput) => {
      //return updateGroupApi(gameTitle, done, gubun);
      const response = axios.post(`${process.env.REACT_APP_API_ROOT}/api/gameTitle`, param);
      //const response = axios.post('http://106.250.183.138:3040/api/gameTitle', param);
      return response;      
    },
    onSuccess: (res) => {
      //console.log(res.data);  
      if(res.data.errno > 0) {
        alert("에러 : "+res.data.sqlMessage);
      } else {
        queryClient.invalidateQueries({queryKey:['gtIdx']}); // queryKey 유효성 제거
        //reset({ gtTitle: "" })
        setValue("gtTitle","");
        setFocus("gtTitle");
      }
    },
  });  

  const deleteGroupMutation = useMutation({
    // 타입을 지정 해 주지 않으면 오류 발생 typescript 문법 어렵네
    mutationFn: async (idx:number) => {
      //const response = await axios.delete(`${process.env.REACT_APP_API_ROOT}/api/gameTitle/${idx}`, {data:{id:idx}});
      const response = await axios.delete(`${process.env.REACT_APP_API_ROOT}/api/gameTitle/${idx}`);
      return response;      
    },
    onSuccess: (res) => {
      console.log(res.data);  
      if(res.data.errno > 0) {
        alert("에러 : "+res.data.sqlMessage);
      } else {
        queryClient.invalidateQueries({queryKey:['gtIdx']}); // queryKey 유효성 제거
        setFocus("gtTitle");
        alert("삭제 되었습니다");
      }

    },
  });    
 
  // // 이거 말고 useQuery 사용 해 보는것도 좋음 
  useEffect(()=>{
    setFocus("gtTitle");
    //inputTitle.current.focus();
  },[setFocus]); //한번만 실행 시킬때 [] 넣음 특정 값이 변경 되었을때 재 랜더링 할려면 해당 값을 넣어 주면 됨

  return (
    <Container fluid>
      <Row>
        <Col>
          <header>
            <div>Aze 정기 공내</div>
          </header>
          <section>
          <div className="div-search">
              <form id="mainForm" onSubmit={handleSubmit(onSubmitHandler)}>     
              {/* fieldset 이거 input 여러개 일때 사용 해야 되는데 일단 넣음  input ref 를 넣으니 데이터를 가져 오지 않음     */}
              <label className="label-title">대회명</label>                
              <input type="text" {...register("gtTitle")}  defaultValue=""  placeholder="대회명을입력하세요" required/>
              <button type="submit" className="button-inputbox">등록</button> 
              </form>       
          </div>
          </section>
          <div className="float-clear">
          <table style={{width:'100%'}} className='table_board'>
            <thead>
                <tr>
                    <th style={{width:'30%'}}>번호</th>
                    <th style={{width:'35%'}}>제목</th>
                    <th style={{width:'35%'}}>비고</th>
                </tr>
            </thead>
            <tbody>
              {gameTitleData.data?.length !== 0 ?
                gameTitleData.data?.map((item, index) => (

                <tr key={index} onClick={() => subPage(item.gtTitle,item.gtIdx)}>
                  <td>{index+1}</td>
                  <td>{item.gtTitle}</td>
                  {/* {deleteGameTitle} 그냥 함수 호출 */}
                  {/* 삭제는 바로 호출 해도 되는구나 경고문 띄울려면 함수 만들어야 됨* 지금은 index 값을 넘김 json 이라 */}
                  {/* <td><button  onClick={()=> deleteGroupMutation.mutate(item.id)}>삭제</button></td> */}
                  <td><button  onClick={()=> deleteGameTitle(item.gtTitle, item.gtIdx)}>삭제</button></td>
                </tr>
              )) : <tr><td colSpan={3}>등록된 내용이 없습니다</td></tr>
            }
            </tbody>
          </table>   
          </div>        
        </Col>
        <Col><GameTitleDetail gtTitle={gtTitle} gtIdx={gtIdx} /></Col>        
      </Row>
    </Container>
  )
}

export default GameTitle
