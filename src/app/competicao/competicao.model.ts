
export interface Categoriajogo{
    CJ_CJID : number,
    CJ_CJDESCRICAO : string,
    CJ_CJATIVO : boolean,
}    
 
export interface Rodadas {
        RO_ROID : number,
        RO_RODESCRICAO : string,
        RO_ROATIVO : boolean,
		RO_RODATACADASTRO : string
}

export interface Competicao{
    CP_CPID : number,
    CP_CPDESCRICAO : string,
    CP_CPCIDADE : string,
    CP_ROID : number,
    OBJ_Rodada : Rodadas,
    CP_CPDATALIMITEAPOSTA : string,
    CP_CPDATAINICIO : string,
    CP_CJID : number,
    OBJ_CATEGORIAJOGADOR : Categoriajogo,
    CP_CPATIVO : boolean,
    CP_CPDATACADASTRO : string
    CP_CPFOTO : string
}
 