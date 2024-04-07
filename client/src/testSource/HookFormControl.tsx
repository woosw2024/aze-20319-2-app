import { useForm, useWatch, Control } from "react-hook-form";

type FormValues = {
  firstName: string;
  lastName: string;
};

// useWatch 를 이용 해서 새로운 내용을 적용 시키는 거 같다 리렌더링 효과 인듯
// 
function IsolateReRender({ control }: { control: Control<FormValues> }) {
  const firstName = useWatch({
    control,  //여기에 컨트롤러 넣고
    name: "lastName", //원하는 이름 넣고 (register 에 설정 되는 값인듯 하다)
    defaultValue: "default" //기본 값이고
  });

  return <div>{firstName}</div>; //이걸 리턴 하면 되는듯 함
}

export default function App() {
  console.log('랜더링'); 
  const { register, control, handleSubmit } = useForm<FormValues>();
  const onSubmit = handleSubmit((data) => console.log(data));

  return (
    <form onSubmit={onSubmit}>
      <input {...register("firstName")} />
      <input {...register("lastName")} />
      <IsolateReRender control={control} />

      <input type="submit" />
    </form>
  );
}