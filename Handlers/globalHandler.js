
//Closure 패턴으로 정리. 
import PAGEROUTER from "../Tools/pageRouter.js";


const createGLOBAL = ()=>{

    //470줄은 너무 많대.
    /**
     * 이 파일을 어떻게 나눌 수 있을까, 이걸 고민해 봐.
     * 
     * fix 등 액션을 선택하고 포인트 애니메이션, 툴팁=> 이건 CSS잖아.
     * 서버와의 통신
     * 
     * 
     */
    let G_fixBtn = null;
    let G_points = null;
    let G_point_1 = null;
    let G_point_2 = null;
    let G_point_3 = null;
    let G_point_4 = null;
    let G_point_5 = null;
    let G_tooltip = null;
    let G_opntName  = null;
    let G_opntYNKratio = null;
    let G_emptyPoints = null;
    let G_selection = null;
    let G_YBtn  = null;
    let G_NBtn = null;
    let G_KBtn = null;
    let G_proceedBtn = null;
    let G_discardBtn = null;
    let G_fixModal = null;

    let G_myHp = null;
    let storage = null;
    let G_coords = null;
    let G_currentPoint = null;
    let G_pointData = null;
    let G_sendInfoToServer = null;
    let G_updateActionsFromStorage = null;
    let globalToMainBtn = null;

    const init = ()=>{
            // 데이터 정의
            G_fixBtn = document.getElementById("G_fix");
            G_points = document.querySelectorAll('.G_point');
            [G_point_1, G_point_2, G_point_3, G_point_4, G_point_5] = G_points;
            G_tooltip = document.getElementById('G_tooltip');
            G_opntName = document.getElementById('G_opntName');
            G_opntYNKratio = document.getElementById('G_opntYNKratio');
            G_emptyPoints = [];
            G_selection = document.getElementById('G_selectionPanel');
            G_YBtn = document.getElementById('G_YBtn');
            G_NBtn = document.getElementById('G_NBtn');
            G_KBtn = document.getElementById('G_KBtn');   

            G_proceedBtn = document.getElementById('G_proceedBtn');
            G_discardBtn = document.getElementById('G_discardBtn');
            G_fixModal = document.getElementById('G_fixModal');
            G_myHp = document.getElementById('G_myHp');
            storage = window.localStorage;
            globalToMainBtn = document.getElementById('globalToMainBtn');

            G_coords = {
                "G_point_1": { "x": G_point_1.getBoundingClientRect().left, "y": G_point_1.getBoundingClientRect().top },
                "G_point_2": { "x": G_point_2.getBoundingClientRect().left, "y": G_point_2.getBoundingClientRect().top  },
                "G_point_3": { "x": G_point_3.getBoundingClientRect().left, "y": G_point_3.getBoundingClientRect().top  },
                "G_point_4": { "x": G_point_4.getBoundingClientRect().left, "y": G_point_4.getBoundingClientRect().top  },
                "G_point_5": { "x": G_point_5.getBoundingClientRect().left, "y": G_point_5.getBoundingClientRect().top  }
            };

            G_currentPoint = null;

            G_pointData = {
                        "G_point_1": { "name": "G_point_1 점 opntName", "YNKratio": "30%", "history":[] },
                        "G_point_2": { "name": "G_point_2 점 opntName", "YNKratio": "30%", "history":[] },
                        "G_point_3": { "name": "G_point_3 점 opntName", "YNKratio": "30%", "history":[] },
                        "G_point_4": { "name": "G_point_4 점 opntName", "YNKratio": "30%", "history":[] },
                        "G_point_5": { "name": "G_point_5 점 opntName", "YNKratio": "30%", "history":[] }
            };

            G_sendInfoToServer = new CustomEvent("actionFixed",{
                bubbles: true, // Allows the event to bubble up the DOM
                cancelable: false,
                detail:storage
                }
            );

            G_updateActionsFromStorage = new CustomEvent("storageUpdated",{
                bubbles:true,
                cancelable: false,
                detail:storage
            });

            globalToMainBtn.addEventListener("click",()=>{
                PAGEROUTER.moveToPage("MAIN");
            })
    };

    const setUserStorage = ()=>{
            storage.clear();
            storage.setItem("name","KH");
            storage.setItem("id","KH_ID");
            storage.setItem("status","not yet");
    };

    const updateActions = ()=>{
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

    const updateCoords = ()=>{
            G_coords.G_point_1.x = G_point_1.getBoundingClientRect().left; 
            G_coords.G_point_1.y = G_point_1.getBoundingClientRect().top; 
                
            G_coords.G_point_2.x = G_point_2.getBoundingClientRect().left;
            G_coords.G_point_2.y = G_point_2.getBoundingClientRect().top;

            G_coords.G_point_3.x = G_point_3.getBoundingClientRect().left;
            G_coords.G_point_3.y = G_point_3.getBoundingClientRect().top;

            G_coords.G_point_4.x = G_point_4.getBoundingClientRect().left;
            G_coords.G_point_4.y = G_point_4.getBoundingClientRect().top;

            G_coords.G_point_5.x = G_point_5.getBoundingClientRect().left;
            G_coords.G_point_5.y = G_point_5.getBoundingClientRect().top;
    };

    const updateTooltipPosition = (x,y) => {
            G_tooltip.style.left = x + 'px';
            G_tooltip.style.top = y + 'px';
    };

    const updateSelectionPosition = ()=>{
            G_selection.style.left = x + 'px';
            G_selection.style.top = y + 'px';
    };

    const updatePositions = ()=>{
        updateCoords();
        let changingX = coords[`${G_currentPoint.id}`].x;
        let changingY = coords[`${G_currentPoint.id}`].y;
                
        let xd = G_currentPoint.getBoundingClientRect().width /0.9; 
        let yd = G_currentPoint.getBoundingClientRect().height /0.9;

        updateSelectionPosition(changingX -36, changingY+yd);
        updateTooltipPosition(changingX+xd, changingY);
    };

    const updatePointData = ()=>{/** 각 point에 매칭된 상대의 정보를 제공.*/
        // 표시할 정보 : userName, YNKratio, history
        // history를 알려면, '나와 매칭된 기록'을 알아야 함.
        //  point 하나를 클릭해둔 상태에서 다른 포인트에 hover - 마우스를 갖다대면 툴팁 사라짐. 

    };

    const updatePositions_Resize = ()=>{
        if(G_currentPoint){
            updatePositions();
        }

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
                
                point.addEventListener("click",(e)=>{
                    const target = point.name ;

                    if( G_currentPoint != null) {

                        if( G_currentPoint === point){
                        // 같은 point를 다시 눌렀을 때 
                        G_currentPoint = null;
                        point.classList.toggle('activated');

                        G_selection.style.display = 'none';
                        G_tooltip.style.display = 'none';

                        }else{
                            // 이전에 클릭했던 point가 있고, 새 point 클릭 시

                            G_currentPoint.classList.toggle('activated');
                            G_currentPoint = point;
                            point.classList.toggle('activated');
                            G_selection.style.display = 'flex';
                            G_tooltip.style.display = 'block';
                            updatePositions();

                        }
                        

                    }else{
                        // 이전에 클릭했던 point가 없고, 새 point 클릭 시

                        point.classList.toggle('activated');
                        G_currentPoint = point;
                        G_selection.style.display = 'flex';
                        G_tooltip.style.display = 'block';
                        updatePositions();
                    };
                    

                });

            });

        };

        const setSelectionInteractive = ()=>{
            G_YBtn.addEventListener("click",()=>{

            storage.setItem(`${currentPoint.id}`, `Y`);

            G_currentPoint.parentElement.classList.remove("kicked");
            G_currentPoint.nextElementSibling.classList.add("picked");
            G_currentPoint.previousElementSibling.classList.remove("picked");
            
            G_currentPoint.classList.remove('activated');
            if(storage.getItem(`${currentPoint.id}`) != undefined){
                currentPoint.classList.add('decided');
            }
            // toggle이 아니라, 데이터를 확인하고 decided 여부 체크해야 함.
            G_currentPoint = null;
            G_tooltip.style.display = 'none';
            G_selection.style.display = 'none';

            

                
            });
            G_NBtn.addEventListener("click",()=>{

                storage.setItem(`${currentPoint.id}`, `N`);

                G_currentPoint.parentElement.classList.remove("kicked");
                G_currentPoint.nextElementSibling.classList.remove("picked");
                G_currentPoint.previousElementSibling.classList.add("picked");

                G_currentPoint.classList.remove('activated');
                if(storage.getItem(`${currentPoint.id}`) != undefined){
                    G_currentPoint.classList.add('decided');
                }
                G_currentPoint = null;
                G_tooltip.style.display = 'none';   
                G_selection.style.display = 'none';

                

            }); 
            G_KBtn.addEventListener("click",()=>{

                storage.setItem(`${G_currentPoint.id}`, `K`);
                G_currentPoint.classList.remove('activated');


                G_currentPoint.parentElement.classList.add("kicked");
                G_currentPoint.nextElementSibling.classList.remove("picked");
                G_currentPoint.previousElementSibling.classList.remove("picked");

                if(storage.getItem(`${G_currentPoint.id}`) != undefined){
                    G_currentPoint.classList.add('decided');

                }
                G_currentPoint = null;
                G_tooltip.style.display = 'none';
                G_selection.style.display = 'none';

                

            });


        };

        const setModalInteractive = ()=>{
            G_proceedBtn.addEventListener("click",()=>{
                const result = {"G_point_1":"Y","G_point_2":"Y","G_point_3":"Y","G_point_4":"Y","G_point_5":"Y"};
                if(storage.getItem("status") === "fixed"){
                    console.log("You already had your chance !");
                    G_fixModal.style.display = "none";

                }else{
                    for(let i=1;i<6;i++){

                    if(storage.getItem(`G_point_${i}`) != undefined){
                        

                        continue
                    }else{
                        
                        storage.setItem(`G_point_${i}`,"Y");

                        G_points[i-1].parentElement.classList.remove("kicked");
                        G_points[i-1].nextElementSibling.classList.add("picked");
                        G_points[i-1].previousElementSibling.classList.remove("picked");
                        G_points[i-1].classList.add("decided");

                    }

                }
                storage.setItem("status","fixed");
                G_fixModal.style.display = "none";
                G_proceedBtn.dispatchEvent(G_sendInfoToServer);

                }
                

            });

            G_discardBtn.addEventListener("click",()=>{
                G_fixModal.style.display = "none";
            });

        };
        const fixActions = ()=>{
            G_fixBtn.addEventListener("click",()=>{
                const checker = ["G_point_1","G_point_2","G_point_3","G_point_4","G_point_5"];
            
                for(const point of checker){
                    if(storage[point] === undefined){
                        emptyPoints.push(point);
                    }
                }

                if(G_emptyPoints.length>0){
                    let empty =  "";
                    for (const mt of G_emptyPoints){
                        empty = empty + `, ${mt}`;
                    }
                    G_fixModal.style.display = "block";


                    console.log(`There are empty Points:${empty.slice(1)}. If you Proceed, these points will automatically filled with "Y". Wanna Proceed?`);
                }else{
                    
                    console.log("You cannot change your response after fixing. Wanna Proceed? ");
                    G_fixModal.style.display = "block";
                }

            });
            
        };

        const storageUpdate = (e)=>{
            for(let i=1;i<6;i++){ // point가 5개가 아닐 수도 있다.
                if(e.detail[`G_point_${i}`]){ // storage에 point별 action이 추가된 경우 업데이트
                    if(e.detail[`point_${i}`] === "Y"){
                        G_points[i-1].parentElement.classList.remove("kicked");
                        G_points[i-1].classList.add(e.detail[`point_${i}`]);
                        G_points[i-1].classList.add("decided");
                        G_points[i-1].previousElementSibling.classList.remove("picked");
                        G_points[i-1].nextElementSibling.classList.add("picked");
                    
                    }else if(e.detail[`G_point_${i}`] === "N"){
                        G_points[i-1].parentElement.classList.remove("kicked");
                        G_points[i-1].classList.add(e.detail[`point_${i}`]);
                        G_points[i-1].classList.add("decided");
                        G_points[i-1].previousElementSibling.classList.add("picked");
                        G_points[i-1].nextElementSibling.classList.remove("picked");

                    }else if(e.detail[`G_point_${i}`] === "K"){
                        G_points[i-1].parentElement.classList.add("kicked");
                        G_points[i-1].classList.add(e.detail[`point_${i}`]);
                        G_points[i-1].classList.add("decided");
                        G_points[i-1].previousElementSibling.classList.remove("picked");
                        G_points[i-1].nextElementSibling.classList.remove("picked");

                    }

                }else{ // showDown이후 storage에 point별 action이 삭제된 경우 업데이트
                    G_points[i-1].parentElement.classList.remove("kicked");
                    G_points[i-1].classList.remove("decided");
                    G_points[i-1].previousElementSibling.classList.remove("picked");
                    G_points[i-1].nextElementSibling.classList.remove("picked");
                };
                
            };
        };


      
    return{
        init,

        setUserStorage,

        updateActions,
        
        updateCoords,
        
        updateTooltipPosition,
        
        updateSelectionPosition,

        updatePositions,
        
        updatePointData,
        
        updatePositions_Resize,

        setPointsInteractive,

        setSelectionInteractive,

        setModalInteractive,

        fixActions,

        storageUpdate
        
    }

}


const GLOBAL = createGLOBAL();
export default GLOBAL


