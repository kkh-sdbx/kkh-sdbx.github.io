console.log("mock server");
console.log(storage);

const ALLUSERS = new Map();
const setDummyActions = document.getElementById("setDummyActions");
const startMatchMaking = document.getElementById("startMatchMaking");

setDummyActions.addEventListener("click",()=>{
    ALLUSERS.forEach(( userInfo, userName )=>{
        if(userInfo.userType === "dummy"){
            setRandomActions(userInfo);
        }
        
    });
    console.log("actions Set:", ALLUSERS);
    // dummy user만 세팅하는 버튼이라서, 이 버튼을 눌러두고 fix해야 한다. 일단 지금은 이렇게 가.
    // Kick의 갯수가 정해져 있다면서? 그건 어떻게 체크할거임? 클라이언트 변조 가능성이 있잖아.

});

startMatchMaking.addEventListener("click",()=>{
    //1. 일단은, 모두 Y인 곳에서
    matchMaking(ALLUSERS);

});


function matchMaking(userPool){
    console.log("Phase1 starts - matchMaking started, Pool is:  ", userPool);
    const matchMakingPool = [];
    const matchOrder = [];

    // 1. playerId - emptySlots 형태의 object 구조로 array 배열.

    for(const userInfo of userPool){
        // user === ["dummy1", User]
        let result = {"name":userInfo[0],"emptySlots":[]}; // "dummy1"
        let currentPointStatus = userInfo[1].points //Map 형태로 저장된 point_1 ~ point_5
        for(const point of currentPointStatus){
            if (point[1]){
                continue
            }else{
                result.emptySlots.push(point[0]);

            }

        }
        console.log(result);  
        matchMakingPool.push(result);

    }

    //2. random array Shuffle.
 
    let currentIndex = matchMakingPool.length -1;
    let randomIndex;
    for( let i= currentIndex; i>0; i--){
        randomIndex = Math.floor(Math.random()*(i+1));
        console.log(`i:${i}, randomIndex:${randomIndex}`);
        [ matchMakingPool[i], matchMakingPool[randomIndex] ] = [ matchMakingPool[randomIndex], matchMakingPool[i] ];
    }
    console.log("Phase 2 completed - matchMakingPool : ", matchMakingPool);
    

    // ##3. matchMakingPool, matchOrder가 됐으니, matchMakingPool[matchOrder[0]] && matchMakingPool[matchOrder[1]]

    // matchMaking Pool에는 빈칸들만 들고 오기 때문에, 유효한 접근이라 판단함.
    // {15} 16 17 18 19 20 length ===20, index = m = 14  length-m = 6.
    
    for (let m = 0; m < matchMakingPool.length; m++){

        let start = matchMakingPool[m]; // {name: 'dummy20', emptySlots: ['point_1', 'point_2', 'point_3', 'point_4', 'point_5']}
        let startIndex = start.emptySlots.findIndex(pt =>{return pt != null} ); // 0

        if(startEmptySlots.length < (matchMakingPool.length - m - 1)){  // 비둘기집 원리. 

            // 3-1. 빈 칸 수만큼 뒷 유저들 끌어옴.
            for(let n=1; n <startEmptySlots.length+1 ; n++){
                let end = matchMakingPool[m+n]; // {name: 'dummy20', emptySlots: ['point_1', 'point_2', 'point_3', 'point_4', 'point_5']}

                //3-1-1. 마지막 포인트 찾기.
                let endIndex = end.emptySlots.length - 1;
                while(true){
                    if(end.emptySlots[endIndex] != null){
                        break
                    }else{
                        endIndex -= 1;
                    }
                }
                let startPoint = start[startIndex]; //"point_1"
                let endPoint = end.emptySlots[endIndex]; //"point_5"


                // 3-2. matchMakingPool과 ALLUSERS 데이터 수정.

                // 3-2-1. ALLUSERS 수정

                //매치메이킹 데이터에서 null로 수정
                matchMakingPool[m].emptySlots[startIndex] = null; 

                // ALLUSERS start point 수정 => end.name
                userPool.get(start.name).points.set(startPoint, end.name);

                // ALLUSERS end point 수정 => start.name
                userPool.get(end.name).points.set(endPoint, start.name);
                
                console.log("start:",userPool.get(start.name).points);
                console.log("end:",userPool.get(end.name).points);

            }

            // 3-2.ALLUSERS 데이터를 수정해 줘야 한다.


        }else{ // 중단조건, startUser의 빈칸 개수보다 남은 user 수가 같거나 적으면
            console.log(`not enough slots! m:${m} `);
            break
        }

    }


    // 일단 빈 칸들 확인




}

class User{
    constructor(userNum, type){
        this.name = `user${userNum}`;
        this.kickTickets = 3;
        this.points = new Map([["point_1",null],["point_2",null],["point_3",null],["point_4",null],["point_5",null]]);
        this.actions = new Map([["point_1","Y"],["point_2","Y"],["point_3","Y"],["point_4","Y"],["point_5","Y"]]);
        this.userType = type;
    }
    YES(pointNum){
        this.actions.set(`point_${pointNum}`,"Y");        
    }
    NO(pointNum){
        this.actions.set(`point_${pointNum}`,"N");
    }
    KICK(pointNum){
        this.actions.set(`point_${pointNum}`,"K");
    }
    setId(userId){
        this.id = userId;
    }

}

document.addEventListener("actionFixed",(e)=>{

    // add New User(client)
    console.log(e);
    const activePoints = 5;
    let userNo= ALLUSERS.size;
    let newbie = new User(userNo, "player");
    newbie.setId(e.detail.clientX);
    for(let i=1; i<activePoints+1 ;i++){ // point가 5개가 아닐 수도 있다.
        newbie.actions.set(`point_${i}`,e.detail[`point_${i}`]);
    }
    ALLUSERS.set(userNo, newbie);
    console.log(ALLUSERS);

    //matchMaking
    matchMaking(ALLUSERS);
});

function pushDummyUsers(dummies){
    for(let i=1;i<dummies+1;i++){
        let dummy = new User(i, "dummy"); // 1,3,5,7,9...가 되는데 왜지?
        let dummyId = `dummy${i}`;
        dummy.setId(dummyId);
        ALLUSERS.set(`dummy${i}`, dummy);    
    }
}
pushDummyUsers(21);

function setRandomActions(dummyUser){
    // User.YES NO KICK 3개의 메소드가 있다.
    const actionPool = ["YES","NO","KICK"];
    let todo = actionPool[Math.floor(Math.random()*3)];
    for(let i=1; i<6; i++){
        dummyUser[todo](i);
        todo = actionPool[Math.floor(Math.random()*3)];
    }    

}







// # Proceed, Discard 시의 행동과
// ## 
// ### 
// #### 
// ##### Modal 텍스트 등 레이아웃 => 이건 나중에!
// 













