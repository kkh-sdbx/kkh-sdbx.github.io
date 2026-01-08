//Closure 패턴으로 정리. 
import PAGEROUTER from "../Tools/pageRouter.js";

const createLOCAL = ()=>{
    let fixBtn
    let points = null;
    let tooltip = null;
    let opntName  = null;
    let opntYNKratio = null;
    let emptyPoints = null;
    let selection = null;
    let YBtn  = null;
    let NBtn = null;
    let KBtn = null;
    let storage = null;
    let coords = null;
    let currentPoint = null;
    let pointData = null;
    let sendInfoToServer = null;
    let updateActionsFromStorage = null;
    let localToMainBtn = null;
      
    return{
        init(){
            // 데이터 정의
            fixBtn = document.getElementById("L_fix");
            points = document.querySelectorAll('.L_point');
            [point_1, point_2, point_3, point_4, point_5] = points;
            tooltip = document.getElementById('L_tooltip');
            opntName = document.getElementById('L_opntName');
            opntYNKratio = document.getElementById('L_opntYNKratio');
            emptyPoints = [];
            selection = document.getElementById('L_selectionPanel');
            YBtn = document.getElementById('L_YBtn');
            NBtn = document.getElementById('L_NBtn');
            KBtn = document.getElementById('L_KBtn');   
            storage = window.Storage;
            localToMainBtn = document.getElementById('localToMainBtn'); 

            coords = {
                "point_1": { "x": point_1.getBoundingClientRect().left, "y": point_1.getBoundingClientRect().top },
                "point_2": { "x": point_2.getBoundingClientRect().left, "y": point_2.getBoundingClientRect().top  },
                "point_3": { "x": point_3.getBoundingClientRect().left, "y": point_3.getBoundingClientRect().top  },
                "point_4": { "x": point_4.getBoundingClientRect().left, "y": point_4.getBoundingClientRect().top  },
                "point_5": { "x": point_5.getBoundingClientRect().left, "y": point_5.getBoundingClientRect().top  }
            };

            currentPoint = null;

            pointData = {
                "point_1": { "name": "point_1 점 opntName", "YNKratio": "30%", "history":[] },
                "point_2": { "name": "point_2 점 opntName", "YNKratio": "30%", "history":[] },
                "point_3": { "name": "point_3 점 opntName", "YNKratio": "30%", "history":[] },
                "point_4": { "name": "point_4 점 opntName", "YNKratio": "30%", "history":[] },
                "point_5": { "name": "point_5 점 opntName", "YNKratio": "30%", "history":[] }
            };

            // 이벤트는 이름이든 뭐든 수정 필요하다.
            sendInfoToServer = new CustomEvent("actionFixed",{
                bubbles: true, // Allows the event to bubble up the DOM
                cancelable: false,
                detail:storage
                }
            );

            updateActionsFromStorage = new CustomEvent("storageUpdated",{
                bubbles:true,
                cancelable: false,
                detail:storage
            });

            localToMainBtn.addEventListener("click",()=>{
                PAGEROUTER.moveToPage("MAIN");
            })
        },
        // 스토리지도 mocking 할 때 제대로, G/L 나누기.
        setUserStorage(){
            storage.clear();
            storage.setItem("name","KH");
            storage.setItem("id","KH_ID");
            storage.setItem("status","not yet");
        },

        updateActions(){
            for(let i=1;i<points.length+1;i++){
                    if(storage[`point_${i}`]!=undefined){
                        
                        //div에, 현재 선택해 놓은 선택지를 로드하는 게 필요하다.

                        if(storage[`point_${i}`] === "Y"){
                            points[i-1].parentElement.classList.remove("kicked");
                            points[i-1].nextElementSibling.classList.add("picked");
                            points[i-1].previousElementSibling.classList.remove("picked");
                            points[i-1].classList.add('decided');


                        }else if(storage[`point_${i}`] === "N"){
                            points[i-1].parentElement.classList.remove("kicked");
                            points[i-1].nextElementSibling.classList.remove("picked");
                            points[i-1].previousElementSibling.classList.add("picked");
                            points[i-1].classList.add('decided');


                        }else if(storage[`point_${i}`] === "K"){
                            points[i-1].parentElement.classList.add("kicked");
                            points[i-1].nextElementSibling.classList.remove("picked");
                            points[i-1].previousElementSibling.classList.remove("picked");
                            points[i-1].classList.add('decided');


                        }else{
                            console.log(storage[`point_${i}`]);
                        }
                    }


                }
        
        },
        
        updateCoords(){
            coords.point_1.x = point_1.getBoundingClientRect().left; 
            coords.point_1.y = point_1.getBoundingClientRect().top; 
                
            coords.point_2.x = point_2.getBoundingClientRect().left;
            coords.point_2.y = point_2.getBoundingClientRect().top;

            coords.point_3.x = point_3.getBoundingClientRect().left;
            coords.point_3.y = point_3.getBoundingClientRect().top;

            coords.point_4.x = point_4.getBoundingClientRect().left;
            coords.point_4.y = point_4.getBoundingClientRect().top;

            coords.point_5.x = point_5.getBoundingClientRect().left;
            coords.point_5.y = point_5.getBoundingClientRect().top;
        },
        
        updateTooltipPosition(x,y) {
            tooltip.style.left = x + 'px';
            tooltip.style.top = y + 'px';
        },
        
        updateSelectionPosition(x, y) {
            selection.style.left = x + 'px';
            selection.style.top = y + 'px';
        },

        
        
        updatePositions(){
            updateCoords();
            let changingX = coords[`${currentPoint.id}`].x;
            let changingY = coords[`${currentPoint.id}`].y;
                    
            let xd = currentPoint.getBoundingClientRect().width /0.9; 
            let yd = currentPoint.getBoundingClientRect().height /0.9;

            updateSelectionPosition(changingX -36, changingY+yd);
            updateTooltipPosition(changingX+xd, changingY);
        },
        
        updatePointData(){ /** 각 point에 매칭된 상대의 정보를 제공.*/
                // 표시할 정보 : userName, YNKratio, history
                // history를 알려면, '나와 매칭된 기록'을 알아야 함.
        },
        
        updatePositions_Resize(){
            if(currentPoint){
                updatePositions();
            }

        },

        setPointsInteractive(){
            //마우스 오버 이벤트 핸들러
            points.forEach(point => {
                point.addEventListener('mouseenter', function(e) {
                    
                    updateCoords();

                    const target = point.id;
                    const data = pointData[`${target}`];


                    opntName.textContent = data.name;
                    opntYNKratio.textContent = data.YNKratio;
                    tooltip.style.display = 'block';
                    
                    let changingX = coords[`${target}`].x;
                    let changingY = coords[`${target}`].y;
                    
                    let xd = point.getBoundingClientRect().width *1.2/0.9; 
                    let yd = point.getBoundingClientRect().height *1.2/0.9;
                    
                    updateTooltipPosition(changingX+xd, changingY);
                });

                point.addEventListener('mouseleave', function() {
                    //클릭된 상태, 즉 activated 한 상태에서는 마우스가 나가도 툴팁 보여야 하거든#
                    if(point.classList.contains("activated")){
                        
                        tooltip.style.display = 'block';

                    }else{
                        
                        tooltip.style.display = 'none';
                    }
                    

                });
                
                point.addEventListener("click",(e)=>{
                    const target = point.name ;

                    if( currentPoint != null) {

                        if( currentPoint === point){
                        // 같은 point를 다시 눌렀을 때 
                        currentPoint = null;
                        point.classList.toggle('activated');

                        selection.style.display = 'none';
                        tooltip.style.display = 'none';

                        }else{
                            // 이전에 클릭했던 point가 있고, 새 point 클릭 시

                            currentPoint.classList.toggle('activated');
                            currentPoint = point;
                            point.classList.toggle('activated');
                            selection.style.display = 'flex';
                            tooltip.style.display = 'block';
                            updatePositions();

                        }
                        

                    }else{
                        // 이전에 클릭했던 point가 없고, 새 point 클릭 시

                        point.classList.toggle('activated');
                        currentPoint = point;
                        selection.style.display = 'flex';
                        tooltip.style.display = 'block';
                        updatePositions();
                    };
                    

                });

            });

        },

        setSelectionInteractive(){
            YBtn.addEventListener("click",()=>{

            storage.setItem(`${currentPoint.id}`, `Y`);

            currentPoint.parentElement.classList.remove("kicked");
            currentPoint.nextElementSibling.classList.add("picked");
            currentPoint.previousElementSibling.classList.remove("picked");
            
            currentPoint.classList.remove('activated');
            if(storage.getItem(`${currentPoint.id}`) != undefined){
                currentPoint.classList.add('decided');
            }
            // toggle이 아니라, 데이터를 확인하고 decided 여부 체크해야 함.
            currentPoint = null;
            tooltip.style.display = 'none';
            selection.style.display = 'none';

            

                
            });
            NBtn.addEventListener("click",()=>{

                storage.setItem(`${currentPoint.id}`, `N`);

                currentPoint.parentElement.classList.remove("kicked");
                currentPoint.nextElementSibling.classList.remove("picked");
                currentPoint.previousElementSibling.classList.add("picked");

                currentPoint.classList.remove('activated');
                if(storage.getItem(`${currentPoint.id}`) != undefined){
                    currentPoint.classList.add('decided');
                }
                currentPoint = null;
                tooltip.style.display = 'none';   
                selection.style.display = 'none';

                

            }); 
            KBtn.addEventListener("click",()=>{

                storage.setItem(`${currentPoint.id}`, `K`);
                currentPoint.classList.remove('activated');


                currentPoint.parentElement.classList.add("kicked");
                currentPoint.nextElementSibling.classList.remove("picked");
                currentPoint.previousElementSibling.classList.remove("picked");

                if(storage.getItem(`${currentPoint.id}`) != undefined){
                    currentPoint.classList.add('decided');

                }
                currentPoint = null;
                tooltip.style.display = 'none';
                selection.style.display = 'none';

                

            });


        },

        setModalInteractive(){
            proceedBtn.addEventListener("click",()=>{
                const result = {"point_1":"Y","point_2":"Y","point_3":"Y","point_4":"Y","point_5":"Y"};
                if(storage.getItem("status") === "fixed"){
                    console.log("You already had your chance !");
                    fixModal.style.display = "none";

                }else{
                    for(let i=1;i<6;i++){

                    if(storage.getItem(`point_${i}`) != undefined){
                        

                        continue
                    }else{
                        
                        storage.setItem(`point_${i}`,"Y");

                        points[i-1].parentElement.classList.remove("kicked");
                        points[i-1].nextElementSibling.classList.add("picked");
                        points[i-1].previousElementSibling.classList.remove("picked");
                        points[i-1].classList.add("decided");

                    }

                }
                storage.setItem("status","fixed");
                fixModal.style.display = "none";
                proceedBtn.dispatchEvent(sendInfoToServer);

                }
                

            });

            discardBtn.addEventListener("click",()=>{
                fixModal.style.display = "none";
            });

        },

        fixActions(){
            fixBtn.addEventListener("click",()=>{
                const checker = ["point_1","point_2","point_3","point_4","point_5"];
            
                for(const point of checker){
                    if(storage[point] === undefined){
                        emptyPoints.push(point);
                    }
                }

                if(emptyPoints.length>0){
                    let empty =  "";
                    for (const mt of emptyPoints){
                        empty = empty + `, ${mt}`;
                    }
                    fixModal.style.display = "block";


                    console.log(`There are empty Points:${empty.slice(1)}. If you Proceed, these points will automatically filled with "Y". Wanna Proceed?`);
                }else{
                    
                    console.log("You cannot change your response after fixing. Wanna Proceed? ");
                    fixModal.style.display = "block";
                }

            });
            
        },
        storageUpdate(e){
            for(let i=1;i<6;i++){ // point가 5개가 아닐 수도 있다.
                if(e.detail[`point_${i}`]){ // storage에 point별 action이 추가된 경우 업데이트
                    if(e.detail[`point_${i}`] === "Y"){
                        points[i-1].parentElement.classList.remove("kicked");
                        points[i-1].classList.add(e.detail[`point_${i}`]);
                        points[i-1].classList.add("decided");
                        points[i-1].previousElementSibling.classList.remove("picked");
                        points[i-1].nextElementSibling.classList.add("picked");
                    
                    }else if(e.detail[`point_${i}`] === "N"){
                        points[i-1].parentElement.classList.remove("kicked");
                        points[i-1].classList.add(e.detail[`point_${i}`]);
                        points[i-1].classList.add("decided");
                        points[i-1].previousElementSibling.classList.add("picked");
                        points[i-1].nextElementSibling.classList.remove("picked");

                    }else if(e.detail[`point_${i}`] === "K"){
                        points[i-1].parentElement.classList.add("kicked");
                        points[i-1].classList.add(e.detail[`point_${i}`]);
                        points[i-1].classList.add("decided");
                        points[i-1].previousElementSibling.classList.remove("picked");
                        points[i-1].nextElementSibling.classList.remove("picked");

                    }

                }else{ // showDown이후 storage에 point별 action이 삭제된 경우 업데이트
                    points[i-1].parentElement.classList.remove("kicked");
                    points[i-1].classList.remove("decided");
                    points[i-1].previousElementSibling.classList.remove("picked");
                    points[i-1].nextElementSibling.classList.remove("picked");
                }
                
            }
        }
    }

}


const LOCAL = createLOCAL();
export default LOCAL


