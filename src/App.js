import logo from './logo.svg';
import './App.css';
import React from "react";
import {useQuery, useMutation, useQueryClient}from "react-query";
import axios from "axios";

const getSleepList = ()=> {
  return axios.get("http://localhost:5001/sleep_times");
}

const addSleepData = (data)=> {
  return axios.post("http://localhost:5001/sleep_times", data);
}

function App() {
  const day_input = React.useRef("");
  const time_input = React.useRef("");

  const queryClient = useQueryClient();
  //useQuery 첫번째 인자는 쿼리 키, 두번째 인자는 함수, 세번째인자는 옵션
  const sleep_query= useQuery("sleep_list", getSleepList, {
    onSuccess: (data)=> {
      console.log(data);
    }
  });
// useMutaion 첫번째 인자는 함수, 두번째 인자는 옵션
  const {mutate} = useMutation(addSleepData, {
    onSuccess: () => {
      //성공하면 수면 데이터 목록 다시 불러오기
    queryClient.invalidateQueries("sleep_list");
    day_input.current.value="";
    time_input.current.value="";
    }
    
  });

  if(sleep_query.isLoading){
    return null;
  }

  return (
    <div className="App">
     {sleep_query.data.data.map((d)=>{
      return (
        <div key={d.id}>
          <p>{d.day}</p>
          <p>{d.sleep_time}</p>
        </div>
      ) 
     })}

     <input ref={day_input}/>
     <input ref={time_input}/>
     <button onClick={()=> {
      const data={day: day_input.current.value, 
        sleep_time: time_input.current.value}
      mutate(data);
     }}>데이터 추가하기</button>
    </div>
  );
}

export default App;
