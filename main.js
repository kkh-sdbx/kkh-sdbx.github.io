import LOADINGPAGE  from "./Handlers/loadingPageHandler.js";
import PAGEROUTER  from "./Tools/pageRouter.js";
import OPERATION_EVENT_TARGETS from "./Tools/operationEventTargets.js";
import MAINPAGE from "./Handlers/mainPageHandler.js";
import GAMEPAGE from "./Handlers/gameHandler.js";

const LOADING = LOADINGPAGE();
const LOADING_EVENT_TARGET = OPERATION_EVENT_TARGETS.loadingEventTarget;
const QUEUE_EVNET_TARGET = OPERATION_EVENT_TARGETS.queueEventTarget;


// ## DOMContent 실행 시
window.addEventListener("DOMContentLoaded",()=>{
    console.log("setting up runs!");
    const storage = window.localStorage;

    // 디바이스에 저장된 데이터를 mock. => '앱을 처음 다운받을 때'와 '재접속 시'를 분리... => 일단 OAuth 기반 ID로 서버 DB 조회를 하도록 해야겠네. 디바이스 스토리지를 믿을 수는 없으니.
    const mockPrisonerData = {
        "prisonerID":"ULID something",
        "prisonerName":"kkh",
        "deviceInfo":navigator.userAgent
    };

    storage.setItem("mockPrisonerData", JSON.stringify(mockPrisonerData));

   
    /**
     * (로딩 4) 이벤트리스너 부착
     * loadingConnection에서 renderInfo를 받아와 렌더링 + 클라이언트 저장소에 저장.
    */
    LOADING_EVENT_TARGET.addEventListener("loadingFinished",(e)=>{

        console.log("loading Finished: ",e.detail);

        // shop && mainPage 렌더링할 데이터와 gameStatus는 받아 옴.

        // mainPageHandler가 일종의 mini-main.js 역할.

        // 일단 shop과 mainPage 렌더링 후에 PAGEROUTER로 메인페이지로 넘어간다. => MAINPAGE.init()에 보면 렌더링 함수를 적어두긴 함. 

        // ## 로딩 실패 시의 방어 코드가 없다.
        
        MAINPAGE.init(e.detail); 
        GAMEPAGE.init(); 
        // 윗줄 주석 풀면 Uncaught TypeError: Cannot set properties of null (setting 'bot0')
        // 로딩 완료 시에 GAMEPAGE.init()을 진행하려 하는데, GAMEPAGE.init()내의 MODEL.init()에서 storage를 건드리기 때문에(스키마가 바뀜) 오류가 난다.
        //GAMEPAGE.init()내에 START_GAME_EVENT_TARGET이 이벤트를 듣게는 해 놨다.

        PAGEROUTER.moveToPage("MAIN");
        
    });

    // 로딩 페이지 셋업.
    LOADING.init(mockPrisonerData);

    // 로딩 페이지로 이동.
    PAGEROUTER.moveToPage("LOADING");

    LOADING_EVENT_TARGET.dispatchEvent(new CustomEvent("initiation",{
        "bubbles":true,
        "isTrusted":true,
        "detail":{"type":"initiation","from":"main.js","to":"loadingPageHandler","isOK":true}
    }));


    // (큐 6) mainPageConnection이 보낸 polling에 대해 mockWeb에서 온 응답을 들음. 
    QUEUE_EVNET_TARGET.addEventListener("queuePollingRes",(e)=>{
        if(e.detail){
         
            console.log("queuePollingRes listened at main.js:", e.detail);
            MAINPAGE.initGamePage(e.detail.PRISONER_GAME_STATUS);
        }else{
            // ## mockWeb응답이 waiting일 경우
        };
    });
    

});


/*
기억할 것:
1. 수정 전에는 초기화 먼저 해야 하는지 여부 체크
2. 값이 유효하지 않을 수 있다는 점 항상 확인.
*/

// 로딩 페이지 핸들러 - 인터넷 연결 확인, 애니메이션, pageRouter 들어왔는지 확인.

// 메인 페이지 핸들러 - 로컬 모드 큐 시작, 글로벌모드 알림 등

// 상점 핸들러 - CSS 코드 확인

// Test 환경 ... Setting
        //임의의 유저네임을 집어넣음





// 서비스 워커 불러오기
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('Service Worker 등록 성공:', reg.scope))
        .catch(err => console.error('Service Worker 등록 실패:', err));
    });
};

*/
        
// 페이지 이동 함수 - 모듈 이용

const gameToMainBtn = document.getElementById("gameToMainBtn");

gameToMainBtn.addEventListener("click",()=>{
    PAGEROUTER.moveToPage("MAIN");
});


        /*
        const backToMainPage = document.getElementById("backToMainPage");
        backToMainPage.addEventListener("click",()=>{
            PAGEROUTER.moveToPage("MAIN");
        });
        */

         // not yet 또는 fixed
        

        //자바스크립트에서 이벤트가 발생했을 때 리스너가 해당 이벤트를 감지하려면, 이벤트가 발생하기 전에 addEventListener를 통해 리스너가 등록되어 있어야 합니다.
        






    
