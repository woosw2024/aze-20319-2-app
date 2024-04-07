"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
//import gameTitleApi from './gameTitle'
//const boardApi = require('./board/index');
const app = (0, express_1.default)();
const gameTitleApi = require("./gameTitle");
const gameTitleDetailApi = require("./gameTitleDetail");
const azeUserApi = require("./azeUser");
const gameTeamApi = require("./gameTeam");
const gamePlayApi = require("./gamePlay");
//const port = 4000;
const cors = require('cors');
//app.use(cors({ origin: 'http://localhost:3000', credentials: true}));  
app.use(cors());
//TODO Cannot set headers after they are sent to the client 에러 발생
//난 클라이언트에서 같은 API를 두번 호출 하는 경우가 없는데 왜 발생 하지? 
// Content-Type: application/json 형태 일때 시작 
// import 하는 부분
const bodyParser = require("body-parser"); // 이게 존재 해야 값을 받을 수 있다  
// 아랫부분 적당한 위치에 추가
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express_1.default.json());
// Content-Type: application/json 형태 일때 끝  
//TODO 외부에서 접근이 된다 접근 안된게 하는 방법
//// 게임대회 타이틀  api 별도 파일에서 작동 하도록 함
app.use('/api/gameTitle', gameTitleApi); //대회관리
app.use('/api/gameTitleDetail', gameTitleDetailApi); //대회상세관리
app.use('/api/azeUser', azeUserApi); //회원관리
app.use('/api/gameTeam', gameTeamApi); //대회팀관리
app.use('/api/gamePlay', gamePlayApi); //경기관리
/* app.get('/', (req: Request, res: Response) => {
  res.send('Typescript + Node.js + Express Server 111');
});
 */
//TODO Cannot set headers after they are sent to the client 오류 찾기
/*
errorno: 'ETIMEDOUT',
code: 'ETIMEDOUT',
syscall: 'connect',
fatal: true
==============
ERR_HTTP_HEADERS_SENT
throw new ERR_HTTP_HEADERS_SENT('set');
============
*/
//실서버에 올릴때는 풀기 서버에서 마음대로 쓸수 있게 입력 24.03.28
app.use(express_1.default.static(path_1.default.join(__dirname, 'build')));
app.get('/*', function (req, res) {
    res.sendFile(path_1.default.join(__dirname, '/build', 'index.html'));
});
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`[server]: Server is running at <https://localhost>:${PORT}`);
    //console.log(`[server]: Server is running at ${process.env.REACT_APP_API_ROOT}:${PORT}`);
});
// client build -> build 폴더 -> server 폴더로 복사  -> 서버를 실행
//클라이언트 폴더에서 할꺼
// npm ci 를 통해서 node_modules 폴더 만듬
// npm run bulid 빌드를 함
// client/build -> server/build 폴더로 이동
// server 폴더로 이이동
// npm ci
// tsc 로 컴파일 한다
// node index.js를 하면 서버가 실행 된다 (난 왜 app.ts 가 없을까?)
