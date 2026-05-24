// 데이터가 변경되었음을 알림 (누구에게? 상관없음, 그냥 던짐)

import SCHEMA from "../Tools/DATA_SCHEMA.js";

const connectGlobalMode = ()=>{

    let storage = null;
    let userDecisions = null;
    let ultimatum = null;
    let PRISONER_DATA= null;

    let SEND_INFO_TO_SERVER_EVENT = null;
    let G_updateActionsFromStorage = null;
    let CHECK_EMPTY_POINTS_EVENT = null;

    let POINTS_EVENT_TARGET = null;
    let SELECTION_EVENT_TARGET = null;
    let MODAL_EVENT_TARGET = null;
    let MOCK_SERVER_EVENT_TARGET = null;
    let POINT_VALIDATOR = null;

    // 사실 이 정보도 서버에서 받아와야 하는거지? 추후에 수정 필요하다.
    const setPrionerStorage = ()=>{
        const DATA_SCHEMA = SCHEMA();
        PRISONER_DATA = DATA_SCHEMA.prisonerData();
        storage.clear();
        storage.setItem("name",PRISONER_DATA.PRISONER_NAME);
    
        storage.setItem("type",PRISONER_DATA.PRISONER_TYPE);
        
        POINT_VALIDATOR.forEach((pointId)=>{
            storage.setItem(pointId,PRISONER_DATA.PRISONER_GLOBAL_ACTIONS[pointId]);    
            
        });

        storage.setItem("status",JSON.stringify(PRISONER_DATA.PRISONER_GLOBAL_STATUS));

    };
    /**
     * point 1개의 decision 을 storage에서 가져와 리턴
     * @params action이 일어난 point의 number
     */
    const getPointData = (pointId)=>{
        let pointData = {"target":null, "action":null};
        const validator = ["Y","N","K"];
        
        if(!(POINT_VALIDATOR.includes(pointId))){
            console.log("pointId invalid:", pointId);
            return
        }
        
        if(validator.includes(storage.getItem(pointId))){
            pointData = { "target":pointId, "action":storage.getItem(pointId)};
            
        }else{
            pointData = {"target":pointId, "action":null};
        }
        // DECISION_DETAIL = {"target":G_currentPoint.id, "action":G_currentPoint.dataset.btnType };
        // 데이터가 변경되었음을 알림
        console.log("pointData changed: ",pointData);
        return pointData

    };    

    /**
     * 포인트에서 내린 결정을 스토리지에 업데이트하는 함수
     * @params {"target":G_currentPoint.id, "action":"Y"}
     */
    const setPointDecision = (fixData) =>{
        storage.setItem(fixData.target,fixData.action);

    }


    const handleFix = ()=>{ 

        userDecisions = {
            "userId":storage.id,
            "G_point_1":undefined,
            "G_point_2":undefined,
            "G_point_3":undefined,
            "G_point_4":undefined,
            "G_point_5":undefined,
            "emptyPoints":[]
        }
        
        for(const point of POINT_VALIDATOR){
            let userAction = storage.getItem(point);
            if(userAction){ //fix 시점에서, action이 localStorage에 저장되어 있으면 result에 입력
                userDecisions[point] = userAction;

            }else{ //fix 시점에서, action이 localStorage에 없으면
                userDecisions.emptyPoints.push(point);
            }
        };
        

        MODAL_EVENT_TARGET.dispatchEvent(CHECK_EMPTY_POINTS_EVENT);

        

    };

    const sendUltimatumToServer = () =>{
        
        ultimatum = {
            "userId":storage.id,
            "G_point_1":storage.G_point_1,
            "G_point_2":storage.G_point_2,
            "G_point_3":storage.G_point_3,
            "G_point_4":storage.G_point_4,
            "G_point_5":storage.G_point_5,
            "timeArrived":null
        };
        

        for(const point of POINT_VALIDATOR){
            if(!ultimatum[point]){ //fix 시점에서, action이 localStorage에 저장되어 있으면 result에 입력
                
                ultimatum[point] = "Y";
            }
        };

        MOCK_SERVER_EVENT_TARGET.dispatchEvent(SEND_INFO_TO_SERVER_EVENT);



    }; 
    

    const init = (eventTarget)=>{
        
        //  
        CHECK_EMPTY_POINTS_EVENT = new CustomEvent("checkEmptyPoints",{
            bubbles: false,
            cancelable: false,
            detail:userDecisions

        });

        // 지금은 localStorage를 쓰지만 모바일이든 PC버전이든 스토리지를 수정해야 한다.
        storage = window.localStorage;

        // 이 Model 안에서 쓸 이벤트 타겟 지정.
        POINTS_EVENT_TARGET = eventTarget.pointsEventTarget;
        SELECTION_EVENT_TARGET = eventTarget.selectionEventTarget;
        MODAL_EVENT_TARGET = eventTarget.modalEventTarget;
        MOCK_SERVER_EVENT_TARGET = eventTarget.mockServerEventTarget;
        POINT_VALIDATOR = ["G_point_1","G_point_2","G_point_3","G_point_4","G_point_5"];

        // Model은 로컬 저장소와 웹 서버 사이를 중개.
        SEND_INFO_TO_SERVER_EVENT = new CustomEvent("sendInfoToServer",{
            bubbles: true, // Allows the event to bubble up the DOM => 왜 이렇게 되어 있었는지 파악해야 함.
            cancelable: false,
            detail:ultimatum
            }
        );

        // storage 에서 선택지 불러오기
        G_updateActionsFromStorage = new CustomEvent("storageUpdated",{ //이 변수명인데, 왜 커스텀 이벤트로 되어있지? 
            bubbles:true,
            cancelable: false,
            detail:storage
        });

        // userDecision와 ultimatum이 분리된 이유=> 저장됭 값은 nully할 수 있음. 빈 칸은 Y로 채워 서버로 보낸다.
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
            "timeArrived":null,
            "emptyPoints":[]
        };
        
        setPrionerStorage();

    };

    return{
        init,
        handleFix,
        setPrionerStorage,
        sendUltimatumToServer,
        getPointData,
        setPointDecision

    }
}


const GLOBAL_CONNECTION = connectGlobalMode();
export default GLOBAL_CONNECTION
