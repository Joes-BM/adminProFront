import { Component, OnInit } from '@angular/core';
import { ModalImagenService } from '../../services/modal-imagen.service'
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {
  // public ocultarModal:boolean=false;
  public usuario:Usuario;
  public imagenSubir:File;
  public imgTemp:any;

  constructor(public modalImagenService: ModalImagenService,
              private fileUploadService: FileUploadService
  ) { }

  ngOnInit(): void {
  }
  cerrarModal(){
    // this.ocultarModal=true;
    this.imgTemp=null;
    this.modalImagenService.cerrarModal();
  }
  cambiarImagen(file:File){
    this.imagenSubir=file;
    if (!file){
      return this.imgTemp=null;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend=()=>{
      console.log(reader.result);
      this.imgTemp=reader.result;
    }
  }
  subirImagen(){
    const id= this.modalImagenService.id;
    const tipo= this.modalImagenService.tipo;
    this.fileUploadService.actualizarFoto(this.imagenSubir,tipo,id)
    .then(img=>{
      Swal.fire('Guardado','Imagen de Usuario Actualizado','success');
      
      this.modalImagenService.nuevaImagen.emit(img);
      
      this.cerrarModal();
    }).catch(err=>{
      console.log(err);
      
      Swal.fire('Error','No se pudo subir la imagen','error');

    })
    
  }
}
