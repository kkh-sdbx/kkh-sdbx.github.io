
//Closure 패턴으로 정리. 
import PAGEROUTER from "../Tools/pageRouter.js";
import G_EVENT_TARGETS from "../Tools/globalEventTargets.js";

// 컨트롤러로서, View 와 Model 임포트
import GLOBAL_RENDERER from "../Visual/globalRenderer.js";
import GLOBAL_CONNECTION from "../Connection/globalConnection.js";


/**
 * // 3. Controller (Controller.js) - 연결 고리
    import { Model } from './Model.js';
    import { View } from './View.js';
    [Model -> View] 모델의 이벤트를 감지하여 뷰를 업데이트
    // [User -> Model] 사용자 입력을 감지하여 모델 작동
 * 
 */

/**
 * Model이 서버에서 받아온 정보를 커스텀 이벤트로 dispatch(서버 통신 성공 알림) => 
 * Controller가 이걸 듣고(addEventListener) 콜백으로 View.changeButtonColor(e); 호출
 * 
 * 과 같은 프로세스로 진행한다.
 */

const VIEW = GLOBAL_RENDERER;
const MODEL = GLOBAL_CONNECTION;

const POINTS_EVENT_TARGET = G_EVENT_TARGETS.pointsEventTarget;
const SELECTION_EVENT_TARGET = G_EVENT_TARGETS.selectionEventTarget;
const MODAL_EVENT_TARGET = G_EVENT_TARGETS.modalEventTarget;
const MOCK_SERVER_EVENT_TARGET = G_EVENT_TARGETS.mockServerEventTarge;




const createGLOBAL = ()=>{

    /**
     * !! Listener: G_selectionPanel !! 
     *  N/Y/K 클릭 시 Renderer classList 수정 이벤트 전달, Connection에는 현재 선택지 업데이트 이벤트 전달.
     */
    const updateActions = (e)=>{

        






























            for(let i=1;i<G_points.length+1;i++){
                    if(storage[`point_${i}`]!=undefined){
                        
                        //div에, 현재 선택해 놓은 선택지를 로드하는 게 필요하다.

                        if(storage[`point_${i}`] === "Y"){
                            G_points[i-1].parentElement.classList.remove("kicked");
                            G_points[i-1].nextElementSibling.classList.add("picked");
                            G_points[i-1].previousElementSibling.classList.remove("picked");
                            G_points[i-1].classList.add('decided');


                        }else if(storage[`point_${i}`] === "N"){
                            G_points[i-1].parentElement.classList.remove("kicked");
                            G_points[i-1].nextElementSibling.classList.remove("picked");
                            G_points[i-1].previousElementSibling.classList.add("picked");
                            G_points[i-1].classList.add('decided');


                        }else if(storage[`point_${i}`] === "K"){
                            G_points[i-1].parentElement.classList.add("kicked");
                            G_points[i-1].nextElementSibling.classList.remove("picked");
                            G_points[i-1].previousElementSibling.classList.remove("picked");
                            G_points[i-1].classList.add('decided');


                        }else{
                            console.log(storage[`G_point_${i}`]);
                        }
                    }


                }
        
    };

    const updatePointData = ()=>{/** 각 point에 매칭된 상대의 정보를 제공.*/
        // 표시할 정보 : userName, YNKratio, history
        // history를 알려면, '나와 매칭된 기록'을 알아야 함.
        //  point 하나를 클릭해둔 상태에서 다른 포인트에 hover - 마우스를 갖다대면 툴팁 사라짐. 

    };

    const init = ()=>{

        // import해둔 모듈들 init()  
        VIEW.init(EVENT_TARGETS);
        MODEL.init(EVENT_TARGETS);

        // eventTarget에 리스너 붙이기
        selectionEventTarget.addEventListener("actionDecided",(e)=>{
            // {"target":null, "action":"Y" }를 받아온다.
            VIEW.updateDecision(e.detail);
            MODEL.updateDecisionData(e.detail);
        });

        modalEventTarget.addEventListener("actionFixed",(e)=>{
            // detail은 없고, proceedBtn 누른 것만 확인.
            MODEL.handleFix();

        });

        modalEventTarget.addEventListener("checkEmptyPoints",(e)=>{
            VIEW.setModalText(e.detail);
        });

        modalEventTarget.addEventListener("sendUltimatum",()=>{ // 선택지를 fix->proceed한 경우.
            VIEW.
            MODEL.sendUltimatumToServer();
        });


    };
    

    

        


      
    return{
        init,
        updatePointData,
        updateActions


    }

}


const GLOBAL = createGLOBAL();
export default GLOBAL


