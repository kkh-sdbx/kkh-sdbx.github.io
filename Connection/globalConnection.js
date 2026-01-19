// 데이터가 변경되었음을 알림 (누구에게? 상관없음, 그냥 던짐)


const connectGlobalMode = ()=>{

    let storage = null;
    let userDecisions = null;
    let ultimatum = null;

    let SEND_INFO_TO_SERVER_EVENT = null;
    let G_updateActionsFromStorage = null;
    let CHECK_EMPTY_POINTS_EVENT = null;

    let pointsEventTarget = null;
    let selectionEventTarget = null;
    let modalEventTarget = null;
    let mockServerEventTarget = null;

    const setUserStorage = ()=>{
        storage.clear();
        storage.setItem("name","KH");
        storage.setItem("id","KH_ID");
        storage.setItem("status","not yet");
    };
    /**
     * @
     */
    const updateDecisionData = (decisionDetail)=>{
        
        // DECISION_DETAIL = {"target":G_currentPoint.id, "action":G_currentPoint.dataset.btnType };
        // 데이터가 변경되었음을 알림

        storage.setItem(`${decisionDetail.taget}`, `${decisionDetail.action}`); //=> RDB 구조를 짜야 할 시점이다. => 아직 아냐! G_,L_,S_만 구분해놓자.


        
    };    

    const handleFix = ()=>{
        const checker = ["G_point_1","G_point_2","G_point_3","G_point_4","G_point_5"];

        userDecisions = {
            "userId":storage.id,
            "G_point_1":undefined,
            "G_point_2":undefined,
            "G_point_3":undefined,
            "G_point_4":undefined,
            "G_point_5":undefined,
            "emptyPoints":[]
        };
        

        for(const point of checker){
            if(storage[point]){ //fix 시점에서, action이 localStorage에 저장되어 있으면 result에 입력
                
                userDecisions[point] = storage[point];

            }else{ //fix 시점에서, action이 localStorage에 없으면
                userDecisions.emptyPoints.push(point);
            }
        };

        modalEventTarget.dispatchEvent(checkEmptyPoints);

        

    };

    const sendUltimatumToServer = () =>{
        const checker = ["G_point_1","G_point_2","G_point_3","G_point_4","G_point_5"];

        ultimatum = {
            "userId":storage.id,
            "G_point_1":storage.G_point_1,
            "G_point_2":storage.G_point_2,
            "G_point_3":storage.G_point_3,
            "G_point_4":storage.G_point_4,
            "G_point_5":storage.G_point_5,
            "timeArrived":null
        };
        

        for(const point of checker){
            if(!ultimatum[point]){ //fix 시점에서, action이 localStorage에 저장되어 있으면 result에 입력
                
                ultimatum[point] = "Y";
            }
        };

        mockServerEventTarget.dispatchEvent(SEND_INFO_TO_SERVER_EVENT);



    }; 
    

    const init = (eventTarget)=>{
        userDecisions = {
            "userId":storage.id,
            "G_point_1":undefined,
            "G_point_2":undefined,
            "G_point_3":undefined,
            "G_point_4":undefined,
            "G_point_5":undefined,
            "emptyPoints":[]
        };
        ultimatum = {
            "userId":storage.id,
            "G_point_1":storage.G_point_1,
            "G_point_2":storage.G_point_2,
            "G_point_3":storage.G_point_3,
            "G_point_4":storage.G_point_4,
            "G_point_5":storage.G_point_5,
            "timeArrived":null
        };

        CHECK_EMPTY_POINTS_EVENT = new CustomEvent("checkEmptyPoints",{
            bubbles: false,
            cancelable: false,
            detail:userDecisions

        })

        storage = window.localStorage;
        setUserStorage();
        pointsEventTarget = eventTarget.pointsEventTarget;
        selectionEventTarget = eventTarget.selectionEventTarget;
        modalEventTarget = eventTarget.modalEventTarget;

        SEND_INFO_TO_SERVER_EVENT = new CustomEvent("sendInfoToServer",{
            bubbles: true, // Allows the event to bubble up the DOM
            cancelable: false,
            detail:ultimatum
            }
        );

        G_updateActionsFromStorage = new CustomEvent("storageUpdated",{
            bubbles:true,
            cancelable: false,
            detail:storage
        });

            
    };

    return{
        init,
        handleFix,
        setUserStorage,
        sendUltimatumToServer,
        handleFix,
        updateDecisionData



        

    }
}


const GLOBAL_CONNECTION = connectGlobalMode();
export default GLOBAL_CONNECTION
