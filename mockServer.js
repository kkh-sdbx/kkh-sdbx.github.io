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

 
    let currentIndex = matchMakingPool.length -1;
    let randomIndex;
    for( let i= currentIndex; i>0; i--){
        randomIndex = Math.floor(Math.random()*(i+1));
        console.log(`i:${i}, randomIndex:${randomIndex}`);
        [ matchMakingPool[i], matchMakingPool[randomIndex] ] = [ matchMakingPool[randomIndex], matchMakingPool[i] ];
    }
    console.log("matchMakingPool : ", matchMakingPool);
    




    // 2. array.forEach(=> i=0부터 array[i][j]와  array[i+1][j], array[i+2][j]..로 빈 칸을 찾아나가고, 슬롯 하나씩 이어 나감)
    console.log("Phase2 starts - matchMakingPool: ", matchMakingPool);



    // 3. matchMakingPool, matchOrder가 됐으니, matchMakingPool[matchOrder[0]] && matchMakingPool[matchOrder[1]]
    
    for(let s=0; s<matchOrder.length;s++){
        let startIndex = matchOrder[s];
        console.log("startIndex : ", startIndex);
        // matchMakingPool[startIndex] === {name: 'dummy1', emptySlots: ['point_1', 'point_2', 'point_3', 'point_4', 'point_5']};
        let startUser = matchMakingPool[startIndex]
        console.log("startUser : ", startUser);
        let startEmptySlots = startUser.emptySlots; // ['point_1', 'point_2', 'point_3', 'point_4', 'point_5']
        //# startUser의 length가 0인 경우 체크 필요.

        let endPoints = [];

        for(let t=1; t < startEmptySlots.length+1;t++){
            let nextUser = matchMakingPool[matchOrder[s+t]]; // {name: 'dummy2', emptySlots: ['point_1', 'point_2', 'point_3', 'point_4', 'point_5']};
            //#### 이때 name이 아니라 고유값, ID여야 한다. 이거 되게 헷갈리네.
            console.log("nextUser: ",nextUser);
            let nextSlots = nextUser.emptySlots // ['point_1', 'point_2', 'point_3', 'point_4', 'point_5']

            if(nextSlots.length > 0){
                let toFill = nextSlots[Math.floor(Math.random()*nextSlots.length)]; // 'point_3'
                // #length로 핸들링을 할 거면, slice를 쳐서 하나를 제거하고 
                // 원본 User의 데이터를 수정해줘야 한다.

                let nextUserData = ALLUSERS.get(nextUser.name).points; //new Map([["point_1",null],["point_2",null],["point_3",null],["point_4",null],["point_5",null]]);

                nextUserData.set();
                // ALLUSERS.get(nextUser.name).points.set("point_5","nextUserName"); 이런 식으로 수정 하는게 맞다. 지금은 머리아프니 나중에 코드 짜넣자.




            }else{
                continue
            }
            
            endPoints.push()
        }
        // #남은 emptyPoint를 다 밀어넣어도 startEmptySlots.length보다 작은 경우 예외처리.
        


        // 이 두 array를 섞을 필요가 있는가? => 엄밀히 말하면 그렇지.
        // 그런데 그건 너무 복잡해질 것 같은데.

        // 어? 포인트 하나에는 유저 하나잖아.
        // startIndex의 빈칸 개수만큼 start+1,start+2...start+empty 를 하고 각 빈칸에 startEmptySlots의 빈칸을 하나씩 밀어넣어야 해.

        // 
        
        



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













