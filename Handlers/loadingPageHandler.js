import PAGEROUTER from "../Tools/pageRouter.js";
import OPERATION_EVENT_TARGETS from "../Tools/operationEventTargets.js";

// # 지금 당장은 이벤트 타겟으로 서버 통신을 mock 한다.
const LOADING_EVENT_TARGET = OPERATION_EVENT_TARGETS.loadingEventTarget;

// 1.
// ## 1-1. "상점 정보"와 "메인 페이지 정보" 받아오기 
// ## 연결이 안 될 경우'오프라인으로 플레이하기' 버튼도 있어야 할걸.

// 2. 

const LOADINGPAGE = ()=> {
    
    const listenInitiation = (userData)=>{

        console.log("userData: ",userData);
        LOADING_EVENT_TARGET.addEventListener("initiation",(e)=>{
            console.log("initiation event listened at loadingController",e.detail,"isOK",e.detail.isOK);
            if(e.detail.isOK){
                LOADING_EVENT_TARGET.dispatchEvent(new CustomEvent("userDataRequest",{
                    "isTrusted":true,
                    "bubbles":false,
                    "detail":{
                        "userID":userData.userID,
                        "userName":userData.userName,   
                        "deviceInfo":userData.deviceInfo 
                    }
                }));
            };
        });

    };

    // 서버에서 준 renderInfo를 받아와 렌더링하는 코드.
    const listenMainPageRenderData = ()=>{
        LOADING_EVENT_TARGET.addEventListener("renderShopAndMainPage",(e)=>{
            const renderInfo = e.detail;
            console.log("loadingHandler got mainPageRenderInfo: ", renderInfo);
            
            LOADING_EVENT_TARGET.dispatchEvent(new CustomEvent("loadingFinished",{
                "isTrusted":true,
                "bubbles":false,
                "detail":renderInfo
            }));
        });
 
    };


    const init = (userStorageData)=>{
        listenInitiation(userStorageData);
        listenMainPageRenderData();       

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