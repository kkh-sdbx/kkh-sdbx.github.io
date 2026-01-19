// 데이터가 변경되었음을 알림 (누구에게? 상관없음, 그냥 던짐)


const connectGlobalMode = ()=>{

    let storage = null;
    let ultimatum = null;

    let G_sendInfoToServer = null;
    let G_updateActionsFromStorage = null;
    let CHECK_EMPTY_POINTS_EVENT = null;

    let pointsEventTarget = null;
    let selectionEventTarget = null;
    let modalEventTarget = null;

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

        ultimatum = {
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
                
                ultimatum[point] = storage[point];

            }else{ //fix 시점에서, action이 localStorage에 없으면
                ultimatum.emptyPoints.push(point);
            }
        };

        modalEventTarget.dispatchEvent(checkEmptyPoints);

        

    };
    

    const init = (eventTarget)=>{
        ultimatum = {
            "userId":storage.id,
            "G_point_1":undefined,
            "G_point_2":undefined,
            "G_point_3":undefined,
            "G_point_4":undefined,
            "G_point_5":undefined,
            "emptyPoints":[]
        };

        CHECK_EMPTY_POINTS_EVENT = new CustomEvent("checkEmptyPoints",{
            bubbles: false,
            cancelable: false,
            detail:ultimatum

        })

        storage = window.localStorage;

        pointsEventTarget = eventTarget.pointsEventTarget;
        selectionEventTarget = eventTarget.selectionEventTarget;
        modalEventTarget = eventTarget.modalEventTarget;

        G_sendInfoToServer = new CustomEvent("actionFixed",{
            bubbles: true, // Allows the event to bubble up the DOM
            cancelable: false,
            detail:storage
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
        setUserStorage

        

    }
}


const GLOBAL_CONNECTION = connectGlobalMode();
export default GLOBAL_CONNECTION
