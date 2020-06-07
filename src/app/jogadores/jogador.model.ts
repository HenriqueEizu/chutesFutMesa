import {Clube} from "../clube/clube.model";

export interface Jogador {
        JO_JOID: number,
        JO_JONOME: string,
        JO_JOFOTO: string,
        JO_JOAPELIDO: string,
        JO_JOATIVO: boolean,
        JO_CLID : number,
        OBJ_CLUBE : Clube,
        JO_JODATACADASTRO : string
    }