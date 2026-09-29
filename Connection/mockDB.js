const storage = window.localStorage;
const SERVER_DATA = {};


// 일단 기초 mockData  저장. => 이 코드 때문에 새로고침으로 재방문을 mock 하기가 안되네.
// 일단 new user로 진행한다.
storage.setItem("DB",JSON.stringify(SERVER_DATA));


const MOCK_DB_HANDLER = ()=>{   

    const seeDB = ()=>{
        console.log("see DB: ",storage.getItem("DB"));
    };

    const writeNewUser = (newUserID)=>{
        // 서버에 데이터를 저장하는 코드.
        // 일단은, 이렇게 mock 한다.
        const DB = JSON.parse(storage.getItem("DB"));
        DB[newUserID] = {
            "userID": newUserID,
            "PRISONER_NAME":"prisonerName",
            "PRISONER_TYPE":"prisonerType",
            "PRISONER_ID":newUserID,
            "PRISONER_GAME_ACTIONS":
                {"G_point_1":null, 
                "G_point_2":null,
                "G_point_3":null,
                "G_point_4":null,
                "G_point_5":null},
            "PRISONER_GAME_STATUS":{"status":"not yet","N":0,"Y":0,"K":0}, // NYK에는 뭐가 들어가야 하는거냐?
            "renderInfo":{
                "shop":{
                    "currentCredit":0,
                    "skinTable":{
                        "donut":{},
                        "balls":{},
                        "neon":{}
                    }
                },
                "mainPage":{},
                "myPage":{
                    "userID": newUserID,
                    "PRISONER_NAME":"prisonerName",

                }
            }
        };
        
        // ## 가장 큰 병목은, 1인 데이터의 스키마가 없다는 것. 그게 있어야 서버사이드와 클라이언트 사이드가 나뉘고, 렌더링할 정보와 렌더링하지 않을 정보가 나뉜다. 스키마 짜는 게 제일 중요함 지금.
        // ## 일단은, 메인페이지와 상점 페이지의 UI가 나와봐야 될 것 같은데? 어떤 정보가 있는지를 알아야지.
        storage.setItem("DB",JSON.stringify(DB));
    };
    
    const searchUserInfoById = (userID)=>{ // 새 유저라도, OAuth ID 같은 건 있을거다. 아이디 받아서 데이터 리턴하는 함수가 맞아.

        const userInfo = JSON.parse(storage.getItem("DB"))[userID];
        console.log("userInfo at searchUserInfoById initiation: ",userInfo);

        // ## alert가 아니라 렌더링 정보를 보내줘야 하지...
        if(userInfo){ //다시 로그인(DB에 정보 있음)
            alert("Welcome Back!");
            return userInfo

        }else{ // 첫 로그인(DB에 정보 없음)
            alert("new user!");
            writeNewUser(userID);
            const newUserInfo = JSON.parse(storage.getItem("DB"))[userID].renderInfo

            //DB에 새 user를 만들고, 새 유저의 상점과 마이페이지 정보를 전달해준다. 스키마를 정할 때가 됐다.
            /*
            //## 이런 판단 로직을 DB가 갖고 있는 게 맞나? 판단 로직은 mockLoadingConnection에서 짜야 하는 것 아닌가?
            */
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