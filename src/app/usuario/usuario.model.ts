import {Clube} from "../clube/clube.model";

export interface Usuario {
        US_USID: number,
        US_USLOGIN: string,
        US_USSENHA: string,
        US_USATIVO: boolean,
        US_USNOMETRATAMENTO: string,
        US_CLID : number,
        OBJ_CLUBE : Clube,
        US_GUID : number,
        OBJ_GRUPOUSUARIO : GrupoUsuario,
        US_USEMAIL : string,
        US_USDATACADASTRO : string
    }

    export interface GrupoUsuario{
            GU_GUID: number,
            GU_GUDESCRICAO: string,
            GU_GUATIVO: string,
            GU_GUDATACADASTRO : string
}