import { Equipe } from './../equipe/equipe.model';
import { Jogador } from './../jogadores/jogador.model';

export interface EquipeJogador{
    EJ_EJID : number,
    EJ_EQID : number,
    OBJ_Equipe : Equipe,
    EJ_JOID : number,
    OBJ_Jogador : Jogador,
    EJ_EJOBSERVACAO : string,
    EJ_EJATIVO : boolean,
    EJ_EJDATACADASTRO : string
}  