// 데이터가 변경되었음을 알림 (누구에게? 상관없음, 그냥 던짐)

const connectGlobalMode = ()=>{

    let storage = null;
    let userDecisions = null;
    let ultimatum = null;

    let SEND_INFO_TO_SERVER_EVENT = null;
    let G_updateActionsFromStorage = null;
    let CHECK_EMPTY_POINTS_EVENT = null;

    let POINTS_EVENT_TARGET = null;
    let SELECTION_EVENT_TARGET = null;
    let MODAL_EVENT_TARGET = null;
    let MOCK_SERVER_EVENT_TARGET = null;

    // 사실 이 정보도 서버에서 받아와야 하는거지? 추후에 수정 필요하다.
    const setUserStorage = ()=>{
        storage.clear();
        storage.setItem("name","KH");
        storage.setItem("id","KH_ID");
        storage.setItem("status","not yet");
    };
    /**
     * point 1개의 decision 을 업데티
     * @params action이 일어난 point의 number
     */
    const getPointData = (pointNum)=>{
        let pointData = { "target":null, "action":null};
        const validator = ["Y","N","K"];
        let pointId = `G_point_${pointNum}`;

        if(pointNum>5 || pointNum<1){
            console.log("pointNumber invalid:", pointNum);
            return
        }
        
        if(validator.includes(storage.getItem(pointId))){
            pointData.push({ "target":pointId, "action":storage.getItem(pointId)});
            
        }else{
            pointData.push({"target":pointId, "action":null});
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
        const checker = ["G_point_1","G_point_2","G_point_3","G_point_4","G_point_5"];

        userDecisions = {
            "userId":storage.id,
            "G_point_1":null,
            "G_point_2":null,
            "G_point_3":null,
            "G_point_4":null,
            "G_point_5":null,
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
        setUserStorage();

        // 이 Model 안에서 쓸 이벤트 타겟 지정.
        POINTS_EVENT_TARGET = eventTarget.pointsEventTarget;
        SELECTION_EVENT_TARGET = eventTarget.selectionEventTarget;
        MODAL_EVENT_TARGET = eventTarget.modalEventTarget;
        MOCK_SERVER_EVENT_TARGET = eventTarget.mockServerEventTarget;

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
            "timeArrived":null
        };
            
    };

    return{
        init,
        handleFix,
        setUserStorage,
        sendUltimatumToServer,
        getPointData

    }
}


const GLOBAL_CONNECTION = connectGlobalMode();
export default GLOBAL_CONNECTION
