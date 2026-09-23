const storage = window.localStorage;
const SERVER_DATA = {};

// 일단 기초 mockData  저장.


storage.setItem("DB",JSON.stringify(SERVER_DATA));

const MOCK_DB_HANDLER = ()=>{   

    const seeDB = ()=>{
        console.log(storage.getItem("DB"));
    };

    const writeNewUser = (newUserID)=>{
        // 서버에 데이터를 저장하는 코드.
        // 일단은, 이렇게 mock 한다.
        const DB = JSON.parse(storage.getItem("DB"));
        DB[newUserID] = {
            "renderInfo":{
                "shop":{},
                "mainPage":{}
            }
        };
        // ## entryPoint: mockDB가 만들어졌다. user 1명의, 서버에 저장되는 JSON 데이터의 스키마를 정할 때가 왔어. DATA_SCHEMA.js에서 Prisoner 하나 복붙해오기.
        // ## 가장 큰 병목은, 1인 데이터의 스키마가 없다는 것. 그게 있어야 서버사이드와 클라이언트 사이드가 나뉘고, 렌더링할 정보와 렌더링하지 않을 정보가 나뉜다. 스키마 짜는 게 제일 중요함 지금.
        // ## 일단은, 메인페이지와 상점 페이지의 UI가 나와봐야 될 것 같은데? 어떤 정보가 있는지를 알아야지.
    };
    
    const searchUserInfoById = (userID)=>{ // 새 유저라도, OAuth ID 같은 건 있을거다. 아이디 받아서 데이터 리턴하는 함수가 맞아.

        const userInfo = storage.getItem("DB")[userID];
        console.log("userInfo: ",userInfo);

        // ## alert가 아니라 렌더링 정보를 보내줘야 하지...
        if(userInfo){ //다시 로그인(DB에 정보 있음)
            alert("Welcome Back!");
            return userInfo

        }else{ // 첫 로그인(DB에 정보 없음)
            alert("new user!");
            writeNewUser(userID);


            //DB에 새 user를 만들고, 새 유저의 상점과 마이페이지 정보를 전달해준다. 스키마를 정할 때가 됐다.
            
            /*
            //## 이런 판단 로직을 DB가 갖고 있는 게 맞나? 판단 로직은 mockLoadingConnection에서 짜야 하는 것 아닌가?
            */
           const newUserInfo = {
            "renderInfo":{
                "shop":{},
                "mainPage":{}
            }
        };
           console.log("newUserInfo: ", newUserInfo);
           return newUserInfo
        };
        
    }; 

    return{
        seeDB,
        searchUserInfoById

    }
};

const DB_HANDLER = MOCK_DB_HANDLER();
export default DB_HANDLER;