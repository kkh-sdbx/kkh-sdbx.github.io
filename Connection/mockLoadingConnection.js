import OPERATION_EVENT_TARGETS from "../Tools/operationEventTargets.js";

// # 지금 당장은 이벤트 타겟으로 서버 통신을 mock 한다. setInteral()이나 확률적으로 404 error 같은 걸 넣을 수도 있다.
const LOADING_EVENT_TARGET = OPERATION_EVENT_TARGETS.loadingEventTarget;
LOADING_EVENT_TARGET.addEventListener("userDataRequest",(e)=>{
console.log("userDataRequest event listened at loadingController",e.detail);
    
});

/* 모듈화 할건지?
const mockLoadingConnection = ()=>{
    const init = ()=>{
    };
    return {
        init
    };
};
*/

