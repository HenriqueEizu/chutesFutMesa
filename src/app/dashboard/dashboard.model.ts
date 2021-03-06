
export interface ApuracaoJogadores{
    AJ_AJID : number,
    AJ_AJDATAVIGENTE : Date,
    AJ_CPID : number,
    AJ_CPDESCRICAO : string,
    AJ_ROID : number,
    AJ_RODESCRICAO : string,
    AJ_JOID : number,
    AJ_JOAPELIDO : string,
    AJ_EQID : number,
    AJ_EQNOME : string,
    AJ_USID : number,
    AJ_USNOMETRATAMENTO : string,
    AJ_AJPONTOS : number,
    AJ_EQESCUDO : string,
    AJ_CLID  : number,
    AJ_CLSIGLA : string,
    AJ_CLEMBLEMA : string,
    AJ_JOFOTO: string
}

export interface PARAMETROSSISTEMAS {
    PS_PSID : number,
    PS_PSDESCRICAO : string,
    PS_PDDATAINICIOTEMPORADA : Date,
    PS_PDDATAFIMTEMPORADA :  Date,
    PS_PSOBSERVACAO : string,
    PS_PSATIVO : boolean,
    PS_PSDATACADASTRO : Date
}