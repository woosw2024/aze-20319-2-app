import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { ModelAzeUser, ModelAzeUserDel, ModelAzeUserInput, ModelAzeUserProp } from '../../model/MazeUser';
import axios from 'axios';
//import { createPortal } from 'react-dom'; //TODO div 팝업창 나중에 해 보자
//import Modal from '../../components/Modal';
import UserUpdateModal from './UserUpdateModal';
import { useForm } from 'react-hook-form';
import Modal from '../../components/Modal';
import { Container } from 'react-bootstrap';

//TODO bigint 형 숫자가 16자리 넘어 가면 숫자가 이상 해 진다 확인 해야됨 지금은 16자로만 사용 하도록 했음


/* export const useGetEmployees = (filters:string) => {
    return useQuery<ModelAzeUser[]>(['employess',filters], () => fetchExployess(filters));
} */

//TODO String 는 객체 string 문자열
const AzeUser = () => {
  
  const queryClient = useQueryClient(); 
  const [propsVal, setpropsVal] = useState<ModelAzeUserProp>({lolNick:'', outFlag:'', userIdx:0});
  const {lolNick, outFlag, userIdx} = propsVal;  
  const [schVal, setSchVal] = useState<string>('');
  const [filters, setFilters] = useState<string>('');
  //console.log('azeuser 페이지 렌더링 됨');
  //console.log('filters :' + filters);
/*   
  const [filters, setFilters] = useState<string>('');
  const {data} = useGetEmployees(filters); 
*/
  //const [searchVal, setSearchVal]= useState<string>('');

  // 데이터를 가져 온다 - 사용방법이 여러 가지 있다 

  // // 대회 명칭을 가져 온다 리스트 가져 올때만 async  await 꼭 사용 해야 되나 비동기 방식인데? 동기 방식쓸때만 사용 하면 되는거 아님?
/*   const getGameTitle = async() => { 
    //console.log(`${process.env.REACT_APP_API_ROOT}`); 
    //const resp = await (await axios.get('//localhost:4000/api/gameTitle')).data;
    const resp = await axios.get(`${process.env.REACT_APP_API_ROOT}/api/azeUser`, {
      params:{
          schVal : filters
      }
    });
    //console.log(JSON.stringify(resp.data[0])+'---------------');
    return resp.data;
    //setGameTitleDataList(resp.data);
  }; */
  
  //이건 특별한 게 없으면 리덴더링이 안된다
  // TODO 검색 할때 useState 안쓰고 해 보기 useForm을 이용해서 값을 넣고 난 후에 값을 가져 와서 해 보기
  const {data:azeUserData} = useQuery<ModelAzeUser[]>({
    queryKey:['userIdx'], 
    queryFn: async () => {
      const resp = await axios.get(`${process.env.REACT_APP_API_ROOT}/api/azeUser`, {
        params:{
            schVal : filters
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


  const {register, handleSubmit, setFocus, setValue} = useForm<ModelAzeUserInput>({mode : 'onSubmit'});

  const onSubmitHandler = (data:ModelAzeUserInput) => { 
      //console.log("폼 전송11221");
      //data는 객체로 form 안에 있는 모든 값이 들어 있다
      if(data.lolNick.trim().length <= 0){
        alert('롤 닉네임을 입력 하세요!');
        return false;
      } else {
        if (window.confirm("입력한 "+data.lolNick+"을(를) 등록 하시겠습니까?")) {
          saveUserMutation.mutate(data);
        } else {
          return false;
        }
      }
  }  

  //데이터 입력
  const saveUserMutation = useMutation({
    mutationFn: (param:ModelAzeUserInput) => {
      //return updateGroupApi(gameTitle, done, gubun);
      //console.log(param);
      const response = axios.post(`${process.env.REACT_APP_API_ROOT}/api/azeUser`, param);
      //const response = axios.post('http://106.250.183.138:3040//api/azeUser', param);
      return response;      
    },
    onSuccess: (res) => { 
      //내가 만든건 이렇게 오는데 자체 에러는 어떻게 넘어 올까 확인을 못 햇네
      //console.log(res.data);
      if(res.data.errno > 0) {
        alert("에러 : "+res.data.sqlMessage);
      } else {
        queryClient.invalidateQueries({queryKey:['userIdx']}); // queryKey 유효성 제거
        setValue("lolNick", "");
        setFocus("lolNick");
      }      
    },
  });    
    

  //console.log(queryDetail);
  // 삭제 시킨다
  const deleteUser = (userIdx:number, lolNick:string) => {
    //console.log(id);
    if (window.confirm("선택한 "+lolNick+" 내용을 삭제 하시겠습니까?")) {
        //여러개 보낼때는 객체로 보내라
        deleteUserMutation.mutate({userIdx:userIdx, lolNick: lolNick});
    } else {
        return false;
    }
  };      

  const deleteUserMutation = useMutation({
    // 타입을 지정 해 주지 않으면 오류 발생 typescript 문법 어렵네
    mutationFn: async (params:ModelAzeUserDel) => {
      //const response = await axios.delete(`${process.env.REACT_APP_API_ROOT}/api/gameTitle/${idx}`, {data:{id:idx}});
      // 이건 body로 보내는거
      //const response = await axios.delete(`${process.env.REACT_APP_API_ROOT}/api/gameTitleDetail`, {data:{gtdIdx:gtdIdx, gtIdx:props.gtIdx}});
      //아래에껀 세그먼트로 보내는거
      const response = await axios.delete(`${process.env.REACT_APP_API_ROOT}/api/azeUser/`, {data:{lolNick:params.lolNick, userIdx:params.userIdx}});
      return response;     
    },
    onSuccess: (res) => {
      //console.log(res.data);  
      if(res.data.errno > 0) {
        alert("에러 : "+res.data.sqlMessage);
      } else {
        queryClient.invalidateQueries({queryKey:['userIdx']}); // queryKey 유효성 제거
        //setFocus("gtdTitle");
        alert("삭제 되었습니다");
      }

    },
  });    

  // 검색어
  // 검색 input onChange setFilters에 값을 넣으면 쿼리가 작동해서 안됨
  const onChangeSchVal = (e:React.ChangeEvent<HTMLInputElement>) => {
    setSchVal(e.target.value);
  }
  //검색 버튼
  const userSearch = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setFilters(schVal);
  }

 // 이벤트는 onKeyUp, onKeyDown 만 있다 onKeyUp={(e)=>onKeyPressSchVal(e)}
  const onKeyPressSchVal = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter') {
      setFilters(schVal);
    }
    //setSchVal(e.target.value);
  }; 
  //검색어 관련 끝  

  //리스트 쿼리 재 시작 - 자식창에서 호출을 한다
  const azeUserReload = () => {
    //console.log('재시작');
    queryClient.invalidateQueries({queryKey:['userIdx']}); // queryKey 유효성 제거
  }

  //useEffect 이거 사용 안하면 setState(비동기라 바로 적용이 안되어서) 사용 해도 바로 적용이 안된다 머지?
  useEffect(()=>{
    azeUserReload();
  },[filters])  

  //모달 팝업창 
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = (testProps:ModelAzeUserProp) => {
    setpropsVal({
      ...propsVal,
      outFlag : testProps.outFlag,      
      userIdx : testProps.userIdx,      
      lolNick : testProps.lolNick
    })
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };
  
  return (
    <Container fluid>
      <h4 className="page-title">회원관리</h4>
      <div className="div-search div-search-align">
         <form onSubmit={handleSubmit(onSubmitHandler)}>
          <label className="label-title">롤 닉네임</label>
          <input type="text" {...register("lolNick")}  placeholder='롤 닉네임을 입력 하세요' />
          <button type="submit" className="button-inputbox">신규등록</button> 
        </form>
        <div>
        <label className="label-title">회원검색</label>
        <input type="text" name="searchVal" onChange={onChangeSchVal} onKeyUp={(e)=>onKeyPressSchVal(e)}/>
        <button className="button-inputbox" onClick={userSearch}>검색</button>
        {/* <button onClick={openModal} className="button-inputbox">신규등록</button> */}
        </div>
      </div>
      <table style={{width:'100%'}} className='table_board'>
        <thead>
            <tr>
                <th style={{width:'10%'}}>번호</th>
                <th style={{width:'25%'}}>롤 Nick</th>
                <th style={{width:'15%'}}>탈퇴유무</th>
                <th style={{width:'25%'}}>등록일</th>
                <th style={{width:'20%'}}>비고</th>
            </tr>
        </thead>
        <tbody>
          {azeUserData?.length !== 0 ?
            azeUserData?.map((item, index) => (

            <tr key={index}>
                <td>{index+1}</td>
                <td>{item.lolNick}</td>
                <td>{item.outFlag}</td>
                <td>{item.regDate}</td>
                {/* {deleteGameTitle} 그냥 함수 호출 */}
                {/* 삭제는 바로 호출 해도 되는구나 경고문 띄울려면 함수 만들어야 됨* 지금은 index 값을 넘김 json 이라 */}
                {/* <td><button  onClick={()=> deleteGroupMutation.mutate(item.id)}>삭제</button></td> */}
                <td>
                  <button onClick={()=>openModal({'lolNick':`${item.lolNick}`, 'outFlag':`${item.outFlag}`,'userIdx':item.userIdx})} className="button-inputbox">수정</button>
                  <button  onClick={()=> deleteUser(item.userIdx,item.lolNick)}  className="button-inputbox">삭제</button>                  
                </td>
            </tr>
            )) : <tr><td colSpan={5}>등록된 내용이 없습니다</td></tr>
          }
        </tbody>
      </table>
      <Modal open={modalOpen} close={closeModal} header="회원정보수정"><UserUpdateModal lolNick={lolNick} outFlag={outFlag} userIdx={userIdx} dataLoad={azeUserReload}/></Modal>
    </Container>
  )
}

export default AzeUser
