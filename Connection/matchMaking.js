import DB_HANDLER from "./mockDB.js";

// 일단 선언.
// WAITING_PRISONERS에 넣는 것도 큐 요청 시에 진행되어야 함.
const WAITING_PRISONERS = new Map(); 


const matchMaking_Method = ()=>{

    // WAITING_PRISONERS에 유저 정보를 넣는 함수
    const appendPrisoner = (incomingPrisoner)=>{
        const party = {
            "partyID":"", // ## 파티 아이디를 만드는 함수도 필요하다
            "leader":incomingPrisoner.prisonerID, // 여러 명이 동시에 큐 신청할 때 대비
            "size":1,
            "members":[]

        };
        party.members.push(incomingPrisoner.prisonerID);
        party.partyID = `${incomingPrisoner.prisonerID}_1`;

        WAITING_PRISONERS.set(party.partyID,party);

        // 봇들을 mock해서 넣는 코드. 일단 20마리
        
        let botsToAdd = 20;

        for(let i=0;i<botsToAdd;i++){
            const party = {
            "partyID":"", // ## 파티 아이디를 만드는 함수도 필요하다
            "leader":"", // 여러 명이 동시에 큐 신청할 때 대비
            "size":1,
            "members":[]
            };
            
            party.partyID = `bot${i}_1`;
            party.leader = `bot${i}`;
            party.members.push(`bot${i}`);           

            WAITING_PRISONERS.set(party.partyID,party);
        };
        
        /*
        ## 다인 큐를 bot으로 mock 했던 코드 - 2026.10.05.
        ## 일단 개인전을 mock한 후 다인 큐 처리는 나중에 한다.
        const botPartyMade = [];
        while (true){
            let toAdd ;
            if(botsToAdd > 0){

                botsToAdd > 5 ? toAdd = Math.floor(Math.random()*6)+1 : toAdd = Math.floor(Math.random()*botsToAdd)+1;
                const botParty = {
                    "partyID":"", // ## 파티 아이디를 만드는 함수도 필요하다
                    "leader":"", // 여러 명이 동시에 큐 신청할 때 대비
                    "size":0,
                    "members":[]
                };

                for(let i=0;i<toAdd;i++){
                    botParty.members.push(`bot${botsToAdd-i}`);
                };

                botParty.partyID = `${botParty.members[0]}_2`
                botParty.leader = botParty.members[0];
                botParty.size = botParty.members.length;
                botPartyMade.push(botParty);
                botsToAdd -= toAdd;
            }else{
                break;
            }; 
                
        };
        console.log("botsToAdd: ",botsToAdd,"botPartyMade: ",botPartyMade);
        botPartyMade.forEach((botParty)=>{
            WAITING_PRISONERS.set(botParty.partyID,botParty);
        });
        */

        return WAITING_PRISONERS;
        
    };

 
    const startGame = (partyOfSix)=>{ // 길이가 6인 array
        const GAME_ROOM_SCHEMA = DB_HANDLER.getGameRoomSchema();
         
        const GAME_ROOM = structuredClone(GAME_ROOM_SCHEMA);
        
        /**
         * {
            "GAME_ROOM_ID":"RandomID",
            "prisoners":[],
            "turnsTaken":0,
        };
         */
        GAME_ROOM.prisoners = partyOfSix;
        console.log(GAME_ROOM);

        
        partyOfSix.forEach((party)=>{
            
            party.members.forEach((member)=>{
                // 우선 WAITING_PRISONERS에서 삭제.
                const waitingID = `${member}_${party.size}`;
                WAITING_PRISONERS.delete(waitingID);

            });
            
            
            // ## 상위 함수인 gatherSix 에서 gamesToRender.push(GAME_STARTED); 했고 mockWeb에서 forEach로 렌더링 정보를 쏠 거다. 
            // 그리고 이후에 mockWeb에서 console.log로 확인한다.=> 확인 완료
                        
        });

        return GAME_ROOM;

        
    };

    const returnToWaitingQueue = (leftOverPrisoners)=>{ // 길이가 0~5인 array
        console.log(leftOverPrisoners);
    };

    const sortParties = (waitingUsersMap)=>{

        console.log("waiting Users are: ",waitingUsersMap);
        const MATCHMAKING_POOL = new Map([
            [1,[]],
            [2,[]],
            [3,[]],
            [4,[]],
            [5,[]]
        ]);
        
        // 일단 WAITING_PRISONERS의 파티들을 MATCHMAKING_POOL에 사이즈별로 분류해 집어넣음.
        //const toMatch = _.cloneDeep(WAITING_PRISONERS);
        
        //## Codespace에서는 lodash 설치가 됐었는데, 일단 로컬에서는 structuredClone으로 진행해 본다.

        const toMatch = new Map();
        waitingUsersMap.forEach((value,key)=>{
            const cloned = typeof(value) === "object" && value !== null ? structuredClone(value) : value;
            toMatch.set(key,cloned);

        });
        toMatch.forEach((party, partyID,allParties)=>{

            console.log("party: ", party,"partyID: ", partyID);
            
            if(party.size > 6 || party.size < 1){ // 파티 크기가 잘못된 경우
                console.log(party.size, "something wrong - party larger than 6 or smaller than 1");
            
            }else if(party.size === 6){ // 6인 파티의 경우
                startGame(party); // ## 이 코드 놔두면 언젠가 버그 터진다. startGame을 호출하는 코드가 이 다음인 gatherSix에도 있어서...
                allParties.delete(partyID);

            }else{ // 1~5인 파티의 경우
                
                // 사이즈에 맞게 파티 넣기

                MATCHMAKING_POOL.get(party.size).push(party);

                 
                // ## 5-1인 파티/2-4인 파티/3인 파티 각각 알고리즘이 다를걸. 
                // ## 일단 아이디어는...
                /*
                1. 5인 파티를 매칭시킴. 5+1 서치
                2. 3인 파티를 서로 매칭시킴. 짝수 개 파티의 경우 문제 없고, 홀수 개 파티의 경우 => 3+2+1 서치 => 3+1+1+1 서치 => 그래도 없으면 보류.
                3. 4인 파티를 매칭시킴. 4+2 서치=>4+1+1 서치 
                4. !! => 5인 파티까지 가능하게 할건가? 그럼 어뷰징의 영역인데. => 그러면 랭크 게임과 일반 게임을 분리해야 한다.
                // ## 일단 '개인전' 큐부터 만든다.
                */
            };
        });

        

        return MATCHMAKING_POOL;
    };

    const gatherSix = (sortedPool)=>{

        const gamesToRender = [];
                // ## I. 6명 매칭 - 이 알고리즘은 반복문을 줄이는 방식으로 수정/최적화가 될 것 같다. 일단 지금은 이렇게 진행.
        const matchesMade = [];
        const posibleMatches = Math.floor(sortedPool.get(1).length/6);
        const leftOvers = (sortedPool.get(1).length)%6;
        const leftPrisoners = [];

        for(let k=0;k<posibleMatches;k++){
            let gameRoom = [];
            for(let l=0;l<6;l++){
                gameRoom.push(structuredClone(sortedPool.get(1)[(k*6)+l]));
            };
            matchesMade.push(gameRoom);
        };

        if(leftOvers != 0){
            for(let m=1;m<(leftOvers+1);m++){
                leftPrisoners.push(structuredClone(sortedPool.get(1)[sortedPool.get(1).length-m]));
            };
        };
                
        // 남은 유저는 큐로 다시 보낸다.      
        returnToWaitingQueue(leftPrisoners);

        // 6인 파티가 매칭되면 게임 시작.
        matchesMade.forEach((party)=>{
            const GAME_STARTED = startGame(party);
            gamesToRender.push(GAME_STARTED);
        });

        return gamesToRender;

    /**
     * const userStatus = {"isIn":"lobby,game,shop","queueStatus":out,waiting, inGame_GAMEROOMULID}
     */

    };

    return{
        appendPrisoner,
        sortParties,
        gatherSix,
        startGame

    };

};

const MATCHMAKING = matchMaking_Method();
export default MATCHMAKING;