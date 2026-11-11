
import PAGEROUTER from "../Tools/pageRouter.js";
/**
 * 
 * K를 누르는 순간 비활성화
 * (disabled) 처리해서 "이번 라운드엔 더 못 씀"을 시각적으로 알려주는 
 * 게 좋을 것 같아요 -> Claude의 주장. 아주 좋은 포인트라고 본다.
 * 
 */

const renderGameMode = ()=>{
    // View (View.js) - UI만 담당
    let G_container = null;
    let G_fixBtn = null;
    let G_points = null;

    let POINTS_TABLE = new Map([
        ["G_point_1",null],
        ["G_point_2",null],
        ["G_point_3",null],
        ["G_point_4",null],
        ["G_point_5",null],
        ["G_userPoint",null]
    ]);

    let G_tooltip = null;
    let G_opntName  = null;
    let G_opntYNKratio = null;

    let G_selection = null;
    let G_YBtn  = null;
    let G_NBtn = null;
    let G_KBtn = null;
    let G_KChecker = null;

    let G_proceedBtn = null;
    let G_discardBtn = null;
    
    let G_warningModal = null;
    let G_warningModalTitle = null
    let G_warningModalContent = null;
    let G_warningBtn = null;

    let G_fixPanel = null;
    let G_fixPanelTitle = null;
    let G_fixPanelContent = null;
    let G_screenBlocker = null;

    let G_myHp = null;

    let gameToMainBtn = null;

    let G_coords = null;
    let G_currentPoint = null;
    let G_pointData = null;

    let G_donutSkin = null;
    let G_isDonut = null;
  
    let ACTION_FIXED_EVENT = null;
  
    let SELECTION_EVENT_TARGET = null;
    let MODAL_EVENT_TARGET = null;    


    /** G_Container 크기를 기반으로 육각형에서 각 point 좌표를 계산 */
    const setHexagonCoords = (containerHeight, containerWidth)=>{
        /**
         * { // CONTAINER_HEIGHT === CONTAINER_WIDTH인 정사각형을 가정함.
            "a":CONTAINER_HEIGHT /4,
            "pointContainer_R":CONTAINER_HEIGHT /10,
            "widthMargin": (CONTAINER_WIDTH -(2*ROOT_THREE*a))/2,
            "point_R":pointContainer_R*0.8,
            "point_1":{"left":widthMargin+(ROOT_THREE*a)-(pointContainer_R/2),"top":0},
            "point_2":{"left":widthMargin-(pointContainer_R/2),"top":a-(pointContainer_R/2)},
            "point_3":{"left":widthMargin+(2*ROOT_THREE*a)-(pointContainer_R/2),"top":a-(pointContainer_R/2)},
            "point_4":{"left":widthMargin-(pointContainer_R/2),"top":(3*a)-(pointContainer_R/2)},
            "point_5":{"left":widthMargin+(2*ROOT_THREE*a)-(pointContainer_R/2),"top":(3*a)-(point_R/2)},
            "point_6_userPoint":{"left":widthMargin+(ROOT_THREE*a)-(pointContainer_R/2),"top":CONTAINER_HEIGHT-(pointContainer_R/2)},
            "tooltip":{"left: widthMargin+(1.5*pointContainer_R)","top":2*pointContainer_R,"width":CONTAINER_HEIGHT-(2*widthMargin+3*pointContainer_R),"height":CONTAINER_HEIGHT-(4*pointContainer_R)}
            }
         */

        console.log("containerHeight: ",containerHeight,"containerWidth: ",containerWidth);

        const pointContainer_R = containerHeight/10;
        const point_R = pointContainer_R * 0.8;

        // pointContainer && point 너비와 높이 설정

        const pCs = document.querySelectorAll(".G_pointContainer");

        pCs.forEach((pC)=>{
            pC.style.width = `${pointContainer_R}px`;
            pC.style.height = `${pointContainer_R}px`;
        });

        POINTS_TABLE.forEach((point,name)=>{
            point.style.width = `${point_R}px`;
            point.style.height = `${point_R}px`;
        });
        
        const ROOT_THREE = 1.732;
        const a = containerHeight/4;
        // ## 모바일이든 어디든...기형적으로 좁거나 넓은 container 형태가 될 수 있다. 그것도 생각해야 함. 일단은 진행한다.

        const widthMargin = (containerWidth-(2*ROOT_THREE*a))/2;
        console.log(
            "CONTAINER_HEIGHT: ",containerHeight,
            "CONTAINER_WIDTH: ",containerWidth,
            "a: ",a,
            "widthMargin: ",widthMargin
        );

        // ## 맨 위 점
        const HEX_COORDS = {
            // 최상단
            "G_point_1_Container":{"left":widthMargin+(ROOT_THREE*a)-(pointContainer_R/2),"top":0},
            // 좌상단
            "G_point_2_Container":{"left":widthMargin-(pointContainer_R/2),"top":a-(pointContainer_R/2)},
            // 우상단
            "G_point_3_Container":{"left":widthMargin+(2*ROOT_THREE*a)-(pointContainer_R/2),"top":a-(pointContainer_R/2)},
            // 좌하단
            "G_point_4_Container":{"left":widthMargin-(pointContainer_R/2),"top":(3*a)-(pointContainer_R/2)},
            // 우하단
            "G_point_5_Container": {"left":widthMargin+(2*ROOT_THREE*a)-(pointContainer_R/2),"top":(3*a)-(point_R/2)},
            // 맨 아래 점(플레이어)
            "G_userPoint_Container":{"left":widthMargin+(ROOT_THREE*a)-(pointContainer_R/2),"top":containerHeight-(pointContainer_R/2)}

        }; 

        console.log("HEX_COORDS: ",HEX_COORDS);
        
        pCs.forEach((pC)=>{
            pC.style.left = `${HEX_COORDS[pC.id].left}px`;
            pC.style.top = `${HEX_COORDS[pC.id].top}px`;

        });

        
        // 화면 상 좌표와...계산된 css 스타일의 차이인 것 같다. getBoundingClientRect와 getComputedStyle()의 차이인 듯.
        // getBoundingClientRect를 모두  getComputedStyle()로 수정해 보고 렌더링하기.

        // 가로로 넓은 스크린의 경우 가로마진, 세로로 넓은 스크린의 경우 ... => 가 아니라! 가장 큰 정사각형을 찾은 다음 그걸 기준으로 육각형 배치하는 형태로 가자.
        // ## entryPoint : 세로가 길 경우와 가로가 길 경우가 다르겠지? 가로가 긴 경우 코드 작성해 보기. updateCoords()에서 가로세로 크기 받아오면 된다. 받아와서 console.log()까지만.
        return widthMargin
    };

    /**컨테이너 높이, 너비, 마진 받아서 툴팁 위치 결정 */    
    const setTooltip = (containerHeight,containerWidth,hexagonNums)=>{

        // ## tooltip이 지금 display = "none"인데, 시스템이 game_skins.css를 읽어오고 있는 듯하다. 문제해결 필요. => game_skins를 일단 index.html에서 빼뒀다.
        console.log(G_tooltip,hexagonNums);

        const tooltipBaseWidth = containerWidth -(2*(hexagonNums.widthMargin + hexagonNums.pointR));
        const tooltipBaseHeight = tooltipBaseWidth;  // 일단 가로세로 동일하게 놓고 나중에 계산한다.
        const G_TOOLTIP_LENGTH = tooltipBaseWidth - (2*hexagonNums.pointR);
        const G_TOOLTIP_HEIGHT = G_TOOLTIP_LENGTH;

        console.log("tooltip setting: ",
            "tooltipBaseWidth: ",tooltipBaseWidth,
            "tooltipBaseHeight: ",tooltipBaseHeight,
            "G_TOOLTIP_LENGTH: ",G_TOOLTIP_LENGTH,
            "G_TOOLTIP_HEIGHT: ",G_TOOLTIP_HEIGHT
        );
        //## console.log()나오긴 하는데 위 계산이 전혀 적용이 안 된 것 같은데?
        //G_tooltip.style.display = "block";

        G_tooltip.style.left = `${hexagonNums.widthMargin+hexagonNums.pointR + (tooltipBaseWidth/4)}px`;
        G_tooltip.style.top = "200px"//`${containerWidth/4}px`; // ## 이것도 계산 필요
        G_tooltip.style.width = `${G_TOOLTIP_LENGTH}px`;
        G_tooltip.style.height = `${G_TOOLTIP_HEIGHT}px`;

        // ## entryPoint: 좌표평면 위에 widthMargin 포함해서, 정사각형 안에 육각형과 원을 어떻게 배치할건지 그려 보자.
        console.log(
            "left:",G_tooltip.style.left,
            "top:",G_tooltip.style.top,
            "width:",G_tooltip.style.width,
            "height:",G_tooltip.style.height

        );
        //G_tooltip.style.left = `${G_TOOLTIP_LENGTH}px`;
        //G_tooltip.style.top = `${G_TOOLTIP_HEIGHT}px`;
            
        /**
         *            // point의 stlye 수정해서 육각형 만들기
            POINT_CONTAINER.style.left = `${changedLeft}px`;
            POINT_CONTAINER.style.top = `${changedTop}px`;
         */
       // G_tooltip.style.display = "block";


    };

    /**컨테이너 높이, 너비, 마진 받아서 선택지 위치 결정 */
    const setSelection = (containerHeight,containerWidth,containerMargin)=>{
        const G_SELECTION_LENGTH = parseInt(window.getComputedStyle(G_selection).width.split("px")[0]);
        const G_SELECTION_HEIGHT = parseInt(window.getComputedStyle(G_selection).height.split("px")[0]);
       // G_selection.style.display = "block";

    };
    const updateCoords = ()=>{
            
        // 컨테이너 가져와서 높이와 너비 계산
        const G_CONTAINER_HEIGHT = parseInt(window.getComputedStyle(G_container).height.split("px")[0]);
        const G_CONTAINER_WIDTH = parseInt(window.getComputedStyle(G_container).width.split("px")[0]);

        console.log("G_CONTAINER_HEIGHT: ",G_CONTAINER_HEIGHT,typeof(G_CONTAINER_HEIGHT),"G_CONTAINER_WIDTH: ",G_CONTAINER_WIDTH);

        // 우선 육각형 좌표부터 계산
        const G_HEXAGON_NUMS = setHexagonCoords(G_CONTAINER_HEIGHT,G_CONTAINER_WIDTH);

        // G_Coords에 수정된 좌표 업데이트 - 필요한 과정인가? 일단 놔둬보자.
        G_coords.G_point_1.x = POINTS_TABLE.get("G_point_1").getBoundingClientRect().left; 
        G_coords.G_point_1.y = POINTS_TABLE.get("G_point_1").getBoundingClientRect().top; 
            
        G_coords.G_point_2.x = POINTS_TABLE.get("G_point_2").getBoundingClientRect().left;
        G_coords.G_point_2.y = POINTS_TABLE.get("G_point_2").getBoundingClientRect().top;

        G_coords.G_point_3.x = POINTS_TABLE.get("G_point_3").getBoundingClientRect().left;
        G_coords.G_point_3.y = POINTS_TABLE.get("G_point_3").getBoundingClientRect().top;

        G_coords.G_point_4.x = POINTS_TABLE.get("G_point_4").getBoundingClientRect().left;
        G_coords.G_point_4.y = POINTS_TABLE.get("G_point_4").getBoundingClientRect().top;

        G_coords.G_point_5.x = POINTS_TABLE.get("G_point_5").getBoundingClientRect().left;
        G_coords.G_point_5.y = POINTS_TABLE.get("G_point_5").getBoundingClientRect().top;

        G_coords.G_userPoint.x = POINTS_TABLE.get("G_userPoint").getBoundingClientRect().left;
        G_coords.G_userPoint.y = POINTS_TABLE.get("G_userPoint").getBoundingClientRect().top;

        // G_Container계산 기반으로 툴팁과 셀렉션 좌표 설정.
        setTooltip(G_CONTAINER_HEIGHT,G_CONTAINER_WIDTH,G_HEXAGON_NUMS);
        setSelection(G_CONTAINER_HEIGHT,G_CONTAINER_WIDTH,G_HEXAGON_NUMS);

    };

    const renderGameRoom = (gameRoomToRender)=>{
        console.log("gameRenderer gets gameRoomToRender: ",gameRoomToRender);

        const myID = gameRoomToRender.myID;
        const myName = gameRoomToRender.myName;
        const gameRoomData = gameRoomToRender.gameRoomData;

        // 포인트 6에 자기 자신을 넣고 나머지 포인트에는 순서대로 넣기.
        let opntPointNum = 1;
        gameRoomData.prisoners.forEach((prisoner)=>{
            console.log(prisoner.leader);
            if(prisoner.leader != myID){
                // ## 적 이름을 렌더링 - 아직 prisonerID와 prisonerName의 구분이 정확하지 않다.

                // ## 포인트의 구조가 바뀌었다. 포인트가 제공하는 정보가 변했지.
                // ## 레이아웃 생각을 해야 한다. 육각형 내의 대각선/변으로 매치를 표현하려면 육각형 정가운데 사각형이 뜨는 건 굉장히 비-직관적이고 미관을 해쳐.
                // !! 아이디어 -버튼 매치는 빨간색, 서브버튼 매치는 파란색, 더블매치의 경우 보라색.(뭐 이런식으로!)
                // ## 아니면 정가운데 사각형에 css 효과를 줘서 blur 되게 할까? -> 일단 'z-index로 가리는'방식을 써 보자.
                POINTS_TABLE.get(`G_point_${opntPointNum}`).innerHTML = prisoner.leader;
                opntPointNum += 1;
            }else{
                // 내 포인트에 렌더링.
                G_userPoint.innerHTML = myName;
            };

        });
    };

    const setSelectionInteractive = (e)=>{
        G_YBtn.addEventListener("click",()=>{
            if(!G_currentPoint) {return};
            G_currentPoint.classList.remove("activated");
            
            SELECTION_EVENT_TARGET.dispatchEvent(new CustomEvent("actionDecided",{
            bubbles: false,
            cancelable: false,
            detail:{"target":G_currentPoint.id, "action":"Y"}

            }));
            G_currentPoint = null;
        });
        G_NBtn.addEventListener("click",()=>{
            if(!G_currentPoint) {return};
            G_currentPoint.classList.remove("activated");
            
            SELECTION_EVENT_TARGET.dispatchEvent(new CustomEvent("actionDecided",{
            bubbles: false,
            cancelable: false,
            detail:{"target":G_currentPoint.id, "action":"N"}

            }));
            G_currentPoint = null;
        });
        G_KBtn.addEventListener("click",()=>{
            if(!G_currentPoint) {return};
            G_currentPoint.classList.remove("activated");
            
            SELECTION_EVENT_TARGET.dispatchEvent(new CustomEvent("actionDecided",{
            bubbles: false,
            cancelable: false,
            detail:{"target":G_currentPoint.id, "action":"K"}

            }));
            G_KChecker = {"target":G_currentPoint.id};
            G_currentPoint = null;
            
        })
    };            

    const setPointsInteractive = ()=>{
            //마우스 오버 이벤트 핸들러
            G_points.forEach(point => {
                               
                point.addEventListener("click",(e)=>{ //# 선택된 포인트 다시 클릭하면 'decided'지우고, 선택한 선택지 제거하기 !! #

                    const target = point.id;

                    if( G_currentPoint != null) {

                        if( G_currentPoint === point){                             
                            G_currentPoint = null;
                            point.classList.remove('activated');

                        }else{ // 이전에 클릭했던 point가 있고, 새 point 클릭 시

                            G_currentPoint.classList.remove('activated');
                            G_currentPoint = point;
                            point.classList.add('activated');

                        };

                    }else{ // 이전에 클릭했던 point가 없고, 새 point 클릭 시
                        
                        //point.classList.remove("decided");
                        point.classList.add('activated');
                        G_currentPoint = point;
                        
                    };
                    
                });

            });

        };
        

        /**
         * 컨트롤러에서 호출됨. target G_point의 decided classList를 바꿔주는 함수.
         * DECISION_DETAIL을 그대로 받아온다.
         * @param
         */
        const updateDecision = (decisionDetail)=>{

            // DECISION_DETAIL = {"target":G_currentPoint.id, "action":G_currentPoint.dataset.btnType };
            let targetPoint = POINTS_TABLE.get(decisionDetail.target);

            if(decisionDetail.action === "Y"){


            }else if(decisionDetail.action === "N"){


            }else if(decisionDetail.action === "K"){
                //# K를 누른 포인트에서는,K를 다시 누를 수 없도록 해야 한다.
                G_KChecker = {"target":null}; // : K를 누르면 어느 포인트에서 K를 눌렀는지만 표시해놓고, 
                

            }else if(decisionDetail.action === null){


            };
        };

        

    const setModalText = (emptyPointsArray)=>{

        if(emptyPointsArray.length>0){

            G_fixPanelTitle.textContent = "Sending Ultimatum";
            G_fixPanelContent.textContent = `There are empty Points: these points will automatically filled with "Y".`;
            G_fixPanel.style.display = "flex";

        }else{
            G_fixPanelTitle.textContent = "Sending Ultimatum";
            G_fixPanelContent.textContent = "You cannot change your response after fixing. Wanna Proceed? ";
            G_fixPanel.style.display = "flex";
        }

    };


    const setFixPanel = ()=>{
        G_fixBtn.addEventListener("click",()=>{

            MODAL_EVENT_TARGET.dispatchEvent(new CustomEvent("checkEmptyPoints"));

            // FIX 버튼을 누른 순간(모달이 뜨는 순간) disableInteractives()를 같이 호출해서 화면 조작을 막아두는 게 맞습니다 => 이것만 할까?
            //disableInteractives();
            G_fixPanel.style.display = "flex";
        });

        G_proceedBtn.addEventListener("click",()=>{
            MODAL_EVENT_TARGET.dispatchEvent(new CustomEvent("sendUltimatum"));
            G_fixPanel.style.display = "none";

        });

        G_discardBtn.addEventListener("click",()=>{
            G_fixPanel.style.display = "none";

        });

    };

    const showWarning = (warningDetail)=>{
        console.log(warningDetail); //detail:{"type":"doubleK","message":"You already used your kick Card!"}

        //warning table을 hashmap으로 만들어서 if문을 안 쓰게 해야 한다.
        if(warningDetail.type === "doubleK"){

            G_warningModalTitle.textContent = "Kick Card Violation";

            G_warningModalContent.textContent = "You already used your kick Card!";
        }
        
        G_warningModal.style.display = "block";

    };

    const setInteractives = ()=>{
        
        setPointsInteractive();
        setSelectionInteractive();
        setFixPanel();
    }
    const disableInteractives = ()=>{
        //그냥 위에 모달같은 창을 하나 덮어서 처리한다.
        G_screenBlocker.style.display = "block";
        G_container.inert = true;
    }



    const init = (eventTargets)=>{
        G_container = document.getElementById("G_container"); 
        G_fixBtn = document.getElementById("G_fix");
        G_points = document.querySelectorAll('.G_point');

        G_points.forEach((point)=>{
            if(POINTS_TABLE.has(point.id)){
                POINTS_TABLE.set(point.id,point);
            }
            
        });

        G_tooltip = document.getElementById('G_tooltip');
        G_opntName = document.getElementById('G_opntName');
        G_opntYNKratio = document.getElementById('G_opntYNKratio');

        G_selection = document.getElementById('G_selectionPanel');
        G_YBtn = document.getElementById('G_YBtn');
        G_NBtn = document.getElementById('G_NBtn');
        G_KBtn = document.getElementById('G_KBtn');   
        G_KChecker = undefined;

        G_proceedBtn = document.getElementById('G_proceedBtn');
        G_discardBtn = document.getElementById('G_discardBtn');
        
        G_fixPanel = document.getElementById('G_fixPanel');
        G_fixPanelTitle = document.getElementById('G_fixPanelTitle');
        G_fixPanelContent = document.getElementById('G_fixPanelContent');

        G_warningModal = document.getElementById('G_warningModal');
        G_warningModalTitle = document.getElementById('G_warningModalTitle');
        G_warningModalContent = document.getElementById('G_warningModalContent');
        G_warningBtn = document.getElementById('G_warningBtn');
        
        G_screenBlocker = document.getElementById('G_screenBlocker');
        

        G_myHp = document.getElementById('G_myHp');
        gameToMainBtn = document.getElementById('gameToMainBtn');
        G_isDonut = false;

        SELECTION_EVENT_TARGET = eventTargets.selectionEventTarget;
        MODAL_EVENT_TARGET = eventTargets.modalEventTarget;

        G_coords = {
            "G_point_1": { "x": POINTS_TABLE.get("G_point_1").getBoundingClientRect().left, "y": POINTS_TABLE.get("G_point_1").getBoundingClientRect().top },
            "G_point_2": { "x": POINTS_TABLE.get("G_point_2").getBoundingClientRect().left, "y": POINTS_TABLE.get("G_point_2").getBoundingClientRect().top  },
            "G_point_3": { "x": POINTS_TABLE.get("G_point_3").getBoundingClientRect().left, "y": POINTS_TABLE.get("G_point_3").getBoundingClientRect().top  },
            "G_point_4": { "x": POINTS_TABLE.get("G_point_4").getBoundingClientRect().left, "y": POINTS_TABLE.get("G_point_4").getBoundingClientRect().top  },
            "G_point_5": { "x": POINTS_TABLE.get("G_point_5").getBoundingClientRect().left, "y": POINTS_TABLE.get("G_point_5").getBoundingClientRect().top  },
            "G_userPoint": { "x": POINTS_TABLE.get("G_userPoint").getBoundingClientRect().left, "y": POINTS_TABLE.get("G_userPoint").getBoundingClientRect().top  }
        };

        G_currentPoint = null;

        G_pointData = {
            "G_point_1": { "name": "G_point_1 점 opntName", "YNKratio": "30%", "history":[] },
            "G_point_2": { "name": "G_point_2 점 opntName", "YNKratio": "30%", "history":[] },
            "G_point_3": { "name": "G_point_3 점 opntName", "YNKratio": "30%", "history":[] },
            "G_point_4": { "name": "G_point_4 점 opntName", "YNKratio": "30%", "history":[] },
            "G_point_5": { "name": "G_point_5 점 opntName", "YNKratio": "30%", "history":[] }
        };

        

        gameToMainBtn.addEventListener("click",()=>{
            PAGEROUTER.moveToPage("MAIN");
        });

        setInteractives();        

        G_donutSkin = document.getElementById('G_donutSkin');

        G_donutSkin.addEventListener("click",()=>{
            G_isDonut = !G_isDonut;
            console.log(`isDonut : ${G_isDonut}`);
            if(G_isDonut){
                G_points.forEach((point)=>{
                    point.className = "";  
                    point.classList.add("donut");  
                });
                
            }else{
                G_points.forEach((point)=>{
                    point.className = ""; 
                    point.classList.remove("donut"); 
                    point.classList.add("G_point");  
                });

            }

        });

        G_warningBtn.addEventListener("click",()=>{
            G_warningModal.style.display = "none";
        });               
 
    };


    return{
        init,
        setHexagonCoords,
        updateCoords,
        renderGameRoom,
        setPointsInteractive,
        updateDecision,
        setModalText,
        setFixPanel,
        disableInteractives,
        setInteractives,
        showWarning
    }
}


const GAME_RENDERER = renderGameMode();
export default GAME_RENDERER
