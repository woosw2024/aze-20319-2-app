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
/* global BigInt */
// 쿼리가 완료 되면 자동 Connection is automatically released when query resolves 된다고 확인했음
// 추후 문제 생겼을 경우 확인 해 봐야 됨
//이거 되나 써 본다 수정 삭제 delete. put 등으로 넘오 오니깐
/*
    para_userIdx	BIGINT,  회원번호
    para_lolNick	VARCHAR(50), 롤닉네임
    para_outFlag	CHAR(1),  탈퇴유무
    para_urlPath	VARCHAR(300), 호출 url
    para_allDataVal	MEDIUMTEXT, 저장 데이터
    para_gubun	VARCHAR(10) 실행 구분자
 */
const azeUserCud = "call set_azeUser(?,?,?,?,?,?)";
/** 부모창 쿼리문 */
//let id345=1;
// json 데이터로 해서 가져 오도록 되어 있다 배열로 typescript 는 배열로 선언 되어 있다
router.get('/', async (req, res) => {
    //console.log('=== azeUser 데이터 가져오기 ===');
    //console.log(req.query.schVal);
    //mysql2 공식문서를 보면 됨 https://sidorares.github.io/node-mysql2/docs
    let schVal = req.query.schVal == undefined ? '' : req.query.schVal;
    //console.log(schVal);
    //try sms await 에서만 사용
    try {
        await dbPool.execute('call get_azeUser(?)', [schVal], function (err, results) {
            //console.log(results[0]); // results contains rows returned by server
            //console.log(fields); // fields contains extra meta data about results, if available
            // If you execute same statement again, it will be picked from a LRU cache
            // which will save query preparation time and give better performance
            //console.log(results);
            if (err)
                return res.json(err);
            return res.status(200).json(results[0]);
        });
    }
    catch (err) {
        console.log(err);
        return err;
    }
});
// 입력
router.post('/', async (req, res) => {
    //console.log('=== gameTitle 데이터 가져오기 ===');
    //mysql2 공식문서를 보면 됨 https://sidorares.github.io/node-mysql2/docs
    let lolNick = req.body.lolNick;
    //console.log(req.body);    
    //console.log(req.body);
    await dbPool.execute(azeUserCud, [0, lolNick, '', '', `${JSON.stringify(req.body)}`, 'post'], function (err, results) {
        //console.log(results[0]); // results contains rows returned by server
        //console.log(fields); // fields contains extra meta data about results, if available
        // If you execute same statement again, it will be picked from a LRU cache
        // which will save query preparation time and give better performance
        //res.send, res.json 다시 공부 해 보기 json 도 send를 호출 한다 json을 하면 json형태로 변환후 send를 호출 한다
        if (err)
            return res.send(err); //자체에러는 배열로 넘어 오지 않는다
        //console.log(result[0]); //내가 쿼리로 넘기는건 배열로 넘어 온다 배열 안되게 할 수 없나?
        //console.log(result[0][0]);
        return res.status(200).json(results[0][0]); //내가 쿼리로 넘기는건 배열로 넘어 온다 배열 안되게 할 수 없나?       
    });
});
//수정
router.put('/', async (req, res) => {
    //console.log('=== gameTitle 데이터 가져오기 ===');
    //mysql2 공식문서를 보면 됨 https://sidorares.github.io/node-mysql2/docs
    //console.log(req.body);      
    let lolNick = req.body.lolNick;
    let outFlag = req.body.outFlag;
    let userIdx = req.body.userIdx;
    await dbPool.execute(azeUserCud, [userIdx, lolNick, outFlag, '', `${JSON.stringify(req.body)}`, 'put'], function (err, results) {
        //console.log(results[0]); // results contains rows returned by server
        //console.log(fields); // fields contains extra meta data about results, if available
        // If you execute same statement again, it will be picked from a LRU cache
        // which will save query preparation time and give better performance
        //res.send, res.json 다시 공부 해 보기 json 도 send를 호출 한다 json을 하면 json형태로 변환후 send를 호출 한다
        if (err)
            return res.send(err); //자체에러는 배열로 넘어 오지 않는다
        //console.log(result[0]); //내가 쿼리로 넘기는건 배열로 넘어 온다 배열 안되게 할 수 없나?
        //console.log(result[0][0]);
        return res.status(200).json(results[0][0]); //내가 쿼리로 넘기는건 배열로 넘어 온다 배열 안되게 할 수 없나?       
    });
});
//삭제 세그먼트는 params, 
router.delete('/', async (req, res) => {
    //console.log('=== gameTitle 데이터 가져오기 ===');
    //mysql2 공식문서를 보면 됨 https://sidorares.github.io/node-mysql2/docs
    let lolNick = req.body.lolNick;
    let userIdx = req.body.userIdx;
    //console.log(req.body);
    await dbPool.execute(azeUserCud, [userIdx, lolNick, '', '', `${JSON.stringify(req.body)}`, 'delete'], function (err, results) {
        //console.log(results[0]); // results contains rows returned by server
        //console.log(fields); // fields contains extra meta data about results, if available
        // If you execute same statement again, it will be picked from a LRU cache
        // which will save query preparation time and give better performance
        if (err)
            return res.send(err);
        //console.log(results);
        return res.status(200).json(results[0][0]); //내가 쿼리로 넘기는건 배열로 넘어 온다 배열 안되게 할 수 없나?          
    });
});
module.exports = router; //이거 없으면 에러 뜨는구나
