import React, {memo } from 'react'
import { ModelGameTitleDetail, ModelGameTitleDetailInput, ModelGameTitle } from '../../model/MgameTitle';
import axios from 'axios';
//import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

//props 에 name 값이 model에 다르게 들어 왔을 경우 interface를 이용해서 사용 하면 될꺼같다 24.03.24
//TODO 패널티도 입력 할 수 있도록 하기
const GameTitleDetail = (props:ModelGameTitle) => {

  //console.log('자식창 실행');
  //console.log(props.gtTitle + '===' + props.gtIdx);
  const queryClient = useQueryClient();

  //defaultValues 설정 해주는 이유는??
  const {register, handleSubmit, setFocus, setValue} = useForm<ModelGameTitleDetailInput>({
    mode : 'onSubmit',
    //defaultValues: {gtdTitle:'rkskskek', gtIdx:0} //이걸 넣는 이유는 멀까???? 값 셋팅도 안된다
  });
  //const {register, handleSubmit, setFocus, reset} = useForm<ModelGameTitleDetailInput>();

  //이걸로 default 값 설정 한다
  setValue("gtIdx", props.gtIdx); //해당 값을 셋팅
  setValue("gtdTitle", ''); //해당 값을 셋팅

  // === 데이터 저장 ===
  const onSubmitHandlerDetail = (data:ModelGameTitleDetailInput) => { 
      //console.log("폼 전송11221");
      //data는 객체로 form 안에 있는 모든 값이 들어 있다
      //console.log('----------');
           
      //console.log(data);
      if(data.gtdTitle.trim().length <= 0){
        alert('대회 상세명을 입력 하세요!');
        return false;
      } else if(data.gtIdx === 0){
        alert('대회명이 선택 되지 않았습니다.');
        return false;        
      } else {
        if (window.confirm("입력한 대회명 "+data.gtdTitle+"을(를) 등록 하시겠습니까?")) {
          saveGroupMutation.mutate(data);
          return true;
        } else {
          return false;
        }        
      }
            
  }

  //데이터 입력
  const saveGroupMutation = useMutation({
    mutationFn: async (param:ModelGameTitleDetailInput) => {
      //return updateGroupApi(gameTitle, done, gubun);
      //console.log(param);
      const response = await axios.post(`${process.env.REACT_APP_API_ROOT}/api/gameTitleDetail`, param);
      return response;      
    },
    onSuccess: (res) => {
      if(res.data.errno > 0) {
        alert("에러 : "+res.data.sqlMessage);
      } else {
        queryClient.invalidateQueries({queryKey:['gtIdx']}); // queryKey 유효성 제거
        //reset({ gtdTitle: "" })
        setValue("gtdTitle", "");
        setFocus("gtdTitle");
      }      

    },
  });    

  // === 데이터 저장 끝 ===
/*   
  // 대회 명칭을 가져 온다 리스트 가져 올때만 async  await 꼭 사용 해야 되나 비동기 방식인데? 동기 방식쓸때만 사용 하면 되는거 아님?
  const getGameDetailTitle = async() => { 
      //console.log(propId+"==============");
      //console.log(`${process.env.REACT_APP_API_ROOT}`); 
      //const resp = await (await axios.get('//localhost:4000/api/gameTitle')).data;
      const resp = await axios.get(`${process.env.REACT_APP_API_ROOT}/api/gameTitleDetail/${props.gtIdx}`);
      //console.log(resp.data+'---------------');
      return resp.data;
      //setGameTitleDataList(resp.data);
  };
 */
  const queryDetail = useQuery<ModelGameTitleDetail[]>(
  {
      queryKey:['gtIdx', props.gtIdx],  //아이디 값을 넣어 주면 바로 바로 렌더링 된다.
      queryFn: async () => {
        const resp = await axios.get(`${process.env.REACT_APP_API_ROOT}/api/gameTitleDetail/${props.gtIdx}`);
        //   //console.log(JSON.stringify(resp.data[0])+'---------------');
        return resp.data;    
      },
      retry : 3,         
      //queryFn:getGameDetailTitle
  });


  //console.log(queryDetail);
  // //대회 명칭을 삭제 시킨다
  const deleteGameTitleDetail = (gtdTitle:string, gtdIdx:number) => {
    //console.log(id);
    if (window.confirm("선택한 "+gtdTitle+" 내용을 삭제 하시겠습니까?")) {
        deleteGroupMutation.mutate(gtdIdx);
    } else {
        return false;
    }
  };      

  const deleteGroupMutation = useMutation({
    // 타입을 지정 해 주지 않으면 오류 발생 typescript 문법 어렵네
    mutationFn: async (gtdIdx:number) => {
      //const response = await axios.delete(`${process.env.REACT_APP_API_ROOT}/api/gameTitle/${idx}`, {data:{id:idx}});
      // 이건 body로 보내는거
      //const response = await axios.delete(`${process.env.REACT_APP_API_ROOT}/api/gameTitleDetail`, {data:{gtdIdx:gtdIdx, gtIdx:props.gtIdx}});
      //아래에껀 세그먼트로 보내는거
      const response = await axios.delete(`${process.env.REACT_APP_API_ROOT}/api/gameTitleDetail/${gtdIdx}/${props.gtIdx}`);
      return response;     
    },
    onSuccess: (res) => {
      //console.log(res.data);  
      if(res.data.errno > 0) {
        alert("에러 : "+res.data.sqlMessage);
      } else {
        queryClient.invalidateQueries({queryKey:['gtIdx']}); // queryKey 유효성 제거
        setFocus("gtdTitle");
        alert("삭제 되었습니다");
      }

    },
  });  

/*   const deleteGroupMutation = useMutation({
      // 타입을 지정 해 주지 않으면 오류 발생 typescript 문법 어렵네
      mutationFn: (gtdIdx:number) => {
          const response = axios.delete(`${process.env.REACT_APP_API_ROOT}/api/gameTitleDetail`, {data:{gtdIdx:gtdIdx, gtIdx:props.gtIdx}});
          return response;      
      },
      onSuccess: () => {
          queryClient.invalidateQueries({queryKey:['gtIdx']}); // queryKey 유효성 제거
          setFocus("gtdTitle");
          alert("삭제 되었습니다");
      },
  });    */


/* 
   //대회 명칭을 저장 시킨다
   const saveGameTitle = () => {
    //console.log('sdfsdf');
    // react query mutate
    // FormData 생성하기 해서 입력값 체크??? 아니면 새로운 벨리데이터를 이용 해서 사용 해야 되나? 고민 24.03.24
    //const formData  = new FormData(); 
    //console.log(gameTitle.trim().length);
    if (subGameTitle.trim().length <= 0) {
      alert("게임 상세명을 입력 하세요");
      inputTitle2.current.focus();
      setGameTitleData({
        ...gameTitleData,
        subGameTitle: '',
      });      
      return;
    }
    //여기에서는 별도로 파라메타를 넣지 않는다 
    saveGroupMutation.mutate();
  };
  
 */

  //console.log(queryDetail.data?.length);
  //이렇게 사용 하는게 맞나 몰것다???
  //이건 작동도 안함 포커스가 안감 머지??? 아래에 focus 작동도 안함 머지??
/*   useEffect(()=>{
    //setValue("gtdTitle","");
    setFocus("gtdTitle");
    //inputTitle.current.focus();
  },[setFocus]); //한번만 실행 시킬때 [] 넣음 특정 값이 변경 되었을때 재 랜더링 할려면 해당 값을 넣어 주면 됨
 */

  return (
    <div>
        <div>Aze {props.gtTitle} 정기 공내 상세</div>
        <div className="div-search">
            <form id="detailForm" onSubmit={handleSubmit(onSubmitHandlerDetail)}> 
            <label className="label-title">대회명상세</label>
            <input type="text" {...register("gtdTitle")} defaultValue=""  placeholder="대회 상세명을 입력하세요" required/>
            
            {/* <input type="text" name="subGameTitle" onChange={onChange} placeholder="대회 상세명을 입력하세요" required/> */}
            <button  className="button-inputbox">등록</button>
            </form>
        </div>     
        <table style={{width:'100%'}} className='table_board'>
          <thead>
              <tr>
                  <th style={{width:'10%'}}>번호</th>
                  <th style={{width:'35%'}}>대회명</th>
                  <th style={{width:'35%'}}>상세명</th>
                  <th style={{width:'30%'}}>비고</th>
              </tr>
          </thead>           
          <tbody>
          {/* {queryDetail.data?.filter(data => data.mainId === propId).map((item, index) => (
            <tr key={index}>
              <td>{item.id}</td>
              <td>{item.subGameTitle}</td>
              <td>{item.done? 'Y' : 'N'}</td>
            </tr>
            ))} */}
          {queryDetail.data?.length !== 0 ?
            queryDetail.data?.map((item, index) => (
            <tr key={index}>
              <td>{index+1}</td>
              <td>{props.gtTitle}</td>
              <td>{item.gtdTitle}</td>
              <td><button  onClick={()=> deleteGameTitleDetail(item.gtdTitle, item.gtdIdx)}>삭제</button></td>
            </tr>
            )) : <tr><td colSpan={4}>등록된 내용이 없습니다</td></tr>
          }
          </tbody>
        </table>               
    </div>
  )
}

export default memo(GameTitleDetail)
