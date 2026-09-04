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
const MOCK_SERVER_EVENT_TARGET = G_EVENT_TARGETS.mockServerEventTarget;




const createGLOBAL = ()=>{

    // 각 point에 매칭된 상대의 정보를 제공.
    const updatePointData = ()=>{
        // 표시할 정보 : userName, YNKratio, history
        // history를 알려면, '나와 매칭된 기록'을 알아야 함.
        //  point 하나를 클릭해둔 상태에서 다른 포인트에 hover - 마우스를 갖다대면 툴팁 사라짐. 

    };

    const init = ()=>{

        // import해둔 모듈들 init()  
        VIEW.init(G_EVENT_TARGETS);
        MODEL.init(G_EVENT_TARGETS);

        // storage에 있는 global 선택지들 업데이트해서보여준다.
        for(let i=1;i<6;i++){  
            VIEW.updateDecision(MODEL.getPointData(`G_point_${i}`));
            
        };

        // eventTarget에 리스너 붙이기
        SELECTION_EVENT_TARGET.addEventListener("actionDecided",(e)=>{
            // {"target":null, "action":"Y" }를 받아온다.
            
            // MODEL이 storage에 data 저장
            MODEL.setPointDecision(e.detail);

            // 저장된 data 받아서 VIEW업데이트 => 이 함수가 Controller 안에 있는updatePointData와 같은 것 아닌가?
            VIEW.updateDecision(MODEL.getPointData(e.detail.target));
            
 
            
        });

        MODAL_EVENT_TARGET.addEventListener("userViolation",(e)=>{
            //detail:{"type":"doubleK","message":"You already used your kick Card!"}
            VIEW.showWarning(e.detail);

        });
        
        MODAL_EVENT_TARGET.addEventListener("checkEmptyPoints",(e)=>{ // FIX 버튼을 누른 경우
            const emptyPoints = MODEL.handleFix();
            VIEW.setModalText(emptyPoints);
        });

        MODAL_EVENT_TARGET.addEventListener("sendUltimatum",()=>{ // 선택지를 fix->proceed한 경우.

            //VIEW에서 

            const ultimatumSent = MODEL.sendUltimatumToServer(); 
        });




        MOCK_SERVER_EVENT_TARGET.addEventListener("sendInfoToServer",(e)=>{

            // 

            // "Y" filling이 있으니 포인트 렌더링 업데이트
            for(let i=1;i<6;i++){   // ##이것도 Validator 기반으로 조회해야지.
                VIEW.updateDecision(MODEL.getPointData(`G_point_${i}`));
            
            };

            
            // 이제 서버에 ultimatum을 보냈으니, point들에 있는 클릭 이벤트 리스너를 떼어야 한다.=>screenBlocker로 처리함.
            // ult 이후 결과 대기까지 또 다른 CSS 스타일로 표시?
            VIEW.disableInteractives();
        });


    };
    
      
    return{
        init,
        updatePointData,



    }

}


const GLOBAL = createGLOBAL();
export default GLOBAL


