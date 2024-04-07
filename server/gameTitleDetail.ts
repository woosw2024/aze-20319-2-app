// const express = require('express');
// const app = express();
import express, { Express, Request, Response } from 'express';
//import { MgameTitle, MgameTitlePost, MgameDetailList, MgameDetailPost } from './model/MgameTitle';
const router: Express = express();  //router 선언
const dbPool = require("./dbConn");



//이거 되나 써 본다 수정 삭제 delete. put 등으로 넘오 오니깐
const gameTitleDetailCud = "call set_gameTitleDetail(?,?,?,?,?,?)";

//let id345=1;
// json 데이터로 해서 가져 오도록 되어 있다 배열로 typescript 는 배열로 선언 되어 있다
router.get('/:gtIdx', async (req:Request,res:Response) => {
    //url 에 세그먼트로 달려 오면 params로 아니면 req.query.변수명
    //console.log('=== gameTitleDetail 데이터 가져오기 ===');
    let gtIdx = req.params.gtIdx;
    //console.log(gtIdx);
    await dbPool.execute(
        'call get_gameTitleDetail(?)',
        [gtIdx],
        function(err:Error, results:any, fields:any) {
          //console.log(results[0]); // results contains rows returned by server
          //console.log(fields); // fields contains extra meta data about results, if available
          //If you execute same statement again, it will be picked from a LRU cache
          //which will save query preparation time and give better performance
          if(err) return res.send(err); 
          return res.status(200).json(results[0]);
        }
    );
});


router.post('/', async (req:Request,res:Response) => {
  //console.log('=== gameTitle 데이터 가져오기 ===');
  //mysql2 공식문서를 보면 됨 https://sidorares.github.io/node-mysql2/docs
  let gtdTitle = req.body.gtdTitle;
  let gtIdx = req.body.gtIdx;
  //console.log(req.body);
  await dbPool.execute(
      gameTitleDetailCud,
      [0,gtIdx,gtdTitle,'',`${JSON.stringify(req.body)}`,'post'],
      function(err:Error, results:any) {
        //console.log(results[0]); // results contains rows returned by server
        //console.log(fields); // fields contains extra meta data about results, if available
        // If you execute same statement again, it will be picked from a LRU cache
        // which will save query preparation time and give better performance
        if(err) return res.send(err);
        return res.status(200).json(results[0][0]);   //내가 쿼리로 넘기는건 배열로 넘어 온다 배열 안되게 할 수 없나?       
      }
  );
});


router.delete('/:gtdIdx/:gtIdx', async (req:Request,res:Response) => {
  //console.log('=== gameTitle 데이터 가져오기 ===');
  //mysql2 공식문서를 보면 됨 https://sidorares.github.io/node-mysql2/docs
  let gtIdx = req.params.gtIdx;    
  let gtdIdx = req.params.gtdIdx;    
  await dbPool.execute(
    gameTitleDetailCud,
      [gtdIdx, gtIdx,'','',`${JSON.stringify(req.params)}`,'delete'],
      function(err:Error, results:any) {
        //console.log(results[0]); // results contains rows returned by server
        //console.log(fields); // fields contains extra meta data about results, if available
        // If you execute same statement again, it will be picked from a LRU cache
        // which will save query preparation time and give better performance
        if(err) return res.send(err);
        //TODO 내가보내는 결과 값은 배열에 배열이다 해결방안은?
        return res.status(200).json(results[0][0]);          
      }
  );
});



module.exports = router;  //이거 없으면 에러 뜨는구나