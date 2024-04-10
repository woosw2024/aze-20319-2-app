
export type gamePlaySubmit = {
   gameInfo : {  
     gtdIdx : number;
     gtdTitle:string;
     gtIdx : number;    
     setNum:string;
     GameTime:string;
     gameDate:string;
     gameRs:boolean
   }
   blueTeam : TeamDetail
   redTeam : TeamDetail
 }
 
 export type TeamDetail = {
   teamCode:string;
   teamName:string;    
   teamUser:string[];
   teamPositon:string[];
   teamCheckbox:string[];
   teamKillNum:string[];
   teamDeathNum:string[];
   teamAssNum:string[];
   champEng:string[];  
   banChamp:string[];
   penaltyChamp:string[];
   teamMvp:string; 
   assignFlag:string[];
 }
 

 export type gamePlayList = {
   gwCode:number 
   gameDate:string, 
   gameTime:string, 
   gwdSetNo:number , 
   redTeamName:string,
   blueTeamName:string,
   redTeamCode:string,
   blueTeamCode:string,
   redTeamAllPoint:number,
   blueTeamAllPoint:number,			
   redTeamUser:string,
   blueTeamUser:string 
 }

 //기본값 셋팅
export const teamDefaultValue = {
   teamCode:'', teamName:'', teamUser:[], teamPositon:[], teamCheckbox:[], teamKillNum:[],
   teamDeathNum:[], teamAssNum:[], champEng:[], banChamp:[], penaltyChamp:[], teamMvp:'', assignFlag:[]
 }
 