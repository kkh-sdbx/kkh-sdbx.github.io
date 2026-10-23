import PAGEROUTER from "../Tools/pageRouter.js";
import MODEL from "../Connection/mainPageConnection.js";
import VIEW from "../Visual/mainPageRenderer.js";
import OPERATION_EVENT_TARGETS from "../Tools/operationEventTargets.js";
import SHOP_PAGE_HANDLER from "./shopPageHandler.js";
import MY_PAGE_HANDLER from "./myPageHandler.js";



// ## mainPage가 하는 일은 크게 3가지.
// ## 1. 큐 잡기를 통한 게임페이지 이동
// ## 2. 상점 페이지 이동
// ## 3. 마이페이지 이동.

const QUEUE_EVNET_TARGET = OPERATION_EVENT_TARGETS.queueEventTarget;

// 게임 큐 시작 버튼 
const getStarted = document.getElementById("getStarted");

//현재 장착중인 스킨 클리커
const currentSkin = document.getElementById("currentSkin");

const mainPageHandler = ()=>{

    const initGamePage = ()=>{
        clearInterval(MODEL.pollingForQueue);
        console.log("game Page initiation!");
        PAGEROUTER.moveToPage("GAME");

        // ## entryPoint: 일단 큐 응답받고 게임페이지로 이동하는 것까지는 작성함. 아마 mockWeb쪽에서 보내주는 데이터가 정해지지 않아서 버그가 날 거다. mockWeb.js 들어가서 console.log(ALL_ACTIVE_USERS)해보고 잘못된 것 있는지 확인하기.
    };
    
    const initShopPage = (shopData)=>{
        SHOP_PAGE_HANDLER.init(shopData);

    };

    const initMyPage = (myPageData)=>{
        MY_PAGE_HANDLER.init(myPageData);
    };

    const init = (loadingData)=>{

        // ## skinsMap 같은 걸 쓰지 말고, game_skins에 있는 css로직을 그대로 갖고 오면 된다.
        
        // I. currentSkin 클리커 세팅
        const skinStateMap = new Map([
            [undefined, "activated"],   // 클래스 없음 -> activated
            ["activated", "decided"],   // activated -> decided
            ["decided", undefined]      // decided -> 초기화 (필요시 추가)
        ]);
        
        // ## currentSkin 클릭하고 mouseleave하면 사각형이 회전한다. css 조건이 잘못 짜여 있는거지.
        currentSkin.addEventListener("click",()=>{
            let currentState = currentSkin.classList[0]; // nodeList형태와 비슷.
            let nextState = skinStateMap.get(currentState);
            currentSkin.className = "";

            if(nextState){
                currentSkin.classList.add(nextState);
            }
        });

        // II. 클라이언트 저장소에 있는 사용자 정보 가져오기
        const prisonerInfo = MODEL.getPrisonerInfo();

        // III.shopPage 시동
        initShopPage(loadingData.renderInfo.shop);

        // IV.myPage 시동
        initMyPage(loadingData.renderInfo.myPage);

        // V. VIEW 설정
        VIEW.init();

        // (큐 2) VIEW에서 queueEntry 이벤트 듣고 큐에 들어간 prisoner 데이터 전달
        QUEUE_EVNET_TARGET.addEventListener("queueEntry",()=>{
            // ## 모달 형태 수정 필요
            // ## VIEW.renderWaitingModal();

            console.log("this prisoner has entered the queue: ",prisonerInfo);

            // 큐에 들어간 prisoner 데이터 서버로 전달
            QUEUE_EVNET_TARGET.dispatchEvent(new CustomEvent("newPlayerEnteredQueue",{
                "detail":prisonerInfo
            }));

            // (큐 3) ## 1~2초마다 polling- 결과는 main.js에서 핸들링.

            
            setInterval(MODEL.pollingForQueue,1000);
                
        });
    };

    return{
        init
    }
    

};

const MAINPAGE = mainPageHandler();

export default MAINPAGE


