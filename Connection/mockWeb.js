import OPERATION_EVENT_TARGETS from "../Tools/operationEventTargets.js";
import G_EVENT_TARGETS from "../Tools/gameEventTargets.js";

import MATCHMAKING from "./matchMaking.js";


const MOCK_WEB_EVENT_TARGET = G_EVENT_TARGETS.mockWebEventTarget; 
const MOCK_SERVER_EVENT_TARGET = G_EVENT_TARGETS.mockServerEventTarget; 

const QUEUE_EVNET_TARGET = OPERATION_EVENT_TARGETS.queueEventTarget;

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
    MATCHMAKING.gatherSix(MATCHMAKING.sortParties(MATCHMAKING.appendPrisoner(e.detail)));
    // ## N초마다 매치메이킹을 진행하는 함수 작성 필요.
    // ## 그런데 이벤트로 하면, 버튼 누를때마다 매치메이킹 함수가 중복돼서 돌아간다.
    // ## setInterval은 matchMaking 모듈이 갖고 있는 게 맞겠다.
    
});