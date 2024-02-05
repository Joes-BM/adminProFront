import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { UsuarioService } from '../../services/usuario.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css' ]
})
export class RegisterComponent implements OnInit {

  public formularioPosteado=false;

  public registerForm = this.fb.group({
    nombre:['Prueba', Validators.required ],
    email:['prueba100@gmail.com', [Validators.required, Validators.email] ],
    password:['123456', Validators.required ],
    password2:['1234567', Validators.required ],
    terminos:[false, Validators.required ]
  },{
    validators: this.passwordsIguales('password','password2')
  });
  
  constructor(private fb:FormBuilder,
              private usuarioService: UsuarioService ) { }

  crearUsuario(){
    this.formularioPosteado=true;
    console.log(this.registerForm.value);
    // if (this.registerForm.valid){
    //   console.log('Posteando Formulario');
    // }else{
    //   console.log('formulario NO ES CORRECTO');
    // }
    if (this.registerForm.invalid){
      return
    }
    //POSTEO
    this.usuarioService.crearUsuario(this.registerForm.value)
      .subscribe(resp=>{
        console.log('usuario creado');
        console.log(resp);
      },(err)=>{
        Swal.fire('Error',err.error.msg,'error')
      })


    
  }
  
  campoNoValido(campo:string):boolean{
    if(this.registerForm.get(campo).invalid && this.formularioPosteado){
      return true;
    }else{
      return false;
    }
  }
  aceptaTerminos(){
    return !this.registerForm.get('terminos').value && this.formularioPosteado
  }
  contrasenasInvalidas(){
    const pass1=this.registerForm.get('password').value;
    const pass2=this.registerForm.get('password2').value;
    if((pass1!==pass2)&&this.formularioPosteado){
      return true;
    }else{
      return false;
    }

  }

  passwordsIguales(p1:string,p2:string){

    return (formGroup:FormGroup)=>{
      const p1Control=formGroup.get(p1);
      const p2Control=formGroup.get(p2);
      if(p1Control.value===p2Control.value){
        p2Control.setErrors(null);
      }else{
        p2Control.setErrors({noEsIgual:true})
      }
    }
  }
  ngOnInit(): void {
  }

}
