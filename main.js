import  PAGEROUTER  from "./pageRouter.js"
import  GLOBAL  from "./globalHandler.js"

// 서비스 워커 불러오기
if ('serviceWorker' in navigator) {
window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('Service Worker 등록 성공:', reg.scope))
    .catch(err => console.error('Service Worker 등록 실패:', err));
    });
}

       /*
        기억할 것:
        1. 수정 전에는 초기화 먼저 해야 하는지 여부 체크
        2. 값이 유효하지 않을 수 있다는 점 항상 확인.
        */

        
        // 페이지 이동 함수 - 모듈 이용
const loadingToMainBtn = document.getElementById("loadingToMainBtn");
const mainToGlobalBtn = document.getElementById("mainToGlobalBtn");
const globalToMainBtn = document.getElementById("globalToMainBtn");

loadingToMainBtn.addEventListener("click",()=>{
    PAGEROUTER.moveToPage("MAIN");
});

mainToGlobalBtn.addEventListener("click",()=>{
    PAGEROUTER.moveToPage("GLOBAL");
});

globalToMainBtn.addEventListener("click",()=>{
    PAGEROUTER.moveToPage("MAIN");
});
        
        /*
        const backToMainPage = document.getElementById("backToMainPage");
        backToMainPage.addEventListener("click",()=>{
            PAGEROUTER.moveToPage("MAIN");
        });
        */
        //임의의 유저네임을 집어넣음
window.addEventListener("load",()=>{
    GLOBAL.setUserStorage();
    PAGEROUTER.moveToPage("LOADING");

});
         // not yet 또는 fixed
        

        //자바스크립트에서 이벤트가 발생했을 때 리스너가 해당 이벤트를 감지하려면, 이벤트가 발생하기 전에 addEventListener를 통해 리스너가 등록되어 있어야 합니다.
        


window.addEventListener("load",()=>{
    GLOBAL.updateActions();
});

window.addEventListener('resize',()=>{
    if(currentPoint){
        GLOBAL.updatePositions();
    }
})

// 마우스 오버 이벤트 핸들러
GLOBAL.setPointsInteractive();

//NYK 버튼 이벤트리스너 붙이기
GLOBAL.setSelectionInteractive();
        
//모달창 proceed,discard 이벤트리스너 붙이기
GLOBAL.setModalInteractive();
        

document.addEventListener("storageUpdated",(e)=>{
    console.log("storageUpdated event listened!", e);

    GLOBAL.storageUpdate(e);

});

GLOBAL.fixActions();



    
