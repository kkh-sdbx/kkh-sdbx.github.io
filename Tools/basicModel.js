    
//글로벌 모드 4시간마다, 또는 앱 나갔다가 들어올 때 사용할 수 있겠다, storage에서 이전 선택지를 업데이트하는 함수.
/**
 * 
 * @param {NodeList} points - 포인트 요소들의 NodeList
 *  @param {Object} storage - 선택지를 저장한 객체
 */
const updateActions = (pointsNodeList, storage)=>{

    for(let i=1;i<pointsNodeList.length+1;i++){
        if(storage[`point_${i}`]!=undefined){

            //div에, 현재 선택해 놓은 선택지를 로드하는 게 필요하다.

            if(storage[`point_${i}`] === "Y"){
                pointsNodeList[i-1].parentElement.classList.remove("kicked");
                pointsNodeList[i-1].nextElementSibling.classList.add("picked");
                pointsNodeList[i-1].previousElementSibling.classList.remove("picked");
                pointsNodeList[i-1].classList.add('decided');


            }else if(storage[`point_${i}`] === "N"){
                pointsNodeList[i-1].parentElement.classList.remove("kicked");
                pointsNodeList[i-1].nextElementSibling.classList.remove("picked");
                pointsNodeList[i-1].previousElementSibling.classList.add("picked");
                pointsNodeList[i-1].classList.add('decided');


            }else if(storage[`point_${i}`] === "K"){
                pointsNodeList[i-1].parentElement.classList.add("kicked");
                pointsNodeList[i-1].nextElementSibling.classList.remove("picked");
                pointsNodeList[i-1].previousElementSibling.classList.remove("picked");
                pointsNodeList[i-1].classList.add('decided');


            }else{
                console.log(storage[`G_point_${i}`]);
            }
        }


    }

};