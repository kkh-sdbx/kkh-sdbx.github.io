import G_EVENT_TARGETS from "../Tools/globalEventTargets.js";

const MOCK_WEB_EVENT_TARGET = G_EVENT_TARGETS.mockWebEventTarget; 
const MOCK_SERVER_EVENT_TARGET = G_EVENT_TARGETS.mockServerEventTarget; 

// # 아, 이 파일이 존재만 하지 모듈이든 스크립트의 형태든 읽혀지고 있지 않구나! 
// ok, 알았다 이제.
// 이제 async로 mockServer에 ultimatum을 던지고 그 결과를 받아와야 함.
MOCK_WEB_EVENT_TARGET.addEventListener("sendInfoToServer",(e)=>{
    console.log("mock web listens event: sendInfoToServer",e);
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
            detail:e.detail
    }));
    // #2. mockServer.js에서 showDown 한 결과를, mockWeb이 받아온다.
    
    // #3. MOCK_SEB_EVENT_TARGET 통해 globalConnection으로 다시 보내줌.
    
    // #4. globalConnection은 받은 결과로... =>storage 업데이트 => Handler가 VIEW 불러서 점수 업데이트 && 포인트별 득점/실점 이펙트 

});

MOCK_WEB_EVENT_TARGET.addEventListener("resultRecieved");


