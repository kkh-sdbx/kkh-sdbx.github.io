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

// 게임 큐 시작 버튼 
const getStarted = document.getElementById("getStarted");

//현재 장착중인 스킨 클리커
const currentSkin = document.getElementById("currentSkin");

const mainPageHandler = ()=>{
    
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

        // (큐 2)VIEW에서 queueEntry 이벤트 듣고 큐에 들어간 prisoner 데이터 전달
        QUEUE_EVNET_TARGET.addEventListener("queueEntry",()=>{
            // ## 모달 형태 수정 필요
            // ## VIEW.renderWaitingModal();

            console.log("this prisoner has entered the queue: ",prisonerInfo);

            // 큐에 들어간 prisoner 데이터 서버로 전달
            QUEUE_EVNET_TARGET.dispatchEvent(new CustomEvent("newPlayerEnteredQueue",{
                "detail":prisonerInfo
            }));

            // (큐 3) ## 1~2초마다 polling
            function pollingForQueue(){
                // ##http GET 요청이 정상적으로 되면,clearInterval(pollingForQueue) 하고 VIEW.renderGameRoom()시작하면 된다.
                // ## entryPoint : clearInterval(pollingForQueue) 할 수 있는 함수가 필요해, while(true){} 적기. 그 이후는 하나씩 작성.
                console.log("requesting matchMaking result:, ", prisonerInfo.prisonerID);
            };
            setInterval(pollingForQueue,1000);
        });
    };

    return{
        init
    }
    

};

const MAINPAGE = mainPageHandler();

export default MAINPAGE


