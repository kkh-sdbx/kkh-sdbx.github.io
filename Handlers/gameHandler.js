//Closure 패턴으로 정리. 
import PAGEROUTER from "../Tools/pageRouter.js";
import G_EVENT_TARGETS from "../Tools/gameEventTargets.js";
import OPERATION_EVENT_TARGETS from "../Tools/operationEventTargets.js";

// 컨트롤러로서, View 와 Model 임포트
import GAME_RENDERER from "../Visual/gameRenderer.js";
import GAME_CONNECTION from "../Connection/gameConnection.js";

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

// ## 일단 global-> Game 으로 수정은 됐다.


const VIEW = GAME_RENDERER;
const MODEL = GAME_CONNECTION;

const START_GAME_EVENT_TARGET = OPERATION_EVENT_TARGETS.startGameEventTarget;

const POINTS_EVENT_TARGET = G_EVENT_TARGETS.pointsEventTarget;
const SELECTION_EVENT_TARGET = G_EVENT_TARGETS.selectionEventTarget;
const MODAL_EVENT_TARGET = G_EVENT_TARGETS.modalEventTarget;
const MOCK_SERVER_EVENT_TARGET = G_EVENT_TARGETS.mockServerEventTarget;

const createGAME = ()=>{

    // 각 point에 매칭된 상대의 정보를 제공.
    const updatePointData = ()=>{
        // 표시할 정보 : userName, YNKratio, history
        // history를 알려면, '나와 매칭된 기록'을 알아야 함.
        //  point 하나를 클릭해둔 상태에서 다른 포인트에 hover - 마우스를 갖다대면 툴팁 사라짐. 

    };

    const init = ()=>{
        console.log("gameHandler init");

        // import해둔 모듈들 init()  
        VIEW.init(G_EVENT_TARGETS);
        MODEL.init(G_EVENT_TARGETS);

        // eventTarget에 리스너 붙이기

        /**포인트 클릭 시 클라이언트 스토리지에서 매칭된 포인트에 있는 상대 정보 전달.*/ 
        POINTS_EVENT_TARGET.addEventListener("pointClicked",(e)=>{
            VIEW.updateTooltipContent(MODEL.getPointData(e.detail.G_currentPoint));

        });

        SELECTION_EVENT_TARGET.addEventListener("actionDecided",(e)=>{
            
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
            ultimatumSent.ultToRender.forEach((point)=>{
                VIEW.updateDecision(point);
            });
            VIEW.disableInteractives();

        });

        MOCK_SERVER_EVENT_TARGET.addEventListener("sendInfoToServer",(e)=>{

            // "Y" filling이 있으니 포인트 렌더링 업데이트
            for(let i=1;i<6;i++){   // ##이것도 Validator 기반으로 조회해야지.
                VIEW.updateDecision(MODEL.getPointData(`G_point_${i}`));
            
            };

            // 이제 서버에 ultimatum을 보냈으니, point들에 있는 클릭 이벤트 리스너를 떼어야 한다.=>screenBlocker로 처리함.
            // ult 이후 결과 대기까지 또 다른 CSS 스타일로 표시?
            VIEW.disableInteractives();
        });

        START_GAME_EVENT_TARGET.addEventListener("initiateGame",(e)=>{
            console.log("gameHandler listens initiateGame Event: ",e.detail);
    
            // ## !! 
            // 1)게임 페이지로 이동.
            PAGEROUTER.moveToPage("GAME");
            // ## !!  - pending 상태/로딩 상태를 의미하는 창이 하나 있으면 좋겠네. 일단 그건 나중에.
            // 2) 엘리먼트 좌표 설정
            VIEW.updateCoords();
            // 3) 받아온 게임룸 데이터를 로컬에 저장하고 그걸 렌더링
            VIEW.renderGameRoom(MODEL.setGameRoomData(e.detail));
            
        });

        // 창 크기 바뀔 때마다 resize 이벤트 받아서 크기 조정.
        window.addEventListener("resize",()=>{
            VIEW.updateCoords();
        })

    };
    
      
    return{
        init,
        updatePointData,

    }

}


const GAME = createGAME();
export default GAME


