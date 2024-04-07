export type ModelGameTitle = {
    gtIdx : number;
    gtTitle:string;
}

export type ModelGameTitleInput = Omit<ModelGameTitle,'gtIdx'>


export type ModelGameTitleDetail = {
    gtdIdx: number;
    gtIdx : number;
    gtdTitle:string;
}

export type ModelGameTitleDetailInput = Omit<ModelGameTitleDetail,'gtdIdx'>

/* 
export type MgameTitleList = {
    id:number;
    gameTitle:string;
    done:boolean;
}[]

//export type detailPostWithoutId = Omit<MgameTitle,'done'>

// 자식 한테 넘겨줄 형식
export type MgameTitleDetail = {
    propId:number;
    propGameTitle:string;
}


// 자식 리스트
export type MgameTitleDetailList = {
    mainId:number,
    id:number;
    subGameTitle:string;
    done:boolean;
}[]

//입력을 위한 정보  DB로 하면 쉽게 될껀데  json으로 할려고 하다 보니
export type MgameDetainInput = {
    mainId:number,
    subGameTitle:string;
    done:boolean;
}
 */