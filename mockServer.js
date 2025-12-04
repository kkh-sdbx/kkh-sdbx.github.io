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

    // 0. matchOrder에 index 넣음
    for(let i=0; i<userPool.size; i++){
        matchOrder.push(i);
    }
    console.log(matchOrder);
    

    // 1. playerId - emptySlots 형태의 object 구조로 array 배열

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


    // 2. array.forEach(=> i=0부터 array[i][j]와  array[i+1][j], array[i+2][j]..로 빈 칸을 찾아나가고, 슬롯 하나씩 이어 나감)
    console.log("Phase2 starts - matchMakingPool: ", matchMakingPool);

    // 2-1. 랜덤 셔플
    let currentIndex = matchOrder.length;
    let randomIndex;
    


    // 3. 


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
pushDummyUsers(20);

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













