console.log("mock server");
console.log(storage);

const ALLUSERS = new Map();
const setDummyActions = document.getElementById("setDummyActions");
const startMatchMaking = document.getElementById("startMatchMaking");
const leftUsers = [];

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
    //const leftUsers = [];

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

    fillLeftOvers(leftUsers);


}

function fillLeftOvers(leftOver){ //leftOver === array of Map
    console.log(leftOver, typeof(leftOver));
    
    // 1.  일단 남은 칸을 전부 채운다.
    // 1-1. [0]의 빈 칸을 채우고,   
    // 1-1-1.  이 함수가 발동되는 조건이, matchMakingPool의 m번째 원소의 남은 빈칸보다 남은 원소의 수가 적을 때임.
    //### m번째(leftOver[0])의 빈 칸을 채우고, leftOver[leftOver.length-1]까지 일단 순회는 한다.    
    
    // 1-2. [legnth -2]까지 채워는 본다.
    // 
    // 필요한 봇은 최대 1개.
    // 하단에 로직을 작성해 뒀으니 사용하면 된다.

/**
 * for(let i=0;i<leftUsers.length-1;i++){
    console.log(leftUsers[i]);
    for(let j=1;j<leftUsers.length-i;j++){
        console.log(i+j);
        let nextLastPoint = leftUsers[i+j].emptySlots[leftUsers[i+j].emptySlots.length-1]; //"point5";
        if(nextLastPoint){
            leftUsers[i].ref.set(leftUsers[i].emptySlots[0], leftUsers[i+j].name);
            leftUsers[i+j].ref.set(nextLastPoint, leftUsers[i].name);
            console.log(leftUsers[i].emptySlots[0], leftUsers[i+j].name, nextLastPoint, leftUsers[i].name)
            leftUsers[i].emptySlots.shift();
            leftUsers[i+j].emptySlots.pop();
        }
            
    }
    
}
console.log(leftUsers);


 */

// 예시와 같은 경우에, null칸이 2개씩 있는 dummy User가 4명이 남는다. 
// 최소한의 봇만 생각해도 8명임.

//'깍두기' 라는 이름으로 머릿수 채우기용 봇이 필요하다.

//봇은 이길 수 있겠지? 라는, 그런 동기부여를 심어줘야 함.

/**
 * 추가 최적화 고려 사항 (선택 사항)
현재 로직은 충분히 빠르지만, 만약 병렬 처리나 데이터베이스 부하가 우려된다면 다음을 고려할 수 있습니다.
데이터베이스 쓰기 최적화 (가장 중요):
매칭이 완료된 후 start.ref.set(...)을 통해 데이터를 수정할 때, DB에 빈번한 쓰기 요청이 발생합니다.
개선: 매칭 결과를 메모리(배열/객체)에 저장해 둔 다음, 모든 매칭이 끝난 후 **한 번의 배치 업데이트(Batch Update)**로 데이터베이스에 기록하면 DB 부하와 네트워크 비용을 크게 줄일 수 있습니다.
leftUsers 처리:
else 조건문에 의해 매칭이 안 된 leftUsers가 발생합니다. 이들은 후속 fillLeftOvers(leftUsers) 함수에서 봇으로 채워지게 될 것입니다. 이 로직은 현재 알고리즘이 남기는 잔여물을 처리하는 방식이며, 성능에는 큰 영향이 없습니다.
 * 
 */

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













