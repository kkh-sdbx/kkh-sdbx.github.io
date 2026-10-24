const storage = window.localStorage;
const SERVER_DATA = {"gameRoomsIDsMade":{}};


// 일단 기초 mockData  저장. => 이 코드 때문에 새로고침으로 재방문을 mock 하기가 안되네.
// 일단 new prisoner로 진행한다.
storage.setItem("DB",JSON.stringify(SERVER_DATA));

const MOCK_DB_HANDLER = ()=>{

    /**
     * 
     * (prisonerID, newStatus)status는, 메인페이지/큐 요청/큐 완료 등 게임 외의 유저가 가질 수 있는 상태를 의미함. 
     * @param {string} prisonerID
     * @param { }newStatus
     * */
    const setPrisonerStatus = (prisonerID, newStatus, prisonerData)=>{

        // DB에서 유저 정보 찾아서 status 수정.
        const updated_DB = JSON.parse(storage.getItem("DB"));
        updated_DB[prisonerID].PRISONER_STATUS = newStatus;

        // DB에서 현재 게임룸 정보 가져오기
        const gameRoomsMade = updated_DB.gameRoomsIDsMade;
        if(newStatus === "enteredGameRoom" && gameRoomsMade[prisonerData]){
            
            updated_DB[prisonerID].PRISONER_GAME_STATUS = gameRoomsMade[prisonerData];
        
        };
        
        // DB에 다시 쓰기write
        storage.setItem("DB", JSON.stringify(updated_DB));

        return updated_DB;
        

    };

    const getGameRoomSchema = ()=>{
        const updated_DB = JSON.parse(storage.getItem("DB"));
        
        const gameRoomsMade = updated_DB.gameRoomsIDsMade;

        // 서버/DB에서 보내주는 게임룸 데이터의 원형
        const GAME_ROOM = {
            "GAME_ROOM_ID":"",
            "prisoners":[],
            "turnsTaken":0,

        };

        // 난수를 이용한 랜덤 아이디 생성
        let RandomID = JSON.stringify(Math.random()).slice(2,);

        // 새 게임룸에 랜덤 아이디 배정
        while(true){
            
            if(gameRoomsMade[RandomID]){
                RandomID = JSON.stringify(Math.random()).slice(2,);
            }else{
                const newGameRoom = structuredClone(GAME_ROOM);
                newGameRoom.GAME_ROOM_ID = RandomID;
                gameRoomsMade[RandomID] = newGameRoom;
                break;
            };
        };

        return gameRoomsMade[RandomID];
        
    };

    const setStartedGameOnDB = (gameRoomObject)=>{
        // ## 방어 코드는 나중에 생각하기.
        gameRoomsIDsMade[gameRoomObject.GAME_ROOM_ID] = gameRoomObject;
    };


    const seeDB = ()=>{
        console.log("see DB: ",storage.getItem("DB"));
    };

    const writeNewPrisoner = (newPrisonerID)=>{
        // 서버에 데이터를 저장하는 코드.
        // 일단은, 이렇게 mock 한다.
        const DB = JSON.parse(storage.getItem("DB"));
        DB[newPrisonerID] = {
            "prisonerID": newPrisonerID,
            "PRISONER_NAME":"prisonerName",
            "PRISONER_TYPE":"prisonerType",
            "PRISONER_ID":newPrisonerID,
            "PRISONER_STATUS": null, // ## 이걸, pending/waitingQueue/matched 등등이 아니라 해시테이블 형태로 제작할 수는 없을까.
            
            "PRISONER_GAME_STATUS":{
                "GAMEROOM_ID":null,
                "status":"not yet",
                "PRISONER_GAME_ACTIONS":{
                    "G_point_1":null, 
                    "G_point_2":null,
                    "G_point_3":null,
                    "G_point_4":null,
                    "G_point_5":null
                }, // 게임 액션은 DB에 있을 필요가 없지. 메모리 영역으로 옮겨야 한다.
            }, 

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
                    "prisonerID": newPrisonerID,
                    "PRISONER_NAME":"prisonerName",

                }
            }
        };
        
        // ## 가장 큰 병목은, 1인 데이터의 스키마가 없다는 것. 그게 있어야 서버사이드와 클라이언트 사이드가 나뉘고, 렌더링할 정보와 렌더링하지 않을 정보가 나뉜다. 스키마 짜는 게 제일 중요함 지금.
        // ## 일단은, 메인페이지와 상점 페이지의 UI가 나와봐야 될 것 같은데? 어떤 정보가 있는지를 알아야지.
        storage.setItem("DB",JSON.stringify(DB));
    };

    /** 
     * 아이디 받아서 데이터 리턴하는 함수 
     * @param {string} prisonerID
     * 
     * */
    const searchPrisonerInfoById = (prisonerID)=>{ // 새 유저라도, OAuth ID 같은 건 있을거다. .
        
        const prisonerInfo = JSON.parse(storage.getItem("DB"))[prisonerID];
        // ## alert가 아니라 렌더링 정보를 보내줘야 하지...
        if(prisonerInfo){ //다시 로그인(DB에 정보 있음)
            alert("Welcome Back!");
            return prisonerInfo

        }else{ // 첫 로그인(DB에 정보 없음)
            alert("new prisoner!");
            writeNewPrisoner(prisonerID);
            const newPrisonerInfo = {};
            newPrisonerInfo.renderInfo = JSON.parse(storage.getItem("DB"))[prisonerID].renderInfo;
            newPrisonerInfo.PRISONER_GAME_STATUS = {
                "GAMEROOM_ID":null,
                "status":"not yet",
                "PRISONER_GAME_ACTIONS":{
                    "G_point_1":null, 
                    "G_point_2":null,
                    "G_point_3":null,
                    "G_point_4":null,
                    "G_point_5":null
                } // 게임 액션은 DB에 있을 필요가 없지. 메모리 영역으로 옮겨야 한다.
            }; // ## 그리고 prisoner의 게임 참여 현황을 저장할 JSON 스키마 수정 필요

            //DB에 새 prisoner를 만들고, 새 유저의 상점과 마이페이지 정보를 전달해준다. 스키마를 정할 때가 됐다.
            /*
            //## 이런 판단 로직을 DB가 갖고 있는 게 맞나? 판단 로직은 mockLoadingConnection에서 짜야 하는 것 아닌가?
            */
           console.log("newPrisonerInfo: ", newPrisonerInfo);
           return newPrisonerInfo
        };
        
    }; 

    return{
        seeDB,
        searchPrisonerInfoById,
        getGameRoomSchema,
        writeNewPrisoner,
        setPrisonerStatus

    }
};

const DB_HANDLER = MOCK_DB_HANDLER();
export default DB_HANDLER;