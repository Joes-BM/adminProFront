import { Component, OnInit } from '@angular/core';

import{ MedicoService } from'../../../services/medico.service';
import { Medico } from 'src/app/models/medico.model';
import { Subscription } from 'rxjs';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit {
  imgSubs:Subscription;
  public medicos:Medico[]=[];
  public cargando:boolean=true;
  constructor(private medicoService: MedicoService,
              private modalImagenService:ModalImagenService,
              private busquedasService:BusquedasService

  ) { }

  ngOnInit(): void {
    this.cargarMedicos();
    this.imgSubs=this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe(img=>{
      this.cargarMedicos()
    });
  }
  cargarMedicos(){
    this.medicoService.cargarMedicos()
    .subscribe(medicos=>{
      console.log(medicos);
      this.cargando=false;
      this.medicos=medicos;
      
    })
  }
  buscar(termino:string){
    if (termino.length===0){
      return this.cargarMedicos();
    }

    this.busquedasService.buscar('medicos',termino)
    .subscribe(resp=>{
      this.medicos=resp;
    })
  }
  abrirModal(medico:Medico){
    this.modalImagenService.abrirModal('medicos',medico._id,medico.img);
  }
  borrarMedico(medico:Medico){
    Swal.fire({
      title: "Eliminar Médico?",
      text: `esta seguro de eliminar a ${medico.nombre}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Si, Eliminarlo"
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.borrarMedico(medico._id)
        .subscribe((resp:any)=>{
          this.cargarMedicos();          
          Swal.fire({
            title: "Médico Eliminado",
            text: `${medico.nombre} fue eliminado correctamente`,
            icon: "success"
          });
        })
      }
    });
  }

}
