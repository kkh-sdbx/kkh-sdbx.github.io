// 데이터 정의
const fixBtn = document.getElementById("fix");
const points = document.querySelectorAll('.point');
const[point_1, point_2, point_3, point_4, point_5] = points;
const tooltip = document.getElementById('global-tooltip');
const opntName = document.getElementById('opntName');
const opntYNKratio = document.getElementById('opntYNKratio');
const emptyPoints = [];
const selection = document.getElementById('selectionPanel');
const YBtn = document.getElementById('YBtn');
const NBtn = document.getElementById('NBtn');
const KBtn = document.getElementById('KBtn');   
const storage = window.localStorage;
const coords = {
    "point_1": { "x": point_1.getBoundingClientRect().left, "y": point_1.getBoundingClientRect().top },
    "point_2": { "x": point_2.getBoundingClientRect().left, "y": point_2.getBoundingClientRect().top  },
    "point_3": { "x": point_3.getBoundingClientRect().left, "y": point_3.getBoundingClientRect().top  },
    "point_4": { "x": point_4.getBoundingClientRect().left, "y": point_4.getBoundingClientRect().top  },
    "point_5": { "x": point_5.getBoundingClientRect().left, "y": point_5.getBoundingClientRect().top  }
};

let currentPoint = null;

 const pointData = {
            "point_1": { "name": "point_1 점 opntName", "YNKratio": "30%", "history":[] },
            "point_2": { "name": "point_2 점 opntName", "YNKratio": "30%", "history":[] },
            "point_3": { "name": "point_3 점 opntName", "YNKratio": "30%", "history":[] },
            "point_4": { "name": "point_4 점 opntName", "YNKratio": "30%", "history":[] },
            "point_5": { "name": "point_5 점 opntName", "YNKratio": "30%", "history":[] }
};


const GLOBAL = {
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
        global.updateCoords();
        let changingX = coords[`${currentPoint.id}`].x;
        let changingY = coords[`${currentPoint.id}`].y;
                
        let xd = currentPoint.getBoundingClientRect().width /0.9; 
        let yd = currentPoint.getBoundingClientRect().height /0.9;

        global.updateSelectionPosition(changingX -36, changingY+yd);
        global.updateTooltipPosition(changingX+xd, changingY);
    },
    
    updatePointData(){ /** 각 point에 매칭된 상대의 정보를 제공.*/
            // 표시할 정보 : userName, YNKratio, history
            // history를 알려면, '나와 매칭된 기록'을 알아야 함.
    }
    




}



export default GLOBAL


