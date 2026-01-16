// View (View.js) - UI만 담당
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

let globalToMainBtn = null;

let G_donutSkin = null;
let G_isDonut = null;
let G_coords = null;
let G_currentPoint = null;
let G_pointData = null;

const renderGlobalMode = ()=>{

    const init = ()=>{
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
            globalToMainBtn = document.getElementById('globalToMainBtn');
            G_isDonut = false;

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

            globalToMainBtn.addEventListener("click",()=>{
                PAGEROUTER.moveToPage("MAIN");
            })

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

            })
    }



    return{

    }
}


const GLOBAL_RENDERER = renderGlobalMode();
export default GLOBAL_RENDERER
