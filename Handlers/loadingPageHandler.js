import PAGEROUTER from "../Tools/pageRouter.js";
import OPERATION_EVENT_TARGETS from "../Tools/operationEventTargets.js";

// # 지금 당장은 이벤트 타겟으로 서버 통신을 mock 한다.
const LOADING_EVENT_TARGET = OPERATION_EVENT_TARGETS.loadingEventTarget;

// 1.
// ## 1-1. "상점 정보"와 "메인 페이지 정보" 받아오기 
// ## 연결이 안 될 경우'오프라인으로 플레이하기' 버튼도 있어야 할걸.

// 2. 

const LOADINGPAGE = ()=> {
    const listenInitiation = ()=>{
        LOADING_EVENT_TARGET.addEventListener("initiation",(e)=>{
            console.log("initiation event listened at loadingController",e.detail,"isOK",e.detail.isOK);
            if(e.detail.isOK){
                LOADING_EVENT_TARGET.dispatchEvent(new CustomEvent("userDataRequest",{
                    "isTrusted":true,
                    "bubbles":false,
                    "detail":{
                        "userId":"userId getter needed", // ## entryPoint: Connection 폴더에 ...=> 아니다, 모듈을 따로 또 파? 그냥 여기서 로컬스토리지에 접속해버리자. 로딩페이지는 길어질 필요가 없다. 분기별로, 케이스만 잘 나눠주면 돼. const storage = window.localStorage; 작성. 그리고 mockUserData로, main.js에서 데이터 세팅 하나만 해 두자.
                        "userDevice":"device Info getter needed"
                    }
                }));
            };
        });

    }
    const init = ()=>{
        listenInitiation();
        const loadingToMainBtn = document.getElementById("loadingToMainBtn");
        loadingToMainBtn.addEventListener("click",()=>{
            PAGEROUTER.moveToPage("MAIN");
        });

    };

    return{
        init
    }

};

export default LOADINGPAGE