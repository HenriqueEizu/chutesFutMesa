import { Competicao } from "../competicao/competicao.model";
import { Jogador } from "../jogadores/jogador.model";


export class Inscricao {
        // IS_ISID: number,
        // IS_JOID: number,
        // IS_CPID: number,
        // OBJ_JOGADOR : Jogador,
        // OBJ_COMPETICAO : Competicao,
        // IS_ISDATACADASTRO : string,

        public IS_ISID : number;
        get _IS_ISID(): number {return this.IS_ISID;}
        set _IS_ISID(p : number) {this.IS_ISID = p; }

        public IS_JOID : number;
        get _IS_JOID(): number {return this.IS_JOID;}
        set _IS_JOID(p : number) {this.IS_JOID = p; }

        public IS_CPID : number;
        get _IS_CPID(): number {return this.IS_CPID;}
        set _IS_CPID(p : number) {this.IS_CPID = p; }

        public IS_CLID : number;
        get _IS_CLID(): number {return this.IS_CLID;}
        set _IS_CLID(p : number) {this.IS_CLID = p; }
      
        public OBJ_JOGADOR : Jogador;
        get _OBJ_JOGADOR(): Jogador {return this.OBJ_JOGADOR;}
        set _OBJ_JOGADOR(p : Jogador) {this.OBJ_JOGADOR = p; }

        public OBJ_COMPETICAO : Competicao;
        get _OBJ_COMPETICAO(): Competicao {return this.OBJ_COMPETICAO;}
        set _OBJ_COMPETICAO(p : Competicao) {this.OBJ_COMPETICAO = p; }

        public IS_ISDATACADASTRO : string;
        get _IS_ISDATACADASTRO(): string {return this.IS_ISDATACADASTRO;}
        set _IS_ISDATACADASTRO(p : string) {this.IS_ISDATACADASTRO = p; }

        public IS_ISDIA : string;
        get _IS_ISDIA(): string {return this.IS_ISDIA;}
        set _IS_ISDIA(p : string) {this.IS_ISDIA = p; }
}