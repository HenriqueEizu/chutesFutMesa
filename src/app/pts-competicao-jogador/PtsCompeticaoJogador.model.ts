import { Competicao } from './../competicao/competicao.model';
import {Jogador} from "../jogadores/jogador.model";

export interface PtsCompeticaoJogador{
    PJ_PJID : number,
    PJ_CPID : number,
    OBJ_COMPETICAO : Competicao,
    PJ_JOID : number,
    OBJ_JOGADOR : Jogador,
    PJ_PJPONTOS : number,
    PJ_PJOBSERVACAO : string,
    PJ_PJATIVO : boolean,
    PJ_PJDATACADASTRO : string
}

