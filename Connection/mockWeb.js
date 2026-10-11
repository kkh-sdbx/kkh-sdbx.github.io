import OPERATION_EVENT_TARGETS from "../Tools/operationEventTargets.js";
import G_EVENT_TARGETS from "../Tools/gameEventTargets.js";

import MATCHMAKING from "./matchMaking.js";
import DB_HANDLER from "./mockDB.js";

const MOCK_WEB_EVENT_TARGET = G_EVENT_TARGETS.mockWebEventTarget; 
const MOCK_SERVER_EVENT_TARGET = G_EVENT_TARGETS.mockServerEventTarget; 

const QUEUE_EVNET_TARGET = OPERATION_EVENT_TARGETS.queueEventTarget;

const MOCKWEB_STANDARD_TIME = new Date();
console.log("MOCKWEB_STANDARD_TIME:",MOCKWEB_STANDARD_TIME);


// 이제 async로 mockServer에 ultimatum을 던지고 그 결과를 받아와야 함.
          
MOCK_WEB_EVENT_TARGET.addEventListener("sendInfoToServer",(e)=>{
    
    const ultReceived = e.detail;
    ultReceived.timeArrived = new Date();

    /**
     * e.detail ===
     * ultimatum = {
            "userId":storage.id,
            "G_point_1":storage.G_point_1,
            "G_point_2":storage.G_point_2,
            "G_point_3":storage.G_point_3,
            "G_point_4":storage.G_point_4,
            "G_point_5":storage.G_point_5,
            "timeArrived":null
        };
     * 
     */

    // #1. 이걸 정리해서 MOCK_SERVER_EVENT_TARGET으로 dispatch.
    // 이벤트 리스너 안에서 또 다른 이벤트를 dispatch? 이것도 
    MOCK_SERVER_EVENT_TARGET.dispatchEvent(new CustomEvent("ultimatumSent",{
            bubbles: false,
            cancelable: false,
            detail:ultReceived
    }));
    // #2. mockServer.js에서 showDown 한 결과를, mockWeb이 받아온다.
    
    // #3. MOCK_SEB_EVENT_TARGET 통해 globalConnection으로 다시 보내줌.
    
    // #4. globalConnection은 받은 결과로... =>storage 업데이트 => Handler가 VIEW 불러서 점수 업데이트 && 포인트별 득점/실점 이펙트 

});

MOCK_WEB_EVENT_TARGET.addEventListener("resultReceived",()=>{

    console.log("module connected!");
});

// 클라이언트에서 
QUEUE_EVNET_TARGET.addEventListener("newPlayerEnteredQueue",(e)=>{
    console.log("new prisoner to append: ",e.detail);
    // waitingUsers에 유저 넣기.
    const GAMES_TO_RENDER = MATCHMAKING.gatherSix(MATCHMAKING.sortParties(MATCHMAKING.appendPrisoner(e.detail)));

    console.log("GAMES_TO_RENDER: ",GAMES_TO_RENDER);
    // ## 길이가 긴 array가 나올 수 있다. lazy loading 같은 게 필요할 수도 있고, 아니면 아예 gameToRender도 Map으로 만들어서, mockWeb에서는 cron으로 N개씩만 뽑아서 매치매이킹 루프를 계속 돌리는 게 답일 수도 있겠네.

    // ## N초마다 매치메이킹을 진행하는 함수 작성 필요.
    // ## 그런데 이벤트로 하면, 버튼 누를때마다 매치메이킹 함수가 중복돼서 돌아간다.
    // ## setInterval은 matchMaking 모듈이 갖고 있는 게 맞겠다.

    // ## http GET 요청(polling)이 왔을 때 클라이언트에 보낼 userStatus 객체/ 렌더링 정보를 게임룸별로 JSON화해서 mockWeb에 전달하면 됨. 
    
    GAMES_TO_RENDER.forEach((game)=>{
        game.prisoners.forEach((party)=>{
            party.members.forEach((prisoner)=>{
                // ## depth가 너무 깊다. 추후에 JSON 스키마 수정 필요.
                DB_HANDLER.setPrisonerStatus(prisoner, game.GAME_ROOM_ID);
            });
            
        });
    });

    // ## DB에 매치메이킹 결과를 만들어 넣는 데 까지는 mock이 됐다. 큐 잡을 때의 polling 과정 구현 필요. setInterval()이 코드에 들어올 시간임. 지금 userStatus를 mockWeb이 메모리에 띄워 놓고 있어야 하는데, 그게 없다. cron으로, DB에서 끌어오기 과정을 해 보자. => 1초마다 전체 DB를 훑는다? 그건 말이 안 됨.

    // ## ## entryPoint: 일단, mockWeb이 지금 필요한 게, DB_HANDLER로 조작하는 거 말고, 렌더링 시 보내줄 정보(메모리에 올려진 거)다. const ALL_ACTIVE_USERS 선언하기.    

    // ## 육각형 html div 형태도, 이제 만들어야 함.

    /**
     * const GAME_ROOM = {
            "GAME_ROOM_ID":"",
            "prisoners":[],
            "turnsTaken":0,

        };
     */
});