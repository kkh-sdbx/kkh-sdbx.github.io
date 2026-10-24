import PAGEROUTER from "../Tools/pageRouter.js";
import OPERATION_EVENT_TARGETS from "../Tools/operationEventTargets.js";

const QUEUE_EVNET_TARGET = OPERATION_EVENT_TARGETS.queueEventTarget;
let mainToTutorialBtn = null;
let mainToShopBtn = null;
let greetingMessage = null;
let currentSkin = null;

let queueBtnContainer = null;
let getStarted = null;
let queueModal = null;
let queueModalTitle = null;
let queueModalContent = null;

let startQueueContainer = null;
let acceptBtn = null;
let ejectBtn = null;

let waitingQueueContainer = null;
let stopQueueBtn = null;
let queueSpinner = null;

let gameEntryQueueContainer = null;
let gameEntryMsg = null;

const renderMainPage = ()=>{ 
    
    const hideQueueModal = ()=>{
        waitingQueueContainer.style.display = "none";
        gameEntryQueueContainer.style.display = "block";
        
    };

    const startQueue = ()=>{
        // (큐 1) 큐 시작을 했음을 이벤트로 알림.
        QUEUE_EVNET_TARGET.dispatchEvent(new CustomEvent("queueEntry"));
        
        // 큐 모달 내부 UI 변경
        gameEntryQueueContainer.style.display = "none";
        startQueueContainer.style.display = "none";
        waitingQueueContainer.style.display = "block";

    };

    const renderWaitingModal = ()=>{
        // ## 모달 창 상태를 '큐 대기 상태'로 수정해야 함.
    };

    const setModalMessage = (e)=>{
        // ## e.detail로 다양한 메시지를 받아와서 지정해야 한다. 일단은 이렇게만,
        queueModalTitle.innerHTML = "Queue Started!!";
        queueModalContent.innerHTML = "bro we are going!"
    };

    const renderShop = ()=>{
        console.log("renderShop");
    };
    const renderMainPage = ()=>{
        console.log("renderMainPage");
    };
    const init = ()=>{
        // DOM 변수에 할당
        mainToTutorialBtn = document.getElementById("mainToTutorialBtn");
        mainToShopBtn = document.getElementById("mainToShopBtn");
        greetingMessage = document.getElementById("greetingMessage");
        currentSkin = document.getElementById("currentSkin");

        queueBtnContainer = document.getElementById("queueBtnContainer");
        getStarted = document.getElementById("getStarted");
        queueModal = document.getElementById("queueModal");
        queueModalTitle = document.getElementById("queueModalTitle");
        queueModalContent = document.getElementById("queueModalContent");
        
        startQueueContainer = document.getElementById("startQueueContainer");
        acceptBtn = document.getElementById("acceptBtn");
        ejectBtn = document.getElementById("ejectBtn");

        waitingQueueContainer = document.getElementById("waitingQueueContainer");
        stopQueueBtn = document.getElementById("stopQueueBtn");
        queueSpinner = document.getElementById("queueSpinner");

        gameEntryQueueContainer = document.getElementById("gameEntryQueueContainer");
        gameEntryMsg = document.getElementById("gameEntryMsg");



        // 메인페이지에서 shop으로 넘어가는 페이지라우터 설정.
        mainToShopBtn.addEventListener("click",()=>{
            PAGEROUTER.moveToPage("SHOP");
        });

        //큐 시작 버튼 이벤트리스너 설정.
        getStarted.addEventListener("click",()=>{
            queueModal.style.display = "block";
            waitingQueueContainer.style.display = "none";
            gameEntryQueueContainer.style.display = "none";
            
        });

        setModalMessage();

        acceptBtn.addEventListener("click",()=>{
            console.log("acceptBtn clicked!");
            startQueue();
        });
        ejectBtn.addEventListener("click",()=>{
            console.log("ejectBtn clicked!");
            queueModal.style.display = "none";
        });
        stopQueueBtn.addEventListener("click",()=>{
            queueModal.style.display = "none";
            startQueueContainer.style.display = "block";
        })



    };
    return{
        init,
        renderMainPage,
        renderShop,
        startQueue,
        hideQueueModal
    }
};

const MAIN_PAGE_RENDERER = renderMainPage();
export default MAIN_PAGE_RENDERER;  