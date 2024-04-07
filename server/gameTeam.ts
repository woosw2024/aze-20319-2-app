// const express = require('express');
// const app = express();
import express, { Express, Request, Response } from 'express';
//import { MgameTitle, MgameTitlePost, MgameDetailList, MgameDetailPost } from './model/MgameTitle';
const router: Express = express();  //router 선언
const dbPool = require("./dbConn");

// 쿼리가 완료 되면 자동 Connection is automatically released when query resolves 된다고 확인했음
// 추후 문제 생겼을 경우 확인 해 봐야 됨
/**
 	para_gtdIdx 		BIGINT,   #대회상세코드
	para_teamName		VARCHAR(50), #팀명칭
	para_teamUserArray	TEXT,  #배열로 들어 온다 (팀원)
	para_bossFlagArray	VARCHAR(300), #팀장유무
	para_arrayCount		SMALLINT,	#배열카운트
	para_urlPath		VARCHAR(300),
	para_allDataVal		MEDIUMTEXT,
	para_gubun		VARCHAR(10)
 */
//이거 되나 써 본다 수정 삭제 delete. put 등으로 넘오 오니깐
/* 
//TODO repeat  ?를 숫자 만큼생성 해줌 사용방법
const parameterDate = [idx, attIdx, title, content, fileCount, saveFiles.join('##'), orgFiles.join('##'), fileType.join('##'), fileDir.join('##'), insertName, updateName, gubun];  
const sqlQuery = "call set_board(?"+",?".repeat(parameterDate.length-1)+")";   
*/
/* 
interface gameTeamData {
  gtdIdx:number;
	teamName:number;
	teamUserArray:number;
	bossFlagArray:number;
	arrayCount:number;
	urlPath:number;
	allDataVal:number;
	gubun:number;
} 
*/
const setGameTeam = "call set_gameTeam(?"+",?".repeat(7)+")";
const getGameTeam = "call get_gameTeam(?,?,?)";

/** 부모창 쿼리문 */


// json 데이터로 해서 가져 오도록 되어 있다 배열로 typescript 는 배열로 선언 되어 있다
router.get('/:gubun', async (req:Request,res:Response) => {
  
  let gubun = req.params.gubun;
  let gtdIdx = req.query.gtdIdx==null ? 0 : req.query.gtdIdx; 
  let teamCode = req.query.teamCode==null ? 0 : req.query.teamCode;
  //let teamCode = req.body.teamCode==undefined? 0 : req.body.teamCode;
  //console.log(gtdIdx);
  //mysql2 공식문서를 보면 됨 https://sidorares.github.io/node-mysql2/docs
  await dbPool.execute(
      getGameTeam,
      [gtdIdx, teamCode, gubun],
      function(err:Error, results:any) {

        //console.log(results[0]); // results contains rows returned by server
        //console.log(fields); // fields contains extra meta data about results, if available
        // If you execute same statement again, it will be picked from a LRU cache
        // which will save query preparation time and give better performance
        //console.log(results[0]);  
        if(err) return res.send(err);
        return res.status(200).json(results[0]);
      }
  );

});


router.post('/', async (req:Request,res:Response) => { 
    //console.log('=== gameTitle 데이터 가져오기 ===');
    //mysql2 공식문서를 보면 됨 https://sidorares.github.io/node-mysql2/docs
    //console.log(JSON.stringify(req.body));
    //DB에 사용 되는 배열은 내가 임의로 배열은 ## 구분을 해서 넘기면 된다
    //이 부분은 클라이언트에서 배열로 저장할 데이터를 가공 해서 보내야 됨
    //배열 개수도 넘겨야 된다
    //예) [1,2,3,4] ==> 1##2##3##4 

    let gtdIdx = req.body.gtdIdx; 
    let teamName = req.body.teamName;
    let teamUserArray = req.body.teamUserArray;
    let bossFlagArray = req.body.bossFlagArray;
    let arrayCount = req.body.arrayCount;  //입력시 roop돌아야 되는 수 이건 1부터 시작이다
    await dbPool.execute(
        setGameTeam,
        [gtdIdx, teamName, teamUserArray, bossFlagArray, arrayCount, '', `${JSON.stringify(req.body)}`,'post'],
        function(err:Error, results:any) {
          //console.log(results[0]); // results contains rows returned by server
          //console.log(fields); // fields contains extra meta data about results, if available
          // If you execute same statement again, it will be picked from a LRU cache
          // which will save query preparation time and give better performance
          if(err) return res.send(err);
          return res.status(200).json(results[0][0]);          
        }
    );
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


module.exports = router;  //이거 없으면 에러 뜨는구나