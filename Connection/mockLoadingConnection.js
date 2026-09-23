import OPERATION_EVENT_TARGETS from "../Tools/operationEventTargets.js";
import DB_HANDLER from "./mockDB.js";
// # 지금 당장은 이벤트 타겟으로 서버 통신을 mock 한다. setInteral()이나 확률적으로 404 error 같은 걸 넣을 수도 있다.
const LOADING_EVENT_TARGET = OPERATION_EVENT_TARGETS.loadingEventTarget;

LOADING_EVENT_TARGET.addEventListener("userDataRequest",(e)=>{
    console.log("userDataRequest event listened at loadingController",e.detail);
    DB_HANDLER.seeDB();
    const userInfo = DB_HANDLER.searchUserInfoById();
   
   // ## 서버로 통신요청해서 받아올 정보는 1.상점 2.마이페이지 정보. 무결성 검증이 필요한 경우다.
   // ## userDataRequest에서, 디바이스나 유저의 로그인 정보를 보내야 서버에서 관련 DB에 접속할 수 있겠지.

    
});





// ## mockDB 만들어서(일단 JSON형 DB를 쓴다고 가정) userID 기반으로 값 찾아서, 클라이언트에 쏴 주고 클라이언트는 서버에서 받은 데이터 기반으로 DATA_SCHEMA와 상점/메인페이지 렌더링을 해야 한다.


/* 모듈화 할건지?
const mockLoadingConnection = ()=>{
    const init = ()=>{
    };
    return {
        init
    };
};
*/

