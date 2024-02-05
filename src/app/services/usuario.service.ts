import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterForm } from '../interfaces/register-form.interface';
import {  LoginForm } from '../interfaces/login-form.interface';
import { environment } from 'src/environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

declare const google:any;

const base_url=environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {


  constructor(private http: HttpClient,
              private router:Router ) { }

  logout(){
    localStorage.removeItem('token');
    google.accounts.id.revoke('ibuss.sac@gmail.com',()=>{

      this.router.navigateByUrl('/login');
    })

  }

  validarToken():Observable<boolean>{
    const token=localStorage.getItem('token') || '';
    return this.http.get(`${base_url}/login/renew`,{
      headers:{
        'x-token':token
      }
    }).pipe(
      tap((resp:any)=>{
        localStorage.setItem('token',resp.token)
      }),
      map(resp=>true),
      catchError(error=>of(false))
    )
  }

  crearUsuario(formData: RegisterForm ){
    return this.http.post(`${base_url}/usuarios`,formData)
    .pipe(
      tap((resp:any)=>{
        // console.log(resp);
        localStorage.setItem('token',resp.token)
      })
    )
  }
  loginUsuario(formData: LoginForm){
    return this.http.post(`${base_url}/login`,formData)
    .pipe(
      tap((resp:any)=>{
        // console.log(resp);
        localStorage.setItem('token',resp.token)
        this.router.navigateByUrl('/dashboard');

      })
    )
  }
  loginGoogle(token:string){
    return this.http.post(`${base_url}/login/google`,{token})
    .pipe(
      tap((resp:any)=>{
        // console.log(resp);
        localStorage.setItem('token',resp.token)

        this.router.navigateByUrl('/dashboard');

      })
    )
  }
}
