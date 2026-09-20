import LOADINGPAGE  from "./Handlers/loadingPageHandler.js";
import PAGEROUTER  from "./Tools/pageRouter.js";
import OPERATION_EVENT_TARGETS from "./Tools/operationEventTargets.js";

const LOADING = LOADINGPAGE();
const LOADING_EVENT_TARGET = OPERATION_EVENT_TARGETS.loadingEventTarget;

// ## DOMContent 실행 시
window.addEventListener("DOMContentLoaded",()=>{
    console.log("setting up runs!");
    // 로딩 페이지 셋업.
    LOADING.init();

    // 로딩 페이지로 이동.
    PAGEROUTER.moveToPage("LOADING");
    LOADING_EVENT_TARGET.dispatchEvent(new CustomEvent("initiation",{
        "bubbles":true,
        "isTrusted":true,
        "detail":{"type":"initiation","from":"main.js","to":"loadingPageHandler","isOK":true}
    }));

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
        






    
