
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
    /*
        작성하신 코드 상에서 계산된 x, y 좌표가 로그에 완벽히 대칭(동일)으로 찍히는데도 불구하고, 화면에서 좌측 점들(point2, point4)이 우측 점들(point3, point5)보다 위로 치우쳐 보인다면, 이는 자바스크립트의 좌표 계산식 문제가 아니라 CSS 레이아웃 및 렌더링 영역 설정의 문제일 확률이 매우 높습니다.
    좌상단/좌하단이 우상단/우하단보다 높게 배치되는 가장 유력한 원인 4가지를 정리해 드립니다.

    1. CONTAINER 요소들의 transform-origin 또는 transform 속성 유무

    각 점을 담고 있는 ${name}_Container 엘리먼트 내부나 공통 클래스에 transform: translate(-50%, -50%) 같은 스타일이 적용되어 있는지 확인해 보세요.
    • 만약 좌측 점들과 우측 점들의 내부 콘텐츠 크기(텍스트 길이, 이미지 유무 등)가 미세하게 다르다면, 중심점을 맞추기 위한 transform이나 translate 속성이 작동할 때 높이가 다르게 정렬될 수 있습니다.

    2. position: absolute 기준점과 display: inline-block 등의 영향

    점들을 배치할 때 top과 left를 사용하신 것으로 보아 position: absolute;나 fixed를 사용 중이실 겁니다.
    • 원인: 만약 부모 요소에 position: relative;가 누락되었거나, 점 엘리먼트 자체의 display 속성이 block이나 absolute가 아닌 inline-block 상태에서 미세한 문자열 공백(whitespace)의 영향을 받으면 baseline 기준으로 정렬되면서 수직 위치가 틀어질 수 있습니다.
    • 해당 요소의 CSS에 아래 속성이 누락되었는지 확인하세요:css
    /* 점들을 감싸는 개별 컨테이너 스타일 
    [id$="_Container"] {
        position: absolute;
        /* 기준점을 왼쪽 위 꼭짓점으로 통일 (만약 중심점 기준이라면 모두 동일한 width/height 필수) 
        box-sizing: border-box; 
    }
    코드를 사용할 때는 주의가 필요합니다.

    3. 좌/우 컨테이너의 내부 콘텐츠 크기(너비/높이) 차이

    로그의 changedTop 값이 같더라도, 왼쪽 컨테이너와 오른쪽 컨테이너의 실제 height가 다르면 화면에서는 위치가 달라 보입니다.
    • 예를 들어, "G_point_2_Container" 내부의 글자나 패딩 때문에 높이가 30px이고, "G_point_3_Container"는 40px라면, top 값이 같아도 밑으로 내려오는 범위가 달라 정렬이 깨져 보입니다.
    • 해당 요소들의 height와 width가 고정값(예: width: 20px; height: 20px;)으로 완전히 동일한지 개발자 도구(F12)로 inspect 해보세요.

    4. widthMargin 계산 시 point1과 userPoint (맨 위/아래 점)의 X 좌표 오류

    작성하신 코드에서 정육각형(또는 대칭 육각형)을 그릴 때 point1과 userPoint의 x 좌표 계산식을 보시면 widthMargin이 반영되어 있지 않습니다.
    • 현재 코드: "x": (ROOT_THREE * a)
    • 올바른 대칭 코드: "x": widthMargin + (ROOT_THREE * a)
    이로 인해 육각형 전체의 중심축이 왼쪽으로 치우치거나 찌그러지면서, 브라우저가 유연한(Flex/Grid) 레이아웃 속에서 주변 요소들을 밀어내어 좌우 높낮이가 뒤틀리는 현상이 연쇄적으로 발생할 수 있습니다.

    💡 추천하는 디버깅 및 해결 단계

    1. 개발자 도구(F12) 확인: 화면에서 위치가 다른 두 점(G_point_2_Container와 G_point_3_Container)을 번갈아 클릭해 보시고, 컴퓨터가 계산한 스타일(Computed) 탭에서 height, padding, margin, border가 완전히 일치하는지 최우선으로 확인하세요.
    2. 좌표축의 기준점 일치: 각 점 컨테이너의 CSS에 transform: none;을 주고 position: absolute;가 제대로 잡혀있는지 확인하세요.
    만약 위의 방법으로도 해결되지 않는다면 아래 내용을 공유해 주세요. 문제를 바로 잡아 드릴게요!
    • 각 점 컨테이너(${name}_Container)에 적용되어 있는 CSS 스타일 코드
    • 육각형 점 내부에 텍스트나 아이콘 같은 콘텐츠가 들어가는지 여부

    */
        const G_container = document.getElementById("G_container");
        const CONTAINER_HEIGHT = parseInt(window.getComputedStyle(G_container).height.split("px")[0]);
        const CONTAINER_WIDTH = parseInt(window.getComputedStyle(G_container).width.split("px")[0]);

        const CONTAINER_X = G_container.getBoundingClientRect().left;
        const CONTAINER_Y = G_container.getBoundingClientRect().top;

        const ROOT_THREE = 1.732;
        const a = CONTAINER_HEIGHT/4;
        // ## 모바일이든 어디든...기형적으로 좁거나 넓은 container 형태가 될 수 있다. 그것도 생각해야 함.
        // ## 일단은 진행한다.
        const widthMargin = (CONTAINER_WIDTH-(2*ROOT_THREE*a))/2;
        console.log(
            "CONTAINER_HEIGHT: ",CONTAINER_HEIGHT,
            "CONTAINER_WIDTH: ",CONTAINER_WIDTH,
            "CONTAINER_X: ",CONTAINER_X,
            "CONTAINER_Y: ",CONTAINER_Y,
            "a: ",a,
            "widthMargin: ",widthMargin
        );



        // ## 좌표계 기준이 어떻게 되는지? 일단 화면 최상단이 0,0이었던 것 같다. 그 기준으로 진행함.
        // ## [0,0] +[containerX, containerY]+[pointX,pointY]라 가정함. 
        /**
         * const xx = [1,2];
         * const yy=[10,11]
         * console.log(xx+yy) 하면 1,210,11 나온다.(자바스크립트!!) 실제로는 다른 코드 작성 필요.
         */

        // ## 맨 위 점
        const point1 = {"name":"point1", "x":(ROOT_THREE*a),"y":0};

        // ## 좌상단
        const point2 = {"name":"point2", "x":widthMargin,"y":a};

        // ## 우상단
        const point3 = {"name":"point3", "x":(CONTAINER_WIDTH-widthMargin),"y":a};

        // ## 좌하단
        const point4 = {"name":"point4", "x":widthMargin,"y":(3*a)};

        // ## 우하단
        const point5 = {"name":"point5", "x":(CONTAINER_WIDTH-widthMargin),"y":(3*a)};

        // ## 맨 아래 점(플레이어)
        const userPoint = {"name":"point6", "x":(ROOT_THREE*a),"y":(4*a)};
        

        const hexCoords = {
            "G_point_1":point1,
            "G_point_2":point2,
            "G_point_3":point3,
            "G_point_4":point4,
            "G_point_5":point5,
            "G_userPoint":userPoint
        };

        console.log("hexCoords: ",hexCoords);
        
        //POINTS_TABLE 에 hexCoords 추가
        POINTS_TABLE.forEach((point,name)=>{ 
            //getBoundingClientRect().left는 숫자로 나온다.

            const CONTAINER = document.getElementById(`${name}_Container`);

            // point의 수정된 좌표 계산
            const changedLeft = hexCoords[name].x;
            const changedTop = hexCoords[name].y;

            // point의 stlye 수정해서 육각형 만들기
            CONTAINER.style.left = `${changedLeft}px`;
            CONTAINER.style.top = `${changedTop}px`;
            
           console.log(name, "left",changedLeft,"top",changedTop);
            
        });
        
        // ## entryPoint : 얼추 육각형은 나오는데, 정육각형은 아니다. widthMargin과 G_Container내에 있지 않은 문제. 
        
        // 화면 상 좌표와...계산된 css 스타일의 차이인 것 같다. getBoundingClientRect와 getComputedStyle()의 차이인 듯.
        // getBoundingClientRect를 모두  getComputedStyle()로 수정해 보고 렌더링하기.
    };

    /**계산된 육각형 좌표를 POINTS_TABLE에 저장된 DOM element 좌표에 업데이트  */
    const updateCoords = ()=>{

        const G_container = document.getElementById("G_container");

        // G_Coords에 수정된 좌표 업데이트
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


                    //G_opntName.textContent = data.name;
                    //G_opntYNKratio.textContent = data.YNKratio;
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
