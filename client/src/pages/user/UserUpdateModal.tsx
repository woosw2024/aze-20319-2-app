import React, { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { ModelAzeUserInput, ModelAzeUserProp } from '../../model/MazeUser';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

/* 재사용 되는걸 components 에 들어 가는데 일단 안넣는다 */

interface Props extends ModelAzeUserProp {
  dataLoad : () => void
}
const UserUpdateModal:FC<Props> = (props) => {
  
  //console.log(props.outFlag);
  //const queryClient = useQueryClient();  

  const {register, handleSubmit, setFocus} = useForm<ModelAzeUserProp>({
    mode : 'onSubmit', 
    defaultValues:{lolNick:props.lolNick, outFlag:props.outFlag, userIdx:props.userIdx}  //첨에 default 값을 설정
  });

  //이걸로 default 값 설정 한다
/*   
  setValue("lolNick", props.lolNick); //해당 값을 변경 할때 셋팅
  setValue("outFlag", props.outFlag); //해당 값을 셋팅  
  setValue("userIdx", props.userIdx); //해당 값을 셋팅   
*/

  const onSubmitHandler = (data:ModelAzeUserInput) => { 
      //console.log("폼 전송11221");
      //data는 객체로 form 안에 있는 모든 값이 들어 있다
      if(data.lolNick.trim().length <= 0){
        alert('롤 닉네임을 입력 하세요!');
        return false;
      } else {
        if (window.confirm(data.lolNick+" (으)로 수정 하시겠습니까?")) {
          updateUserMutation.mutate(data);
        } else {
          return false;
        }
      }
  }  

  //데이터 입력
  const updateUserMutation = useMutation({
    mutationFn: (param:ModelAzeUserInput) => {
      //return updateGroupApi(gameTitle, done, gubun);
      //console.log(param);
      const response = axios.put(`${process.env.REACT_APP_API_ROOT}/api/azeUser`, param);
      return response;      
    },
    onSuccess: (res) => { 
      //내가 만든건 이렇게 오는데 자체 에러는 어떻게 넘어 올까 확인을 못 햇네
      //console.log(res.data);
      if(res.data.errno > 0) {
        alert("에러 : "+res.data.sqlMessage);
      } else {
        //queryClient.invalidateQueries({queryKey:['gtIdx']}); // queryKey 유효성 제거
        //setValue("lolNick", "");
        //setFocus("lolNick");
        alert('수정 완료 되었습니다');
        props.dataLoad();
        //queryClient.invalidateQueries({queryKey:['userIdx']});
      }      
    },
  });    

  //useEffect 이거 사용 안하면 setState(비동기라 바로 적용이 안되어서) 사용 해도 바로 적용이 안된다 머지?
  useEffect(()=>{
    setFocus('lolNick');
  },[setFocus]);

  //TODO 라디오버튼 콤포넌트화 해서 만들어 보기 https://www.daleseo.com/react-radio-buttons/ 
  return (
    <div>
        <div>
          <p>현재 닉네임은 : {props.lolNick} 입니다</p>              
          <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div>
          <label className="label-title">롤 닉네임</label>
          <input type="text" {...register("lolNick")}  placeholder='롤 닉네임을 입력 하세요' />
          </div>
          <div>
            <label className="label-title">탈퇴유무</label>
            <input type="radio" {...register("outFlag")} value="Y"/>예
            <input type="radio" {...register("outFlag")} value="N"/>아니오
          </div>
          <button type="submit" className="button-inputbox">수정</button> 
          </form>
        </div>
    </div>
  )
}

export default UserUpdateModal

