import { Jogador } from './../jogadores/jogador.model';
import { Usuario } from './../usuario/usuario.model';

export interface Equipe{
    EQ_EQID  : number,
    EQ_EQNOME : string,
    EQ_USID : number,
    OBJ_USUARIO : Usuario
    OBJ_JOGADOR : Jogador,
    EQ_EQESCUDO : string,
    EQ_EQOBSERVACAO : string,
    EQ_EQATIVO : boolean,
    EQ_EQDATACADASTRO : string
}  

export interface ImagemEscudo{
    IM_IMIG : number,
    IM_IMPATH :string,
    IM_IMOBSERVACAO :string,
    IM_IMATIVO : boolean,
    IM_IMDATACADASTRO : string
}

export interface RankingJogadorStatus{
    JO_JOID : number,
    JO_JOAPELIDO : string,
    JO_JOFOTO : string,
    RJ_RJDATA : Date,
    PR_PRPRECO : number,
    RJ_RJPOSICAOATUAL : number,
    RJ_RJPOSICAO : number,
    STATUSPOSICAO : string,
    POSICOES : number,
    CL_CLID : number,
    CL_CLEMBLEMA : string,
    CL_CLSIGLA : string,
    JO_JOATIVO : boolean
}