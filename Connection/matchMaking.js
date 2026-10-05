
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

        return WAITING_PRISONERS;
        
    };

    const startGame = (partyOfSix)=>{ // ## 어떤 객체를 인자로 받는지 확정 필요
        console.log(partyOfSix);
    }

    const matchParties = (waitingUsersMap)=>{

        console.log("waiting Users are: ",waitingUsersMap);
        const MATCHMAKING_POOL = new Map([
            [1,[]],
            [2,[]],
            [3,[]],
            [4,[]],
            [5,[]]
        ]);
        
        // 일단 WAITING_PRISONERS의 파티들을 MATCHMAKING_POOL에 사이즈별로 분류해 집어넣음.
        WAITING_PRISONERS.forEach((party, partyID,allParties)=>{

            console.log("party: ", party,"partyID: ", partyID);
            
            if(party.size > 6 || party.size < 1){ // 파티 크기가 잘못된 경우
                console.log(party.size, "something wrong - party larger than 6 or smaller than 1");
            
            }else if(party.size === 6){ // 6인 파티의 경우
                startGame(party);
                allParties.delete(partyID);

            }else{ // 1~5인 파티의 경우
                // ## Map에는 파티를 다 넣어놨다...=> size가 key인  로 해 놓고 value로 [{party1},{party2}...] (6-partySize)인 매칭 파티를 바로 찾을 수 있을것.
                
                // 사이즈에 맞게 파티 넣기
                // ## 그런데 WAITINGUSERS와 MATCHMAKING_POOL을 분리할 필요가 있나?
                MATCHMAKING_POOL.get(party.size).push(party);
                // ## entryPoint: console.log(MATCHMAKING_POOL); 해 보기. 제대로 들어가는지.
                // ## 5-1인 파티/2-4인 파티/3인 파티 각각 알고리즘이 다를걸. 이건 생각해 보자.  

            };
        });

    };

    return{
        appendPrisoner,
        matchParties
    };

};

const MATCHMAKING = matchMaking_Method();
export default MATCHMAKING;