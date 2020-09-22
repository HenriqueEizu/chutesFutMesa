import { Categoriajogo } from './../competicao/competicao.model';
import { Jogador } from './../jogadores/jogador.model';

export interface CategoriaJogador {
    CJ_CJID : number,
    CJ_CJDESCRICAO : string,
    CJ_CJOBSERVACAO : string,
    CJ_CJATIVO : boolean,
    CJ_CJDATACADASTRO : string
}

export interface RankingJogadores{
    RJ_RJID : number,
    RJ_RJMES : number,
    RJ_RJANO : number,
    RJ_RJDATA : string,
    RJ_JOID : number,
    OBJ_JOGADOR : Jogador,
    RJ_JOMATRICULA : number,
    RJ_RJPOSICAO : number,
    RJ_RJPOSICAOANO : number,
    RJ_RJPONTOS : number,
    RJ_CJID : Number,
    OBJ_CATEGORIAJOGADOR : CategoriaJogador,
    RJ_RJOBSERVACAO : string,
    RJ_RJATIVO : boolean,
    RJ_RJDATACADASTRO : string
}  