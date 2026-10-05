import PAGEROUTER from "../Tools/pageRouter.js";
import OPERATION_EVENT_TARGETS from "../Tools/operationEventTargets.js";

const QUEUE_EVNET_TARGET = OPERATION_EVENT_TARGETS.queueEventTarget;

const renderMainPage = ()=>{
    let mainToTutorialBtn = document.getElementById("mainToTutorialBtn");
    let mainToShopBtn = document.getElementById("mainToShopBtn");
    let greetingMessage = document.getElementById("greetingMessage");
    let currentSkin = document.getElementById("currentSkin");

    let queueBtnContainer = document.getElementById("queueBtnContainer");
    let getStarted = document.getElementById("getStarted");
    let queueModal = document.getElementById("queueModal");
    let queueModalTitle = document.getElementById("queueModalTitle");
    let queueModalContent = document.getElementById("queueModalContent");
    
    let startQueueContainer = document.getElementById("startQueueContainer");
    let acceptBtn = document.getElementById("acceptBtn");
    let ejectBtn = document.getElementById("ejectBtn");

    let waitingQueueContainer = document.getElementById("waitingQueueContainer");
    let stopQueueBtn = document.getElementById("stopQueueBtn");
    let queueSpinner = document.getElementById("queueSpinner");
    

    const startQueue = ()=>{
        // 큐 시작을 했음을 이벤트로 알림.
        QUEUE_EVNET_TARGET.dispatchEvent(new CustomEvent("queueEntry"));
        
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
        console.log();
    };
    const renderMainPage = ()=>{
        console.log();
    };
    const init = ()=>{
        // 메인페이지에서 shop으로 넘어가는 페이지라우터 설정.
        mainToShopBtn.addEventListener("click",()=>{
            PAGEROUTER.moveToPage("SHOP");
        });

        //큐 시작 버튼 이벤트리스너 설정.
        getStarted.addEventListener("click",()=>{
            queueModal.style.display = "block";
            waitingQueueContainer.style.display = "none";
            
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
        startQueue
    }
};

const MAIN_PAGE_RENDERER = renderMainPage();
export default MAIN_PAGE_RENDERER;  