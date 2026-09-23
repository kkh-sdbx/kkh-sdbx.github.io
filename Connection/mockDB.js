const storage = window.localStorage;
const SERVER_DATA = {};

// 일단 기초 mockData  저장.


storage.setItem("DB",JSON.stringify(SERVER_DATA));

const MOCK_DB_HANDLER = ()=>{   

    const seeDB = ()=>{
        console.log(storage.getItem("DB"));
    };

    
    const searchUserInfoById = (userID)=>{

        const userInfo = storage.getItem("DB")[userID];
        console.log("userInfo: ",userInfo);

        // ## alert가 아니라 렌더링 정보를 보내줘야 하지...
        if(userInfo){ //다시 로그인(DB에 정보 있음)
            alert("Welcome Back!");
            return userInfo

        }else{ // 첫 로그인(DB에 정보 없음)
            alert("new user!");

            //DB에 새 user를 만들고, 새 유저의 상점과 마이페이지 정보를 전달해준다. 스키마를 정할 때가 됐다.
            // ## entryPoint: mockDB가 만들어졌다. 
            /*
            const userInfo = 
            {
            "renderInfo":{
                "shop":{},
                "mainPage":{}
                }
            };
            이거 선언해서 리턴하고 console.log() 해 보기.

            DB에 입력(parse등을 포함)=> DB에서 읽어와서 유저에게 렌더링값 리턴.

            //## 이런 판단 로직을 DB가 갖고 있는 게 맞나? 판단 로직은 mockLoadingConnection에서 짜야 하는 것 아닌가?
            */
            return 
        };
        
    }; 

    return{
        seeDB,
        searchUserInfoById

    }
};

const DB_HANDLER = MOCK_DB_HANDLER();
export default DB_HANDLER;