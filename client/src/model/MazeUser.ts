export type ModelAzeUser = {
  userIdx : number;
  lolNick: string;
  outFlag: string;
  regDate: string
}


export type ModelAzeUserInput = Omit<ModelAzeUser,'userIdx'|'outFlag'|'regDate'>
export type ModelAzeUserDel = Omit<ModelAzeUser, 'outFlag'|'regDate'>
export type ModelAzeUserProp = Omit<ModelAzeUser, 'regDate'>
