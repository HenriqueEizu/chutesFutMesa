export interface Clube{
    CL_CLID : number,
    CL_CLNOME  : string,
    CL_CLENDERECO    : string,
    CL_CLCIDADE : string,
    CL_CLUF : string,
    CL_CLATIVO : boolean,
    CL_CLSIGLA  : string,
    CL_CLEMBLEMA : string,
    CL_CLEMAIL : string,
    CL_CLRESPONSAVEL : string,
    CL_CLDATACADASTRO : string,
    CL_CLTELEFONE : string,
}

export interface Estado{
    UF_UFID : Number,
    UF_UFNOME : string,
    UF_UFSIGLA : string
}