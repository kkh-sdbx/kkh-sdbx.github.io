 let gameState = {};
        let opponentNameCounter = 5; // Kick으로 새 상대 생성 시 이름용

        // 게임 상태 초기화 (시즌 시작)
        function initGame() {
            opponentNameCounter = 5;
            gameState = {
                currentRound: 1,
                maxRounds: 14,
                player: {
                    name: "Player (You)",
                    score: 0,
                    kicksLeft: 3
                },
                // 5명의 상대
                opponents: [
                    createOpponent(0, "Opponent 1"),
                    createOpponent(1, "Opponent 2"),
                    createOpponent(2, "Opponent 3"),
                    createOpponent(3, "Opponent 4"),
                    createOpponent(4, "Opponent 5"),
                ]
            };
            renderGame();
        }

        // 새 상대 객체 생성 헬퍼
        function createOpponent(id, name) {
            return {
                id: id,
                name: name,
                score: 0,
                yCount: 0, // 상대가 Y를 선택한 횟수
                nCount: 0, // 상대가 N을 선택한 횟수
                // 이번 라운드 선택
                myChoice: 'Pending',
                theirChoice: 'Pending',
                myNTime: Infinity,     // (N, N) 시간 경쟁용
                theirNTime: Infinity
            };
        }

        // UI 전체 새로고침
        function renderGame() {
            // 헤더 업데이트
            document.getElementById('round-display').textContent = gameState.currentRound;
            document.getElementById('kicks-display').textContent = gameState.player.kicksLeft;
            document.getElementById('player-score-display').textContent = gameState.player.score;

            // 상대 카드 렌더링
            const container = document.getElementById('opponent-container');
            container.innerHTML = ''; // 컨테이너 비우기

            gameState.opponents.forEach(opp => {
                const dot = document.createElement('div');
                dot.classList.add("opponent-dot");
                
                const card = document.createElement('div');
                card.className = 'opponent-card';

                const reputation = getReputation(opp);
                
                card.innerHTML = `
                    <h3>${opp.name} (Score: ${opp.score})</h3>
                    <p>평판: <strong style="color:${reputation.color}">${reputation.tier}</strong> (${reputation.ratio}%)</p>
                    
                    <div class="choices">
                        <strong>나의 선택:</strong>
                        <button class="btn-y ${opp.myChoice === 'Y' ? 'selected' : ''}" onclick="chooseAction(${opp.id}, 'me', 'Y')">Y</button>
                        <button class="btn-n ${opp.myChoice === 'N' ? 'selected' : ''}" onclick="chooseAction(${opp.id}, 'me', 'N')">N</button>
                        <button class="btn-k ${opp.myChoice === 'Kick' ? 'selected' : ''}" onclick="chooseAction(${opp.id}, 'me', 'Kick')">Kick</button>
                    </div>
                    
                    <div class="choices">
                        <strong>상대 선택 (테스트):</strong>
                        <button class="btn-y ${opp.theirChoice === 'Y' ? 'selected' : ''}" onclick="chooseAction(${opp.id}, 'opponent', 'Y')">Opp Y</button>
                        <button class="btn-n ${opp.theirChoice === 'N' ? 'selected' : ''}" onclick="chooseAction(${opp.id}, 'opponent', 'N')">Opp N</button>
                    </div>
                    
                    <p style="margin-top:10px;">(상태: You <strong>${opp.myChoice}</strong> / They <strong>${opp.theirChoice}</strong>)</p>
                `;
                container.appendChild(card,dot);
            });

            renderLeaderboard();
        }

        // 평판 등급 계산
        function getReputation(opp) {
            const total = opp.yCount + opp.nCount;
            if (total === 0) return { tier: '일반 (New)', ratio: 'N/A', color: '#9E9E9E' };
            
            const yRatio = opp.yCount / total;
            if (yRatio >= 0.9) return { tier: '신뢰', ratio: (yRatio*100).toFixed(0), color: '#4CAF50' };
            if (yRatio >= 0.7) return { tier: '협력', ratio: (yRatio*100).toFixed(0), color: '#8BC34A' };
            if (yRatio >= 0.3) return { tier: '일반', ratio: (yRatio*100).toFixed(0), color: '#9E9E9E' };
            if (yRatio >= 0.1) return { tier: '경계', ratio: (yRatio*100).toFixed(0), color: '#FFC107' };
            return { tier: '배신자', ratio: (yRatio*100).toFixed(0), color: '#F44336' };
        }

        // 랭킹 렌더링
        function renderLeaderboard() {
            const list = document.getElementById('leaderboard-list');
            list.innerHTML = '';

            const allPlayers = [gameState.player, ...gameState.opponents];
            allPlayers.sort((a, b) => b.score - a.score); // 점수 내림차순 정렬

            allPlayers.forEach(p => {
                const li = document.createElement('li');
                li.textContent = `${p.name}: ${p.score} 점`;
                if (p.name === "Player (You)") {
                    li.className = 'player-rank';
                }
                list.appendChild(li);
            });
        }

        // 3. 사용자가 선택 버튼을 클릭 (Y, N, Kick)
        function chooseAction(opponentId, playerType, choice) {
            if (gameState.currentRound > gameState.maxRounds) {
                alert("시즌이 종료되었습니다. '시즌 리셋'을 눌러주세요.");
                return;
            }
            
            const opp = gameState.opponents.find(o => o.id === opponentId);

            if (playerType === 'me') {
                if (choice === 'Kick' && gameState.player.kicksLeft <= 0) {
                    alert("남은 Kick 횟수가 없습니다!");
                    return;
                }
                opp.myChoice = choice;
                opp.myNTime = (choice === 'N') ? Date.now() : Infinity;
            } else { // 'opponent'
                opp.theirChoice = choice;
                opp.theirNTime = (choice === 'N') ? Date.now() : Infinity;
            }
            
            // 선택을 시각적으로 반영하기 위해 UI 부분 갱신 (간단하게 전체 렌더링)
            renderGame();
        }

        // 4. 수동 타이머: ShowDown! 버튼 클릭 (핵심 로직)
        function showDown() {
            if (gameState.currentRound > gameState.maxRounds) {
                alert("시즌이 종료되었습니다. '시즌 리셋'을 눌러주세요.");
                return;
            }

            // 모든 선택이 완료되었는지 확인
            const allChoicesMade = gameState.opponents.every(opp => {
                // Kick을 선택했다면 상대 선택은 필요 없음
                if (opp.myChoice === 'Kick') return true;
                return opp.myChoice !== 'Pending' && opp.theirChoice !== 'Pending';
            });

            if (!allChoicesMade) {
                alert("모든 5명의 상대에 대해 '나의 선택'과 '상대의 선택'을 완료해주세요. (Kick 제외)");
                return;
            }

            let playerRoundScore = 0; // 이번 라운드 플레이어 총 득점

            // 점수 계산
            gameState.opponents.forEach(opp => {
                const my = opp.myChoice;
                const their = opp.theirChoice;

                if (my === 'Kick') {
                    // Kick은 0점. 점수 계산 없음.
                    gameState.player.kicksLeft--;
                    // 새 상대로 교체
                    const newOppName = `Opponent ${++opponentNameCounter} (New)`;
                    gameState.opponents[opp.id] = createOpponent(opp.id, newOppName);
                    
                } else if (my === 'Y' && their === 'Y') {
                    playerRoundScore += 12;
                    opp.score += 12;
                    opp.yCount++; // 상대 평판 업데이트
                    
                } else if (my === 'N' && their === 'Y') {
                    playerRoundScore += 18;
                    opp.score -= 6;
                    opp.yCount++; // 상대 평판 업데이트
                    
                } else if (my === 'Y' && their === 'N') {
                    playerRoundScore -= 6;
                    opp.score += 18;
                    opp.nCount++; // 상대 평판 업데이트
                    
                } else if (my === 'N' && their === 'N') {
                    opp.nCount++; // 상대 평판 업데이트
                    // (N, N) 시간 경쟁
                    if (opp.myNTime < opp.theirNTime) {
                        playerRoundScore -= 12; // 먼저 N을 누름
                        opp.score -= 24;
                    } else if (opp.theirNTime < opp.myNTime) {
                        playerRoundScore -= 24; // 늦게 N을 누름
                        opp.score -= 12;
                    } else {
                        // 동시 또는 오류 (둘 다 -12점)
                        playerRoundScore -= 12;
                        opp.score -= 12;
                    }
                }
            });

            // 라운드 결과 종합
            gameState.player.score += playerRoundScore;
            gameState.currentRound++;

            // 다음 라운드를 위해 선택 리셋 (Kick 당한 상대는 이미 새 객체임)
            gameState.opponents.forEach(opp => {
                opp.myChoice = 'Pending';
                opp.theirChoice = 'Pending';
                opp.myNTime = Infinity;
                opp.theirNTime = Infinity;
            });

            // UI 업데이트
            renderGame();

            if (gameState.currentRound > gameState.maxRounds) {
                alert(`시즌 종료! 최종 점수: ${gameState.player.score}`);
            }
        }

        // 페이지 로드 시 게임 시작
        window.onload = initGame;