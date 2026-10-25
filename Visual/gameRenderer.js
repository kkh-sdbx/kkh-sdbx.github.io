
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

    let G_fixModal = null;
    let G_fixModalTitle = null;
    let G_fixModalContent = null;
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
    const setHexagonCoords = ()=>{
        const G_container = document.getElementById("G_container");
        const CONTAINER_HEIGHT = window.getComputedStyle(G_container).height;
        const CONTAINER_WIDTH = window.getComputedStyle(G_container).width;

        const ROOT_THREE = 1.732;
        const a = CONTAINER_HEIGHT/4;
        // ## 모바일이든 어디든...기형적으로 좁거나 넓은 container 형태가 될 수 있다. 그것도 생각해야 함.
        // ## 일단은 진행한다.
        const widthMargin = (CONTAINER_WIDTH-(2*ROOT_THREE*a))/2

        // ## 좌표계 기준이 어떻게 되는지? 일단 화면 최상단이 0,0이었던 것 같다. 그 기준으로 진행함.
        // ## [0,0] +[containerX, containerY]+[pointX,pointY]라 가정함. 
        /**
         * const xx = [1,2];
         * const yy=[10,11]
         * console.log(xx+yy) 하면 1,210,11 나온다.(자바스크립트!!) 실제로는 다른 코드 작성 필요.
         */

        // ## 맨 위 점
        const point1 = [(ROOT_THREE*a),0];

        // ## 좌상단
        const point2 = [widthMargin,a];

        // ## 우상단
        const point3 = [((2*ROOT_THREE*a)-widthMargin),a];

        // ## 좌하단
        const point4 = [widthMargin,(3*a)];

        // ## 우하단
        const point5 = [((2*ROOT_THREE*a)-widthMargin),(3*a)];

        // ## 맨 아래 점(플레이어)
        const point6 = [(ROOT_THREE*a),(4*a)];
        
        // ## entryPoint : console.log(point1~6) 해 보기.

    };

    /**G_Coords 변수에 POINTS_TABLE에 저장된 DOM element 좌표를 업데이트  */
    const updateCoords = ()=>{
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
    };

    const updateTooltipPosition = (x,y)=>{
        G_tooltip.style.left = x + 'px';
        G_tooltip.style.top = y + 'px';
    };

    const updateSelectionPosition = (x,y)=>{
        G_selection.style.left = x + 'px';
        G_selection.style.top = y + 'px';
    };

    const updatePositions = ()=>{
        updateCoords();
        let changingX = G_coords[`${G_currentPoint.id}`].x;
        let changingY = G_coords[`${G_currentPoint.id}`].y;
                
        let xd = G_currentPoint.getBoundingClientRect().width /0.9; 
        let yd = G_currentPoint.getBoundingClientRect().height /0.9;

        updateSelectionPosition(changingX -36, changingY+yd);
        updateTooltipPosition(changingX+xd, changingY);
    };
    const updatePositions_Resize = ()=>{
        if(G_currentPoint){
            updatePositions();
        }

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
                point.addEventListener('mouseenter', function(e) {
                    
                    updateCoords();

                    const target = point.id;
                    const data = G_pointData[`${target}`];


                    G_opntName.textContent = data.name;
                    G_opntYNKratio.textContent = data.YNKratio;
                    G_tooltip.style.display = 'block';
                    
                    let changingX = G_coords[`${target}`].x;
                    let changingY = G_coords[`${target}`].y;
                    
                    let xd = point.getBoundingClientRect().width *1.2/0.9; 
                    let yd = point.getBoundingClientRect().height *1.2/0.9;
                    
                    updateTooltipPosition(changingX+xd, changingY);
                });

                point.addEventListener('mouseleave', function() {
                    //클릭된 상태, 즉 activated 한 상태에서는 마우스가 나가도 툴팁 보여야 하거든#
                    if(point.classList.contains("activated")){
                        
                        G_tooltip.style.display = 'block';

                    }else{
                        
                        G_tooltip.style.display = 'none';
                    }
                    
                });
                
                point.addEventListener("click",(e)=>{ //# 선택된 포인트 다시 클릭하면 'decided'지우고, 선택한 선택지 제거하기 !! #

                    const target = point.id;

                    if( G_currentPoint != null) {

                        if( G_currentPoint === point){                             
                            G_currentPoint = null;
                            point.classList.remove('activated');

                            G_selection.style.display = 'none';
                            G_tooltip.style.display = 'none';

                        }else{ // 이전에 클릭했던 point가 있고, 새 point 클릭 시

                            G_currentPoint.classList.remove('activated');
                            G_currentPoint = point;
                            point.classList.add('activated');
                            G_selection.style.display = 'flex';
                            G_tooltip.style.display = 'block';
                            updatePositions();

                        }

                    }else{ // 이전에 클릭했던 point가 없고, 새 point 클릭 시
                        
                        //point.classList.remove("decided");
                        point.classList.add('activated');
                        G_currentPoint = point;
                        G_selection.style.display = 'flex';
                        G_tooltip.style.display = 'block';
                        updatePositions();
                        
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

                targetPoint.parentElement.classList.remove("kicked");
                targetPoint.nextElementSibling.classList.add("picked");
                targetPoint.previousElementSibling.classList.remove("picked");
                targetPoint.classList.remove('activated');
                targetPoint.classList.add('decided');

                G_tooltip.style.display = 'none';
                G_selection.style.display = 'none';

            }else if(decisionDetail.action === "N"){

                targetPoint.parentElement.classList.remove("kicked");
                targetPoint.nextElementSibling.classList.remove("picked");
                targetPoint.previousElementSibling.classList.add("picked");
                targetPoint.classList.remove('activated');
                targetPoint.classList.add('decided');

                G_tooltip.style.display = 'none';
                G_selection.style.display = 'none';

            }else if(decisionDetail.action === "K"){
                //# K를 누른 포인트에서는,K를 다시 누를 수 없도록 해야 한다.
                G_KChecker = {"target":null}; // : K를 누르면 어느 포인트에서 K를 눌렀는지만 표시해놓고, 
                

                targetPoint.parentElement.classList.add("kicked");
                targetPoint.nextElementSibling.classList.remove("picked");
                targetPoint.previousElementSibling.classList.remove("picked");
                targetPoint.classList.remove('activated');
                targetPoint.classList.add('decided');
                

                G_tooltip.style.display = 'none';
                G_selection.style.display = 'none';

            }else if(decisionDetail.action === null){
                targetPoint.parentElement.classList.remove("kicked");
                targetPoint.nextElementSibling.classList.remove("picked");
                targetPoint.previousElementSibling.classList.remove("picked");
                targetPoint.classList.remove('activated');
                targetPoint.classList.remove('decided');

                G_tooltip.style.display = 'none';
                G_selection.style.display = 'none';

            }
        };

        

    const setModalText = (emptyPointsArray)=>{

        if(emptyPointsArray.length>0){

            G_fixModalTitle.textContent = "Sending Ultimatum";
            G_fixModalContent.textContent = `There are empty Points: these points will automatically filled with "Y".`;
            G_fixModal.style.display = "flex";

        }else{
            G_fixModalTitle.textContent = "Sending Ultimatum";
            G_fixModalContent.textContent = "You cannot change your response after fixing. Wanna Proceed? ";
            G_fixModal.style.display = "flex";
        }

    };


    const setFixModal = ()=>{
        G_fixBtn.addEventListener("click",()=>{

            MODAL_EVENT_TARGET.dispatchEvent(new CustomEvent("checkEmptyPoints"));

            // FIX 버튼을 누른 순간(모달이 뜨는 순간) disableInteractives()를 같이 호출해서 화면 조작을 막아두는 게 맞습니다 => 이것만 할까?
            //disableInteractives();
            G_fixModal.style.display = "flex";
        });

        G_proceedBtn.addEventListener("click",()=>{
            MODAL_EVENT_TARGET.dispatchEvent(new CustomEvent("sendUltimatum"));
            G_fixModal.style.display = "none";

        });

        G_discardBtn.addEventListener("click",()=>{
            G_fixModal.style.display = "none";

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
        setFixModal();
    }
    const disableInteractives = ()=>{
        //그냥 위에 모달같은 창을 하나 덮어서 처리한다.
        G_screenBlocker.style.display = "block";
        G_container.inert = true;
    }



    const init = (eventTarget)=>{
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
        
        G_fixModal = document.getElementById('G_fixModal');
        G_fixModalTitle = document.getElementById('G_fixModalTitle');
        G_fixModalContent = document.getElementById('G_fixModalContent');

        G_warningModal = document.getElementById('G_warningModal');
        G_warningModalTitle = document.getElementById('G_warningModalTitle');
        G_warningModalContent = document.getElementById('G_warningModalContent');
        G_warningBtn = document.getElementById('G_warningBtn');
        
        G_screenBlocker = document.getElementById('G_screenBlocker');
        

        G_myHp = document.getElementById('G_myHp');
        gameToMainBtn = document.getElementById('gameToMainBtn');
        G_isDonut = false;

        SELECTION_EVENT_TARGET = eventTarget.selectionEventTarget;
        MODAL_EVENT_TARGET = eventTarget.modalEventTarget;

        G_coords = {
            "G_point_1": { "x": POINTS_TABLE.get("G_point_1").getBoundingClientRect().left, "y": POINTS_TABLE.get("G_point_1").getBoundingClientRect().top },
            "G_point_2": { "x": POINTS_TABLE.get("G_point_2").getBoundingClientRect().left, "y": POINTS_TABLE.get("G_point_2").getBoundingClientRect().top  },
            "G_point_3": { "x": POINTS_TABLE.get("G_point_3").getBoundingClientRect().left, "y": POINTS_TABLE.get("G_point_3").getBoundingClientRect().top  },
            "G_point_4": { "x": POINTS_TABLE.get("G_point_4").getBoundingClientRect().left, "y": POINTS_TABLE.get("G_point_4").getBoundingClientRect().top  },
            "G_point_5": { "x": POINTS_TABLE.get("G_point_5").getBoundingClientRect().left, "y": POINTS_TABLE.get("G_point_5").getBoundingClientRect().top  }
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

        setHexagonCoords();
    }


    return{
        init,
        updateCoords,
        updateTooltipPosition,
        updateSelectionPosition,
        updatePositions,
        updatePositions_Resize,
        setPointsInteractive,
        updateDecision,
        setModalText,
        setFixModal,
        disableInteractives,
        setInteractives,
        showWarning,
        setHexagonCoords
    }
}


const GAME_RENDERER = renderGameMode();
export default GAME_RENDERER
