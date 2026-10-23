import OPERATION_EVENT_TARGETS from "../Tools/operationEventTargets.js";
const QUEUE_EVNET_TARGET = OPERATION_EVENT_TARGETS.queueEventTarget;

// ## 클라이언트 스토리지에서 데이터 가져오는 것도 Tool에 있어야 하지 않나?
const storage = window.localStorage;
console.log(storage);
//const prisonerInfo = storage.get();

const mainPageConnection = ()=>{

    const getPrisonerInfo = ()=>{

        const prisonerData = JSON.parse(storage.getItem("mockPrisonerData")); 
        
        return prisonerData;
    };

    const pollingForQueue = ()=> {
        // ##http GET 요청이 정상적으로 되면,clearInterval(pollingForQueue) 하고 VIEW.renderGameRoom()시작하면 된다.
        const prisonerData = JSON.parse(storage.getItem("mockPrisonerData"));
        console.log("requesting matchMaking result:, ", prisonerData.prisonerID);
        const requestingPrisonerID = prisonerData.prisonerID;
        // 매칭되었는지 서버로 GET 요청 보내는 것을 이벤트로 mock - mainConnection으로 옮기기.
        QUEUE_EVNET_TARGET.dispatchEvent(new CustomEvent("checkMatchingStatus",{
            "detail":requestingPrisonerID
        }));

    };


    return {
        getPrisonerInfo,
        pollingForQueue
    }
};

const MAIN_PAGE_MODEL = mainPageConnection();
export default MAIN_PAGE_MODEL
