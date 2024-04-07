// const express = require('express');
// const app = express();
import express, { Express, Request, Response } from 'express';
//import { MgameTitle, MgameTitlePost, MgameDetailList, MgameDetailPost } from './model/MgameTitle';
const router: Express = express();  //router 선언
const dbPool = require("./dbConn");

// 쿼리가 완료 되면 자동 Connection is automatically released when query resolves 된다고 확인했음
// 추후 문제 생겼을 경우 확인 해 봐야 됨

//이거 되나 써 본다 수정 삭제 delete. put 등으로 넘오 오니깐
const setGameTitle = "call set_gameTitle(?,?,?,?,?)";

/** 부모창 쿼리문 */
//let id345=1;
// json 데이터로 해서 가져 오도록 되어 있다 배열로 typescript 는 배열로 선언 되어 있다
router.get('/', async (req:Request,res:Response) => {

    //console.log('=== gameTitle 데이터 가져오기 ===');
    //mysql2 공식문서를 보면 됨 https://sidorares.github.io/node-mysql2/docs
    await dbPool.execute(
        'call get_gameTitle',
        function(err:Error, results:any) {
          //console.log(results[0]); // results contains rows returned by server
          //console.log(fields); // fields contains extra meta data about results, if available
          // If you execute same statement again, it will be picked from a LRU cache
          // which will save query preparation time and give better performance
          if(err) return res.send(err);
          return res.status(200).json(results[0]);          
        }
    );

});


router.post('/', async (req:Request,res:Response) => {
    //console.log('=== gameTitle 데이터 가져오기 ===');
    //mysql2 공식문서를 보면 됨 https://sidorares.github.io/node-mysql2/docs
    let gtTitle = req.body.gtTitle;
    //console.log(req.body);
    await dbPool.execute(
      setGameTitle,
      [0,gtTitle,'',`${JSON.stringify(req.body)}`,'post'],
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

//세그먼트는 params
router.delete('/:gtIdx', async (req:Request,res:Response) => {
    //console.log('=== gameTitle 데이터 가져오기 ===');
    //mysql2 공식문서를 보면 됨 https://sidorares.github.io/node-mysql2/docs
    let gtIdx = req.params.gtIdx;    
    await dbPool.execute(
      setGameTitle,
      [gtIdx,'','',`${JSON.stringify(req.params)}`,'delete'],
      function(err:Error, results:any) {
        //console.log(results[0]); // results contains rows returned by server
        //console.log(fields); // fields contains extra meta data about results, if available
        // If you execute same statement again, it will be picked from a LRU cache
        // which will save query preparation time and give better performance
        if(err) return res.send(err);
        return res.status(200).json(results[0][0]);  //내가 쿼리로 넘기는건 배열로 넘어 온다 배열 안되게 할 수 없나?        
      }
    );
});


module.exports = router;  //이거 없으면 에러 뜨는구나