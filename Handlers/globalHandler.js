
//Closure 패턴으로 정리. 
import PAGEROUTER from "../Tools/pageRouter.js";

// 컨트롤러로서, View 와 Model 임포트
import GLOBAL_RENDERER from "../Visual/globalRenderer.js";
import GLOBAL_CONNECTION from "../Connection/globalConnection.js";


/**
 * // 3. Controller (Controller.js) - 연결 고리
    import { Model } from './Model.js';
    import { View } from './View.js';
    [Model -> View] 모델의 이벤트를 감지하여 뷰를 업데이트
    // [User -> Model] 사용자 입력을 감지하여 모델 작동
 * 
 */

const VIEW = GLOBAL_RENDERER;
const MODEL = GLOBAL_CONNECTION;


const createGLOBAL = ()=>{

    

    const init = ()=>{
        // 데이터 정의  

        

    

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

    const updatePointData = ()=>{/** 각 point에 매칭된 상대의 정보를 제공.*/
        // 표시할 정보 : userName, YNKratio, history
        // history를 알려면, '나와 매칭된 기록'을 알아야 함.
        //  point 하나를 클릭해둔 상태에서 다른 포인트에 hover - 마우스를 갖다대면 툴팁 사라짐. 

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

    }

}


const GLOBAL = createGLOBAL();
export default GLOBAL


