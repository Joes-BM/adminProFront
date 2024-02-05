import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
declare const google:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements AfterViewInit {
  @ViewChild('googeBtn') googleBtn:ElementRef;

  public loginForm = this.fb.group({
    // email:['prueba1@gmail.com', [Validators.required, Validators.email] ],
    // password:['123456', Validators.required ],
    email:[localStorage.getItem('email') || '', [Validators.required, Validators.email] ],
    password:['', Validators.required ],
    remember:[false, Validators.required ]
  });

  constructor( private router: Router,
               private fb: FormBuilder,
               private usuarioService: UsuarioService ) { 
                
               }


  ngAfterViewInit(): void {
    // ciclo de vida  - el componente ya esta Inicializado
    // aqui va el proceso de construccion de la elaboracion del boton google
    this.googleInit();
  }
  googleInit(){
    google.accounts.id.initialize({
      client_id: "991329521961-m85mpbme0bhou5dgbterr01mkoq70svu.apps.googleusercontent.com",
      // callback: this.handleCredentialResponse
      callback: (response:any)=>this.handleCredentialResponse(response)

    });
    google.accounts.id.renderButton(
      // document.getElementById("buttonDiv"),
      this.googleBtn.nativeElement,
      { theme: "outline", size: "large" }  // customization attributes
    );
  }
  handleCredentialResponse(response:any){
    console.log("Encoded JWT ID token: " + response.credential);
    this.usuarioService.loginGoogle(response.credential)
      .subscribe(resp=>{
        // console.log({login:resp});
        this.router.navigateByUrl('/');
      })
  }
  login() {
    this.usuarioService.loginUsuario(this.loginForm.value)
    .subscribe(resp=>{
      if (this.loginForm.get('remember').value){
        localStorage.setItem('email',this.loginForm.get('email').value)
      }else{
        localStorage.removeItem('email');
      }
      // console.log(resp)
    }, (err)=>{
      Swal.fire('Error',err.error.msg,'error');      
    })
    
    //this.router.navigateByUrl('/');
  }

}
