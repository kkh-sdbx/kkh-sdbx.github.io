// import  GLOBAL  from "./Connectios/mockServer.js"; => mockServer는 모듈이 아니지. 하...이것도 해야겠다.
// 그래도 머리아픈 로직 짜기가 아니라 노가다 정리작업이니 오히려 좋아~

import  GLOBAL  from "./Handlers/globalHandler.js";
import  LOADINGPAGE  from "./Handlers/loadingPageHandler.js";
import  MAINPAGE  from "./Handlers/mainPageHandler.js";

import  PAGEROUTER  from "./Tools/pageRouter.js";


/*
기억할 것:
1. 수정 전에는 초기화 먼저 해야 하는지 여부 체크
2. 값이 유효하지 않을 수 있다는 점 항상 확인.
*/


// 로딩 페이지 핸들러 - 인터넷 연결 확인, 애니메이션, pageRouter 들어왔는지 확인.

// 메인 페이지 핸들러 - 로컬 모드 큐 시작, 글로벌모드 알림 등

// 상점 핸들러 - CSS 코드 확인

// 글로벌 모드 핸들러 - 시작부터 끝까지.

// 로컬 모드  - 화면 구성 필요.

// 커넥션핸들러 - 인터넷 관련? 있으면 좋긴 할듯. global에서 dispatchEvent로 관리하고 있기는 하다 지금은. 표시를 해 두자.

// mockServer - 로직은 짜 둬야 함.




// Test 환경 ... Setting
        //임의의 유저네임을 집어넣음
        
window.addEventListener("DOMContentLoaded",()=>{

    

    // 변수 할당.
    GLOBAL.init();

    // 로딩 페이지 셋업.
    LOADINGPAGE.setRouter();

    // 메인 페이지  셋업.
    MAINPAGE.setRouter();

    // 상점 페이지  셋업.


    // 글로벌 모드  셋업.
    GLOBAL.setUserStorage();
    GLOBAL.updateActions();


    // 로컬 모드  셋업.


    // 커넥션핸들러  셋업.

    // mockServer  셋업.


    
    PAGEROUTER.moveToPage("LOADING");

    //아래는 글로벌 모드 세팅

    // 마우스 오버 이벤트 핸들러
    GLOBAL.setPointsInteractive();

    //NYK 버튼 이벤트리스너 붙이기
    GLOBAL.setSelectionInteractive();
            
    //모달창 proceed,discard 이벤트리스너 붙이기
    GLOBAL.setModalInteractive();

    //글로벌 모드 액션 고정
    GLOBAL.fixActions();

});









// 서비스 워커 불러오기
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('Service Worker 등록 성공:', reg.scope))
        .catch(err => console.error('Service Worker 등록 실패:', err));
    });
};


        
// 페이지 이동 함수 - 모듈 이용

const globalToMainBtn = document.getElementById("globalToMainBtn");




globalToMainBtn.addEventListener("click",()=>{
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
        




window.addEventListener('resize',()=>{
    GLOBAL.updatePositions_Resize();
})


        

document.addEventListener("storageUpdated",(e)=>{
    console.log("storageUpdated event listened!", e);

    GLOBAL.storageUpdate(e);

});





    
