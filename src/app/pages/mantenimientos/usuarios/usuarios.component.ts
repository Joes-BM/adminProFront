import { Component, OnDestroy, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';


import Swal from 'sweetalert2'
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public usuarios: Usuario[]=[];
  public usuariosTmp:Usuario[]=[];
  public totalUsuarios: number=0;
  public desde:number=0;
  public cargando:boolean=true;
  public imgSubs:Subscription

  constructor(private usuarioServicde:UsuarioService,
              private busquedasService:BusquedasService,
              private modalImagenService:ModalImagenService ) { }
  ngOnDestroy(): void {
   this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    
    this.imgSubs=this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe(img=>{
      this.cargarUsuarios()
    });
  }
  cargarUsuarios(){
    this.cargando=true;
    this.usuarioServicde.cargarUsuarios(this.desde)
    .subscribe(({total,usuarios})=>{
      this.totalUsuarios=total;
      this.usuarios=usuarios;
      this.usuariosTmp=usuarios;
      this.cargando=false;

    });
  }
  cambiarPagina(valor:number){
    this.desde=valor;
    if (this.desde<0){
      this.desde=0
    }else if(this.desde>this.totalUsuarios){
      this.desde-=valor;
    }
    this.cargarUsuarios();
  }
  cambiarRole(usuario:Usuario){
    console.log(usuario);
    this.usuarioServicde.guardarUsuario(usuario)
    .subscribe(resp=>{
      console.log(resp);
      
    })
    
  }
  buscar(termino:string){
    // console.log(termino);
    if (termino.length===0){
      return this.usuarios=this.usuariosTmp;
    }

    this.busquedasService.buscar('usuarios',termino)
    .subscribe(resp=>{
      this.usuarios=resp;
    })
  }
  eliminarUsuario(usuario:Usuario){

    if(usuario.uid===this.usuarioServicde.uid){
      return Swal.fire({
        title: "Error",
        text: 'no se puede borrar asi mismo',
        icon: "error"
      });
    }

    Swal.fire({
      title: "Eliminar Usuario?",
      text: `esta seguro de eliminar a ${usuario.nombre}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Si, Eliminarlo"
    }).then((result) => {
      if (result.isConfirmed) {

        this.usuarioServicde.eliminarUsuario(usuario)
        .subscribe((resp:any)=>{
          this.cargarUsuarios();          
          Swal.fire({
            title: "Usuario Eliminado",
            text: `${usuario.nombre} fue eliminado correctamente`,
            icon: "success"
          });
        })
      }
    });
    
  }
  abrirModal(usuario:Usuario){
    this.modalImagenService.abrirModal('usuarios',usuario.uid,usuario.img);
    console.log(usuario);
    
  }
}
