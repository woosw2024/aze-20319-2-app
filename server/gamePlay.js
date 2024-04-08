"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const express = require('express');
// const app = express();
const express_1 = __importDefault(require("express"));
//import { MgameTitle, MgameTitlePost, MgameDetailList, MgameDetailPost } from './model/MgameTitle';
const router = (0, express_1.default)(); //router 선언
const dbPool = require("./dbConn");
// 쿼리가 완료 되면 자동 Connection is automatically released when query resolves 된다고 확인했음
// 추후 문제 생겼을 경우 확인 해 봐야 됨
const setGamePlay = "call set_gamePlay(?" + ",?".repeat(26) + ")";
const getGamePlay = "call get_gamePlay(?,?)";
// json 데이터로 해서 가져 오도록 되어 있다 배열로 typescript 는 배열로 선언 되어 있다
router.get('/:gubun', async (req, res) => {
    let gubun = req.params.gubun;
    let gtdIdx = req.query.gtdIdx == null ? 0 : req.query.gtdIdx;
    //let teamCode = req.body.teamCode==undefined? 0 : req.body.teamCode;
    //console.log(gtdIdx);
    //mysql2 공식문서를 보면 됨 https://sidorares.github.io/node-mysql2/docs
    await dbPool.execute(getGamePlay, [gtdIdx, gubun], function (err, results) {
        //console.log(results[0]); // results contains rows returned by server
        //console.log(fields); // fields contains extra meta data about results, if available
        // If you execute same statement again, it will be picked from a LRU cache
        // which will save query preparation time and give better performance
        //console.log(results[0]);  
        if (err)
            return res.send(err);
        return res.status(200).json(results[0]); //res.send(results[0]);    
    });
});
router.post('/', async (req, res) => {
    //console.log('=== gameTitle 데이터 가져오기 ===');
    //mysql2 공식문서를 보면 됨 https://sidorares.github.io/node-mysql2/docs
    //console.log(JSON.stringify(req.body));
    //DB에 사용 되는 배열은 내가 임의로 배열은 ## 구분을 해서 넘기면 된다
    //이 부분은 클라이언트에서 배열로 저장할 데이터를 가공 해서 보내야 됨
    //배열 개수도 넘겨야 된다
    //예) [1,2,3,4] ==> 1##2##3##4 
    console.log(req.body);
    //프로시져 입력값
    const gtdIdx = req.body.gameInfo.gtdIdx; //대회 상세 번호
    const gwdSetNo = req.body.gameInfo.setNum; //대회 세트 번호
    const blueTeamCode = req.body.blueTeam.teamCode; //블루팀코드 
    const blueTeamName = req.body.blueTeam.teamName; //블루팀명
    const blueTeamUserArray = req.body.blueTeam.teamUser.join('##'); //블루팀원은 배열로 들어 온다 바꿔 줘야 된다
    const blueTeamPositionArray = req.body.blueTeam.teamPositon.join('##'); //TEXT,		#블루팀 포지션    
    const blueTeamChampArray = req.body.blueTeam.champEng.join('##'); //TEXT,		#블루팀 챔프
    const blueTeamKillArray = req.body.blueTeam.teamKillNum.join('##'); //VARCHAR(100),		#블루팀 킬
    const blueTeamDeathArray = req.body.blueTeam.teamDeathNum.join('##'); //VARCHAR(100),		#블루팀 데스
    const blueTeamAssArray = req.body.blueTeam.teamAssNum.join('##'); //VARCHAR(100),		#블루팀 어시    
    const blueAllPoint = 0; //블루팀 총합점수
    const redTeamCode = req.body.redTeam.teamCode; //#레드팀코드 
    const redTeamName = req.body.redTeam.teamName; //레드팀명
    const redTeamUserArray = req.body.redTeam.teamUser.join('##'); //레드팀원은 배열로 들어 온다
    const redTeamPositionArray = req.body.redTeam.teamPositon.join('##'); //TEXT,		#블루팀 포지션    
    const redTeamChampArray = req.body.redTeam.champEng.join('##'); //TEXT,		#블루팀 챔프
    const redTeamKillArray = req.body.redTeam.teamKillNum.join('##'); //VARCHAR(100),		#블루팀 킬
    const redTeamDeathArray = req.body.redTeam.teamDeathNum.join('##'); //VARCHAR(100),		#블루팀 데스
    const redTeamAssArray = req.body.redTeam.teamAssNum.join('##'); //VARCHAR(100),		#블루팀 어시    
    const gameRs = req.body.gameRs ? 'Y' : 'N'; // 결과 입력 구분 Y 결과입력 N 경기만 입력
    const redAllPoint = 0; //#레드총합계점수
    const gameDate = req.body.gameInfo.gameDate; //#경기날짜
    const gameTime = req.body.gameInfo.GameTime; //CHAR(2),		#경기시간
    const arrayCount = req.body.redTeam.teamUser.length; //		SMALLINT,	#배열카운트 이건 블루나 레드나 같다고 봐야 된다
    //para_urlPath	= ''
    //para_allDataVal	= ,
    //para_gubun		VARCHAR(10)
    /*
    para_gtdIdx		BIGINT,		#대회상세정보
        para_gwdSetNo		TINYINT,	#게임세트번호
        para_blueTeamCode	BIGINT,		#블루팀코드
        para_blueTeamName	VARCHAR(50),		#블루팀명
        para_blueTeamUserArray	TEXT,		#블루팀원은 배열로 들어 온다
    
        para_blueTeamPositionArray	VARCHAR(100),		#블루팀 포지션
        para_blueTeamChampArray	TEXT,		#블루팀 챔프
        para_blueTeamKillArray	VARCHAR(100),		#블루팀 킬
        para_blueTeamDeathArray	VARCHAR(100),		#블루팀 데스
        para_blueTeamAssArray	VARCHAR(100),		#블루팀 어시
        
        para_blueAllPoint	SMALLINT,	#블루총합계점수
        para_redTeamCode	BIGINT,		#레드팀코드
        para_redTeamName	VARCHAR(50),	#레드팀명
        para_redTeamUserArray	TEXT,		#레드팀원은 배열로 들어 온다
        para_redTeamPositionArray	VARCHAR(100),		#레드팀 포지션
    
        para_redTeamChampArray	TEXT,		#레드팀 챔프
        para_redTeamKillArray	VARCHAR(100),		#레드팀 킬
        para_redTeamDeathArray	VARCHAR(100),		#레드팀 데스
        para_redTeamAssArray	VARCHAR(100),		#레드팀 어시
        para_redAllPoint	SMALLINT,	#레드총합계점수
    
        para_gameDate		CHAR(10),  	#경기날짜
        para_gameTime		CHAR(2),		#경기시간
        para_arrayCount		SMALLINT,	#배열카운트 이건 블루나 레드나 같다고 봐야 된다
        para_urlPath		VARCHAR(300),
        para_allDataVal		MEDIUMTEXT,
    
        para_gubun		VARCHAR(10)
         */
    await dbPool.execute(setGamePlay, [gtdIdx, gwdSetNo, gameRs, blueTeamCode, blueTeamName,
        blueTeamUserArray, blueTeamPositionArray, blueTeamChampArray, blueTeamKillArray, blueTeamDeathArray,
        blueTeamAssArray, blueAllPoint, redTeamCode, redTeamName, redTeamUserArray,
        redTeamPositionArray, redTeamChampArray, redTeamKillArray, redTeamDeathArray, redTeamAssArray,
        redAllPoint, gameDate, gameTime, arrayCount, '',
        `${JSON.stringify(req.body)}`, 'post'], function (err, results) {
        //console.log(results[0]); // results contains rows returned by server
        //console.log(fields); // fields contains extra meta data about results, if available
        // If you execute same statement again, it will be picked from a LRU cache
        // which will save query preparation time and give better performance
        if (err)
            return res.send(err);
        return res.status(200).json(results[0][0]);
        //return res.send(results[0][0]);          
    });
});
/* //세그먼트는 params
router.delete('/:gtIdx', (req:Request,res:Response) => {
    //console.log('=== gameTitle 데이터 가져오기 ===');
    //mysql2 공식문서를 보면 됨 https://sidorares.github.io/node-mysql2/docs
    let gtIdx = req.params.gtIdx;
    dbPool.execute(
        setGameTeam,
        [gtIdx,'','',`${JSON.stringify(req.params)}`,'delete'],
        function(err:Error, results:any) {
          //console.log(results[0]); // results contains rows returned by server
          //console.log(fields); // fields contains extra meta data about results, if available
          // If you execute same statement again, it will be picked from a LRU cache
          // which will save query preparation time and give better performance
          if(err) return res.send(err);
          return res.send(results[0][0]);  //내가 쿼리로 넘기는건 배열로 넘어 온다 배열 안되게 할 수 없나?
        }
    );
}); */
module.exports = router; //이거 없으면 에러 뜨는구나
