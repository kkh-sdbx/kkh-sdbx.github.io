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
    const leftUsers = [];

    // 1. playerId - emptySlots 형태의 object 구조로 array 배열.

    for(const userInfo of userPool){
        // user === ["dummy1", User]
        let result = {"name":userInfo[0],"emptySlots":[], "ref":userInfo[1].points}; // "dummy1"
        let currentPointStatus = result.ref; //Map 형태로 저장된 point_1 ~ point_5
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
    

    // matchMaking Pool에는 빈칸들만 들고 오기 때문에, 유효한 접근이라 판단함.
    // {15} 16 17 18 19 20 length ===20, index = m = 14  length-m = 6.
    
    for (let m = 0; m < matchMakingPool.length; m++){

        let start = matchMakingPool[m]; // {name: 'dummy20', emptySlots: ['point_1', 'point_2', 'point_3', 'point_4', 'point_5']}
        const matchingTimes = start.emptySlots.length;
        if(start.emptySlots.length < (matchMakingPool.length - m - 1)){  // 비둘기집 원리. 

            // 3-1. 빈 칸 수만큼 뒷 유저들 끌어옴.
            for(let n=1; n <matchingTimes+1 ; n++){
                start = matchMakingPool[m]
                let end = matchMakingPool[m+n]; // {name: 'dummy20', emptySlots: ['point_1', 'point_2', 'point_3', 'point_4', 'point_5']}

                let startPoint = start.emptySlots[0]; //"point_1"
                let endPoint = end.emptySlots[end.emptySlots.length-1]; //"point_5"

                // ALLUSERS start point 수정 => end.name
                start.ref.set(startPoint, end.name);

                // ALLUSERS end point 수정 => start.name
                end.ref.set(endPoint, start.name);

                start.emptySlots.shift();
                end.emptySlots.pop()

            }

            // 3-2.ALLUSERS 데이터를 수정해 줘야 한다.


        }else{ // 중단조건, startUser의 빈칸 개수보다 남은 user 수가 같거나 적으면
            console.log(`not enough slots! m:${m} `);

            // 매치메이킹 알고리즘 완료. 마지막 ALLUSERS.size - m 개의 빈칸은 매칭이 불가한 부분 확인함.
            leftUsers.push(matchMakingPool[m]);
        }

    }
    console.log(userPool);
    console.log(leftUsers);
    // Q. leftUsers의 빈칸을 메울 수 있는,  Bot의 개수 구하기?
    // A1. 일단 => 채울 수 있는 칸은 전부 채운다.
    // A 2-1. 남은 플레이어 수 만큼 봇을 만들면 가능은 하다. => 그런데, 봇을 꾸준히 만들어낼 예정인가?
    // > 무한히 봇을 만들 수는 없어(왜?) =>
    // !!!! 연결이 안 된 포인트가 있을 수도 있잖아. !!!!

    // ### 클래식 모드는 봇을 만들어 준다. ###
    // ### 친구들끼리 하는 소셜 모드나 싱글플레이는, '빈 칸'이 생긴다. ###> 킥의 리스크가 커질 수 있다.

    // 남과의 비교를 안 할 수는 없다.
    // 상방 비교, 하방 비교, 한다.
    // A 2-1.

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













