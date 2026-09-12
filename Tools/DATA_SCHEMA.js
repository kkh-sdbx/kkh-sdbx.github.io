// 생각해보니, DATA_SCHEMA는 서버에서 클라이언트로 GET된 데이터셋이잖아. 서버에서 마스터 데이터를 잡아 놓는 게 먼저지.

const SCHEMA = ()=>{
    
    const prisonerData = ()=>{
        const prisoner = {
            "PRISONER_NAME":"prisonerName",
            "PRISONER_TYPE":"prisonerType",
            "PRISONER_ID":"prisonerID",
            "PRISONER_GAME_ACTIONS":
                {"G_point_1":null, 
                "G_point_2":null,
                "G_point_3":null,
                "G_point_4":null,
                "G_point_5":null},
            "PRISONER_GAME_STATUS":{"status":"not yet","N":0,"Y":0,"K":0} // NYK에는 뭐가 들어가야 하는거냐?
        }
        return prisoner
    
    };

    const GAME_PHASE = ()=>{
        /**
         * resultTable은 서버에서 받아와 저장을 하든지 해야 한다. Connection에서 setSchema()도 있어야 할 듯. */
        const resultTable = {
        "YY": {"breakUp":false, "score":[4, 4]},   
        "YN": {"breakUp":false, "score":[-8, 8]},  
        "YK": {"breakUp":true, "score":[2, 0]},
        "NY": {"breakUp":false, "score":[8, -8]},  
        "NN": {"breakUp":false, "score":[-6, -6]}, //NN의 시차도 적용해야 함.
        "NK": {"breakUp":true, "score":[-2, 0]},
        "KY": {"breakUp":true, "score":[0, 2]},   
        "KN": {"breakUp":true, "score":[0, -2]},   
        "KK": {"breakUp":false, "score":[-12, -12]}
    }; 
        const playingPhase = new Map([
            ["commence",{"name":"commence","num":1, "availabeActions":[]}],
            ["selection",{"name":"selection","num":2, "availabeActions":[]}],
            ["sendingUltimatum",{"name":"sendingUltimatum","num":3, "availabeActions":[]}],
                    
        ]);
        
        const resultPhase = new Map([
            ["showDown",{"name":"showDown","num":4, "availabeActions":[]}],
            ["matchMaking",{"name":"matchMaking","num":5, "availabeActions":[]}],
            ["ending",{"name":"ending","num":6, "availabeActions":[]}]        
        ]);
        const game = {
            "rounds":0, //로컬은 13, 글로벌은 41
            "startingLife":0, // 로컬은 100, 글로벌은 ??
            "playingPhase": {"data":playingPhase,"num":1, "availabeActions":[]},
            "resultPhase":{"data":resultPhase,"num":2, "availabeActions":[]},
            "resultTable":{"data":playingPhase,"num":99, "availabeActions":[]}}; 
        //new Map([]);

        return{
            game
        }
    };
    
    return{
        prisonerData,
        GAME_PHASE

    }

};//외부 모듈에 데이터를 넘겨줄 때 structuredClone(this.prisonerData())를 사용하여 깊은 복사(Deep Copy)된 독립적 객체를 반환하도록 안전장치를 걸어두면 정합성이 더욱 단단해집니다.


export default SCHEMA