
export type MgameTitle = {
    id:number;
    gameTitle:string;
    done:boolean;
}[]


export type MgameTitlePost = {
    id:number;
    gameTitle:string;
    done:boolean;
}



// 게임 정보 타이틀 리스트
export type MgameDetailList = {
    mainId : number;
    id:number;
    subGameTitle:string;
    done:boolean;
}[]


// 게임정보 타이틀 입력
export type MgameDetailPost = {
    mainId : number;
    subGameTitle:string;
    done:boolean;
}

//export type detailPostWithoutId = Omit<MgameDetailPost,'id'>