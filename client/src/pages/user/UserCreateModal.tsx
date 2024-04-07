import React, { FC } from 'react'
import { useForm } from 'react-hook-form';
import { ModelAzeUserInput } from '../../model/MazeUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

/* 재사용 되는걸 components 에 들어 가는데 일단 안넣는다 */
//TODO 팝업창으로 회원등록 만들었는데 modal 창을 전역으로 두고 여러개 사용 해야 되는 부분 만들고 적용 해 볼려고 함
interface Props {
  dataLoad : () => void
}
const UserCreateModal:FC<Props> = (props) => {
  
  const queryClient = useQueryClient();  
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
      return response;      
    },
    onSuccess: (res) => { 
      //내가 만든건 이렇게 오는데 자체 에러는 어떻게 넘어 올까 확인을 못 햇네
      //console.log(res.data);
      if(res.data.errno > 0) {
        alert("에러 : "+res.data.sqlMessage);
      } else {
        //queryClient.invalidateQueries({queryKey:['gtIdx']}); // queryKey 유효성 제거
        setValue("lolNick", "");
        setFocus("lolNick");
        props.dataLoad();
      }      
    },
  });    
    
  return (
    <div>
        <div>
          <form onSubmit={handleSubmit(onSubmitHandler)}>
          <label className="label-title">롤 닉네임</label>
          <input type="text" {...register("lolNick")}  placeholder='롤 닉네임을 입력 하세요' />
          <button type="submit" className="button-inputbox">등록</button> 
          </form>
        </div>
    </div>
  )
}

export default UserCreateModal

