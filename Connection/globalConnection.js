// 데이터가 변경되었음을 알림 (누구에게? 상관없음, 그냥 던짐)

import SCHEMA from "../Tools/DATA_SCHEMA.js";

const connectGlobalMode = ()=>{
    let ACTION_VALIDATOR = null;
    let POINT_VALIDATOR = null;

    let storage = null;
    let ultimatum = null;
    let PRISONER_DATA= null;

    let SEND_INFO_TO_SERVER_EVENT = null;
    let G_updateActionsFromStorage = null;
    let CHECK_EMPTY_POINTS_EVENT = null;

    let POINTS_EVENT_TARGET = null;
    let SELECTION_EVENT_TARGET = null;
    let MODAL_EVENT_TARGET = null;
    let MOCK_WEB_EVENT_TARGET = null;


    // 사실 이 정보도 서버에서 받아와야 하는거지? 추후에 수정 필요하다.
    const setPrisonerStorage = ()=>{
        const DATA_SCHEMA = SCHEMA();
        PRISONER_DATA = DATA_SCHEMA.prisonerData();
        storage.clear();
        
        storage.setItem("id",PRISONER_DATA.PRISONER_ID);
    
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

        if(!(POINT_VALIDATOR.includes(pointId))){
            console.log("pointId invalid:", pointId); 
            // 추가적인 방어 코드가 필요한 부분이다.
        }

        if(ACTION_VALIDATOR.includes(storage.getItem(pointId))){
            pointData = { "target":pointId, "action":storage.getItem(pointId)};
        }else{
            pointData = {"target":pointId, "action":null};
        }


        // DECISION_DETAIL = {"target":G_currentPoint.id, "action":G_currentPoint.dataset.btnType };
        // 데이터가 변경되었음을 알림
        return pointData

    };    

    /**
     * 포인트에서 내린 결정을 스토리지에 업데이트하는 함수
     * @params {"target":G_currentPoint.id, "action":"Y"}
     */
    const setPointDecision = (fixData) =>{
        // {"target":null, "action":"Y" }를 받아온다.

        // 여기서 K가 2건인 사항을 걸러내자.=> 이 필터링이 여기 있어야 하는 이유가 잇을지는 나중에 생각.
        
        const previousActions = [];        
        POINT_VALIDATOR.forEach((point)=>{
            if(fixData.target != point){
                previousActions.push(storage.getItem(`${point}`));
            }        
        });        

        if(fixData.action === "K" && previousActions.includes("K")){
             //return ErrorMSG 가 필요한듯
            MODAL_EVENT_TARGET.dispatchEvent(new CustomEvent("userViolation",{
                bubbles: false,
                cancelable: false,
                detail:{"type":"doubleK","message":"You already used your kick Card!"}
            }));
            return
        }else{
            storage.setItem(fixData.target,fixData.action);
        }
        

    };

    const handleFix = ()=>{ 
        /** //## entryPoint:FIX->Proceed 버튼 눌렀을 때 이 에러가 나온다. 
         * globalConnection.js:102 Uncaught ReferenceError: userDecisions is not defined
    at Object.handleFix (globalConnection.js:102:23)
    at EventTarget.<anonymous> (globalHandler.js:82:19)
    at HTMLButtonElement.<anonymous> (globalRenderer.js:312:32)Understand this error
globalConnection.js:137 Uncaught ReferenceError: userDecisions is not defined
    at Object.sendUltimatumToServer (globalConnection.js:137:38)
    at EventTarget.<anonymous> (globalHandler.js:92:19)
    at HTMLButtonElement.<anonymous> (globalRenderer.js:323:32)
         */

        userDecisions = {
            "userId":storage.getItem("id"),
            "G_point_1":undefined,
            "G_point_2":undefined,
            "G_point_3":undefined,
            "G_point_4":undefined,
            "G_point_5":undefined,
            "emptyPoints":[]
        }

        for(const point of POINT_VALIDATOR){
            let userAction = storage.getItem(point);
            if(ACTION_VALIDATOR.includes(userAction)){ //fix 시점에서, action이 localStorage에 저장되어 있으면 result에 입력
                userDecisions[point] = userAction;

            }else{ //fix 시점에서, action이 localStorage에 없으면
                userDecisions.emptyPoints.push(point);
            }
        };
        
         
        MODAL_EVENT_TARGET.dispatchEvent(new CustomEvent("checkEmptyPoints",{
            bubbles: false,
            cancelable: false,
            detail:userDecisions

        }));

        

    };

    const sendUltimatumToServer = ()=>{               

        for(const point of POINT_VALIDATOR){
            console.log(`${point} :`,userDecisions[point] );
            if(userDecisions[point]){ //fix 시점에서, action이 localStorage에 저장되어 있으면 result에 입력
                
                ultimatum[point] = userDecisions[point];
            }else{
                ultimatum[point] = "Y";
                storage.setItem(point,"Y");
            }
        };
        
        console.log("Ult: ",ultimatum);

        //# 문제는 여기, 이제 서버로 보내야 함.
        // mockServer로 일단 흉내만 내 볼 것인지, 아니면 실제 VM에 올릴 것인지?
        // =>어차피 이 노트북에서는 GCP 접속도 못 한다 ㅋㅋㅋㅋㅋㅋㅋㅋ

        //  문제 1: userDecision과 Ult가 다르다. N과 K 문제인듯. => 이건 해결함.

        // # 문제 2, fix 이후에, Y로 자동 채워진 빈칸의 CSS가 변경되지 않아.

        // ## userDecisions를 없애고, storage에서 바로 받아온다.
        // ## ultimatum을  보내는 이벤트를, 보낼 때마다 new CustomEvent로 구현한다.
        MOCK_WEB_EVENT_TARGET.dispatchEvent(SEND_INFO_TO_SERVER_EVENT);



    }; 
    

    const init = (eventTarget)=>{
        
        // 지금은 localStorage를 쓰지만 모바일이든 PC버전이든 스토리지를 수정해야 한다.
        storage = window.localStorage;

        // 이 Model 안에서 쓸 이벤트 타겟 지정.
        POINTS_EVENT_TARGET = eventTarget.pointsEventTarget;
        SELECTION_EVENT_TARGET = eventTarget.selectionEventTarget;
        MODAL_EVENT_TARGET = eventTarget.modalEventTarget;
        MOCK_WEB_EVENT_TARGET = eventTarget.mockWebEventTarget;
        ACTION_VALIDATOR = ["Y","N","K"];
        POINT_VALIDATOR = ["G_point_1","G_point_2","G_point_3","G_point_4","G_point_5"];

        ultimatum = {
            "userId":storage.getItem("id"),
            "G_point_1":storage.getItem("G_point_1"),
            "G_point_2":storage.getItem("G_point_2"),
            "G_point_3":storage.getItem("G_point_3"),
            "G_point_4":storage.getItem("G_point_4"),
            "G_point_5":storage.getItem("G_point_5"),
            "timeArrived":null
        };

        
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
        
        setPrisonerStorage();

    };

    return{
        init,
        handleFix,
        setPrisonerStorage,
        sendUltimatumToServer,
        getPointData,
        setPointDecision

    }
}


const GLOBAL_CONNECTION = connectGlobalMode();
export default GLOBAL_CONNECTION
