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

// ## init() 에서 일단 상점/마이페이지 정보를 받아와 렌더링해야 한다.

const QUEUE_EVNET_TARGET = OPERATION_EVENT_TARGETS.queueEventTarget;

const mainPageHandler = ()=>{
    
    const initShopPage = (shopData)=>{
        SHOP_PAGE_HANDLER.init(shopData);

    };

    const initMyPage = (myPageData)=>{
        MY_PAGE_HANDLER.init(myPageData);
    };

    const init = (loadingData)=>{
        const getStarted = document.getElementById("getStarted");
        const currentSkin = document.getElementById("currentSkin");
        // ## skinsMap 같은 걸 쓰지 말고, game_skins에 있는 css로직을 그대로 갖고 오면 된다.
        const skinStateMap = new Map([
            [undefined, "activated"],   // 클래스 없음 -> activated
            ["activated", "decided"],   // activated -> decided
            ["decided", undefined]      // decided -> 초기화 (필요시 추가)
        ]);
        
        
        const prisonerInfo = MODEL.getPrisonerInfo();


        // ## currentSkin 클릭하고 mouseleave하면 사각형이 회전한다. css 조건이 잘못 짜여 있는거지.
        currentSkin.addEventListener("click",()=>{
            let currentState = currentSkin.classList[0]; // nodeList형태와 비슷.
            let nextState = skinStateMap.get(currentState);
            currentSkin.className = "";

            if(nextState){
                currentSkin.classList.add(nextState);
            }
        });

        // shopPage 시동
        initShopPage(loadingData.shop);

        // myPage 시동
        initMyPage(loadingData.myPage);

        // VIEW 설정
        VIEW.init();

        // VIEW queueEntry 이벤트 리스너
        QUEUE_EVNET_TARGET.addEventListener("queueEntry",()=>{
            // ## 모달 형태 수정
            // ## VIEW.renderWaitingModal();

            const prisonerInfo = MODEL.getPrisonerInfo();
            console.log("this prisoner has entered the queue: ",prisonerInfo);
            QUEUE_EVNET_TARGET.dispatchEvent(new CustomEvent("newPlayerEnteredQueue",{
                "detail":prisonerInfo
            }));
        });
    };

    return{
        init
    }
    

};

const MAINPAGE = mainPageHandler();

export default MAINPAGE


