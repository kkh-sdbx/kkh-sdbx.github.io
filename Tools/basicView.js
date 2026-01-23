const BASIC_VIEW = ()=>{
    /**
    @params {point} : 형태가 바뀌는, 실제 클릭 가능한 포인트 element
    */
    const setPointClick = (point)=>{
        const target = point.id;
        if(currentPoint){ // 이미 activated 된 포인트가 있는 경우 (activated 한 번 더 누르기 || 다른 포인트 누르기)

            if(currentPoint.id === target){

                // 초기화 이후 채우기 패턴.
                // # point.classList.remove("decided"); => 이 코드의 삭제 여부 검토. 사용자가 decided 포인트를 클릭 -> action 수정하지 않고 다른 포인트 클릭 => 문제가 될수도.
                // # 아닌가? decided는 selection이 관리하나? 지금 상태 안 좋으니 놔둔다.
                
                point.classList.remove("decided");
                currentPoint = null;
                point.classList.remove('activated');

                // selection과 tooltip 관련 함수는 분리하자. => 이 결정도 검토. 굳이 분리할 필요가 있을까?
                /*
                selection.style.display = 'none';
                tooltip.style.display = 'none';
                */

            }else{ // 이전에 클릭했던 point가 있고, 새 point 클릭 시

                // 이전 point의 activated 지우기
                currentPoint.classList.remove('activated');

                // 초기화 후 채우기 패턴
                point.classList.remove("decided");
                point.classList.add('activated');
                selection.style.display = 'flex';
                tooltip.style.display = 'block';
                updatePositions();

            }

        }else{ // currentPoint가 없는 경우 (activated 된 포인트 없고 새로 누르기)

            // 
            point.classList.remove("decided");
            point.classList.add('activated');
            currentPoint = point;
            selection.style.display = 'flex';
            tooltip.style.display = 'block';
            updatePositions();

        }

    }

    /**
     * point들의 좌표를 저장하는 함수.
     * @param{Object} coordsTable: 각 mode별로 세팅된 Object 형태의 coords
     * @param{NodeList} pointsNodeList: querySelectorAll로 불러온 point의 NodeList
     */
    const updateCoords = (coordsTable, pointsNodeList)=>{
        pointsNodeList.forEach((point)=>{
            coordsTable[point.id].x = point.getBoundingClientRect().left; 
            coordsTable[point.id].y = point.getBoundingClientRect().top; 
        });

    };

    /**
     * 툴팁(point 옆에 나오는 상대 정보)의 위치를 업데이트하는 함수    
     * @param{number} x,y=> 좌표값
     */
    const updateTooltipPosition = (tooltip, x,y)=>{
        tooltip.style.left = x + 'px';
        tooltip.style.top = y + 'px';
    };

    /**
     * Selection(point 아래에 N/Y/K 버튼 패널)의 위치를 업데이트하는 함수
     * @param{element} selection => id = 'selection-panel' element
     * @param{number} x,y=> 좌표값
     */
    const updateSelectionPosition = (selection,x,y)=>{
        selection.style.left = x + 'px';
        selection.style.top = y + 'px';
    };

    /**
     * 업데이트된 coordsTable 바탕으로, 툴팁과 Selection의 정확한 위치를 잡는 함수
     * @param {Object} coordsTable  : 
     * @param {Element} targetPoint : point_N Element
     */
    const updatePositions = (coordsTable, targetPoint)=>{
        updateCoords();
        let changingX = coordsTable[targetPoint.id].x;
        let changingY = coordsTable[targetPoint.id].y;
                
        let xd = targetPoint.getBoundingClientRect().width /0.9; 
        let yd = targetPoint.getBoundingClientRect().height /0.9;

        updateSelectionPosition(changingX -36, changingY+yd);
        updateTooltipPosition(changingX+xd, changingY);
    };
    const updatePositions_Resize = ()=>{
        if(G_currentPoint){
            updatePositions();
        }

    };

    return{
        setPointClick
    }
}