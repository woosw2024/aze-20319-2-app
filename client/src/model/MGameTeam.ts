
//team data 등록시
export type gameTimeRegister = {
  gtdIdx:number;
  gtIdx:number;
  teamName:string;
  teamData:teamData[];
}

//team 리스트
export type gameTeamList = {
  lolNick:string;
  teamName:string;
  teamCode:string;
}

// 팀등록시 teamData 참조
export type teamData = {
  userIdx : string;
  lolNick: string;
}


// 팀등록시 teamData 참조
export type gameTeamData = {
  userIdx: string;
  lolNick: string;
  bossFlag: string;
  userPoint: number;
  label?:string;
  value?:string;
}

export type gameTeamCode = Omit<gameTeamList,'lolNick'>



