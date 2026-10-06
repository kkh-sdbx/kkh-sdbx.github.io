//import _ from "lodash";

const WAITING_PRISONERS = new Map(); // 이렇게 선언하는 게 아니라? 일단 선언.

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

    const startGame = (partyOfSix)=>{ // ## 어떤 객체를 인자로 받는지 확정 필요
        console.log(partyOfSix);
    }

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
                startGame(party);
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
        console.log(sortedPool);
        
        // ## entryPoint: 파티는 1명으로 제한했다. '개인전' 큐부터 만든다.   
                // ## I. 6명 매칭               

                // ## II. Deep Copy해서 game Onject 만들기

                // ## III. startGame()에 넘기고 클라이언트에게 줄 status에는 "gameStarted"로 명시
                // ## ## 이 경우에는 서버에서 GET 요청에 응답할 userStatus 객체가 필요하다. 모든 접속자를 ALL_PRISONERS에 담아두는 것은 메모리 낭비. 그럼 WAITING_PRISONERS에 넣는 것도 큐 요청 시에 진행되어야 함.
                /**
                 * const userStatus = {"isIn":"lobby,game,shop","queueStatus":out,waiting, inGame_GAMEROOMULID}
                 */

                 


    }

    return{
        appendPrisoner,
        sortParties,
        gatherSix

    };

};

const MATCHMAKING = matchMaking_Method();
export default MATCHMAKING;