import { Competicao, Rodadas } from './../competicao/competicao.model';
import { Clube } from './../clube/clube.model';

export interface Jogos{
    JG_JGID : number,
    JG_CPID: number,
    OBJ_COMPETICAO : Competicao,
    JG_CLID1 : number,
    OBJ_CLUBE1 : Clube,
    JG_JGPTS1 : number,
    JG_JGPG1 : number,
    JG_JGSG1 : number,
    JG_JGVITORIA1 : number,
    JG_JGEMPATE1 : number,
    JG_DERROTA1 : number,
    JG_CLID2 : number,
    OBJ_CLUBE2 : Clube,
    JG_JGPTS2 : number,
    JG_JGPG2 : number,
    JG_JGSG2 : number,
    JG_JGVITORIA2 : number,
    JG_JGEMPATE2 : number,
    JG_DERROTA2 : number,
    JG_JGATIVO : boolean,
    JG_JGDATACADASTRO : string
}
