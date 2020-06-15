import { Jogador } from './../jogadores/jogador.model';

// export interface CATEGORIAJOGO{
//     CJ_CJID : number,
//     CJ_CJDESCRICAO : string,
//     CJ_CJATIVO : boolean,
//     CJ_CJDATACADASTRO : string
// }

export interface Jogos{
    JG_JGID : number,
    JG_JGDATA : Date,
    // JG_CJID : number,
    // OBJ_CATEGORIAJOGO : CATEGORIAJOGO
    JG_JOID1 : number,
    OBJ_JOGADOR1 : Jogador
    JG_JGGOL1 : number,
    JG_JGVITORIA1 : number,
    JG_JGEMPATE1 : number,
    JG_DERROTA1 : number,
    JG_JOID2 : number,
    OBJ_JOGADOR2 : Jogador
    JG_JGGOL2 : number,
    JG_JGVITORIA2 : number,
    JG_JGEMPATE2 : number,
    JG_DERROTA2 : number,
    JG_JGATIVO : boolean,
    JG_JGDATACADASTRO : string
}
