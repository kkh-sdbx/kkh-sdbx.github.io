
import PAGEROUTER from "../Tools/pageRouter.js";

const renderGlobalMode = ()=>{
    // View (View.js) - UI만 담당
    let G_fixBtn = null;
    let G_points = null;

    let POINTS_TABLE = new Map([
        ["G_point_1",null],
        ["G_point_2",null],
        ["G_point_3",null],
        ["G_point_4",null],
        ["G_point_5",null]
    ]);

    let G_tooltip = null;
    let G_opntName  = null;
    let G_opntYNKratio = null;

    let G_selection = null;
    let G_YBtn  = null;
    let G_NBtn = null;
    let G_KBtn = null;
    let G_proceedBtn = null;
    let G_discardBtn = null;
    let G_fixModal = null;

    let G_myHp = null;

    let globalToMainBtn = null;

    let G_coords = null;
    let G_currentPoint = null;
    let G_pointData = null;

    let G_donutSkin = null;
    let G_isDonut = null;



    let ACTION_FIXED_EVENT = null;


   
    let SELECTION_EVENT_TARGET = null;
    let MODAL_EVENT_TARGET = null;    





    
    const updateCoords = ()=>{
        console.log("updateCoords at View called");
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

            SELECTION_EVENT_TARGET.dispatchEvent(new CustomEvent("actionDecided",{
            bubbles: false,
            cancelable: false,
            detail:{"target":G_currentPoint.id, "action":"Y"}

        }));
        });
        G_NBtn.addEventListener("click",()=>{
            if(!G_currentPoint) {return};
          
            SELECTION_EVENT_TARGET.dispatchEvent(new CustomEvent("actionDecided",{
            bubbles: false,
            cancelable: false,
            detail:{"target":G_currentPoint.id, "action":"N"}

        }));
        });
        G_KBtn.addEventListener("click",()=>{
            if(!G_currentPoint) {return};

            SELECTION_EVENT_TARGET.dispatchEvent(new CustomEvent("actionDecided",{
            bubbles: false,
            cancelable: false,
            detail:{"target":G_currentPoint.id, "action":"K"}

        }));
            
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
                    // globalRenderer : click event listened !!

                    if( G_currentPoint != null) {

                        if( G_currentPoint === point){ // 같은 point를 다시 눌렀을 때 
                            point.classList.remove("decided");                            
                            G_currentPoint = null;
                            point.classList.remove('activated');

                            G_selection.style.display = 'none';
                            G_tooltip.style.display = 'none';

                        }else{ // 이전에 클릭했던 point가 있고, 새 point 클릭 시

                            G_currentPoint.classList.remove('activated');
                            G_currentPoint = point;
                            point.classList.remove("decided");
                            point.classList.add('activated');
                            G_selection.style.display = 'flex';
                            G_tooltip.style.display = 'block';
                            updatePositions();

                        }

                    }else{ // 이전에 클릭했던 point가 없고, 새 point 클릭 시
                        
                        point.classList.remove("decided");
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

            console.log(decisionDetail);
            // DECISION_DETAIL = {"target":G_currentPoint.id, "action":G_currentPoint.dataset.btnType };
            let targetPoint = POINTS_TABLE.get(decisionDetail.target);
            console.log("POINTS_TABLE: ", POINTS_TABLE, "targetPoint: ",targetPoint);

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

        

    const setModalText = (ultimatum)=>{

        if(ultimatum.emptyPoints.length>0){
            console.log(`There are empty Points: these points will automatically filled with "Y".`);
            G_fixModal.style.display = "block";

        }else{
            console.log("You cannot change your response after fixing. Wanna Proceed? ");
            G_fixModal.style.display = "block";
        }

    };


    const setFixModal = ()=>{
        G_fixBtn.addEventListener("click",()=>{
            
            MODAL_EVENT_TARGET.dispatchEvent(new CustomEvent("actionFixed"));
            G_fixModal.style.display = "block";
        });

        G_proceedBtn.addEventListener("click",()=>{
            MODAL_EVENT_TARGET.dispatchEvent(new CustomEvent("sendUltimatum"));
            G_fixModal.style.display = "none";

        });

        G_discardBtn.addEventListener("click",()=>{
            G_fixModal.style.display = "none";

        });

    };


    const init = (eventTarget)=>{

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

        G_proceedBtn = document.getElementById('G_proceedBtn');
        G_discardBtn = document.getElementById('G_discardBtn');
        G_fixModal = document.getElementById('G_fixModal');
        G_myHp = document.getElementById('G_myHp');
        globalToMainBtn = document.getElementById('globalToMainBtn');
        G_isDonut = false;


        SELECTION_EVENT_TARGET = eventTarget.selectionEventTarget;
        MODAL_EVENT_TARGET = eventTarget.modalEventTarget;

        ACTION_FIXED_EVENT = new CustomEvent("actionFixed",{ 
            bubbles: false, 
            cancelable: false
        });



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

        

        globalToMainBtn.addEventListener("click",()=>{
            PAGEROUTER.moveToPage("MAIN");
        });
        
        setPointsInteractive();
        setSelectionInteractive();
        setFixModal();
        

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
        setFixModal

    }
}


const GLOBAL_RENDERER = renderGlobalMode();
export default GLOBAL_RENDERER
