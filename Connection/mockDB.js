const storage = window.localStorage;
const SERVER_DATA = {};

// 일단 기초 mockData  저장.

storage.setItem("DB",JSON.stringify(SERVER_DATA));

const MOCK_DB_HANDLER = ()=>{   

    const seeDB = ()=>{
        console.log(storage.getItem("DB"));
    }


    return{
        seeDB

    }
};

const DB_HANDLER = MOCK_DB_HANDLER();
export default DB_HANDLER;