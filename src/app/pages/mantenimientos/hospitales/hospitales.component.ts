import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import {  HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit {
  imgSubs:Subscription;
  public hospitales:Hospital[]=[];
  public cargando:boolean=true;
  constructor(private hospitalService: HospitalService,
            private modalImagenService:ModalImagenService,
            private busquedasService: BusquedasService
  ) { }

  ngOnInit(): void {
    this.cargarHospitales();

    this.imgSubs=this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe(img=>{
      this.cargarHospitales()
    });
  }
  buscar(termino:string){
    if (termino.length===0){
      return this.cargarHospitales();
    }

    this.busquedasService.buscar('hospitales',termino)
    .subscribe(resp=>{
      this.hospitales=resp;
    })
  }
  cargarHospitales(){
    this.cargando=true;
    this.hospitalService.cargarHospitales()
    .subscribe(hospitales=>{
      console.log(hospitales);
      this.cargando=false;
      this.hospitales=hospitales
    })
  }
  actualizarHospital(hospital:Hospital){
    this.hospitalService.actualizarHospital(hospital._id,hospital.nombre)
      .subscribe(resp=>{
        Swal.fire('Actuzalizado',hospital.nombre,'success')
      })
  }

  borrarHospital(hospital:Hospital){
    this.hospitalService.borrarHospital(hospital._id)
      .subscribe(resp=>{
        this.cargarHospitales();
        Swal.fire('Borrado',hospital.nombre,'success')
      })
  }
  async crearHospital(){

    const  {value=''}  = await Swal.fire<string>({
      title:"Hospital",
      input: "text",
      inputLabel: "Crear Hospital",
      inputPlaceholder: "ingrese nombre del hospital",
      showCancelButton: true,
    });
    // console.log(value);
    if(value.trim().length>0){
      this.hospitalService.crearHospital(value)
      .subscribe((resp:any)=>{
        this.hospitales.push(resp.hospital)
      })
    }
  }
  abrirModal(hospital:Hospital){
    this.modalImagenService.abrirModal('hospitales',hospital._id,hospital.img);
  }
}
