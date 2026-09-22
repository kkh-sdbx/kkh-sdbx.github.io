const storage = window.localStorage;
const SERVER_DATA = {};

// 일단 기초 mockData  저장.
// ## entryPoint: mockDB가 만들어졌다. MOCK_DB_HANDLER 내에서 const searchUserInfoById = (userID)=>{ return userData} 함수 선언하기. 
storage.setItem("DB",JSON.stringify(SERVER_DATA));

const MOCK_DB_HANDLER = ()=>{   

    const seeDB = ()=>{
        console.log(storage.getItem("DB"));
    };

    //const 


    return{
        seeDB

    }
};

const DB_HANDLER = MOCK_DB_HANDLER();
export default DB_HANDLER;