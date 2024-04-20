import { environment } from "src/environments/environment";
const base_url=environment.base_url
export class Usuario{
    constructor(
        public nombre:string,
        public email:string,
        public password?:string,
        public role?:string,
        public img?:string,
        public google?:boolean,
        public uid?:string
    ){}
    imprimirUsuario(){
        console.log(this.nombre);
    }
    get imagenUrl() {
        // /upload/usuarios/0192cf88-7c2b-4c1b-ada9-e7d7c8693b30.jpg
        if (!this.img){
            return `${base_url}/upload/usuarios/no-image`;
        } else if(this.img.includes('https')){
            return this.img
        } else if (this.img){
            return `${base_url}/upload/usuarios/${this.img}`;
        }else{
            return `${base_url}/upload/usuarios/no-image`;

        }
    }
}