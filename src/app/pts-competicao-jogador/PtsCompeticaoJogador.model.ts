import { Competicao } from './../competicao/competicao.model';
import {Jogador} from "../jogadores/jogador.model";

export interface PtsCompeticaoJogador{
    PJ_PJID : number,
    PJ_CPID : number,
    PJ_JGID : number,
    OBJ_COMPETICAO : Competicao,
    PJ_JOMATRICULA : number,
    PJ_JOID : number,
    OBJ_JOGADOR : Jogador,
    PJ_PJCOLOCACAO : number,
    PJ_PJPONTOSGANHOS : number,
    PJ_PJJOGOS : number,
    PJ_PJVITORIAS : number,
    PJ_PJEMPATE : number,
    PJ_PJDERROTA : number,
    PJ_PJGOLSPRO : number,
    PJ_PJGOLCONTRA : number,
    PJ_PJSALDOGOLS : number,
    PJ_PJPONTOS : number,
    PJ_PJOBSERVACAO : string,
    PJ_PJATIVO : boolean,
    PJ_PJDATACADASTRO : string
}

