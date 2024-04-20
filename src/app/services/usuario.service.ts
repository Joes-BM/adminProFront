import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterForm } from '../interfaces/register-form.interface';
import {  LoginForm } from '../interfaces/login-form.interface';
import {cargarUsuarios } from '../interfaces/cargar-usuarios.interface'
import { environment } from 'src/environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model'

declare const google:any;

const base_url=environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  public usuario: Usuario;


  constructor(private http: HttpClient,
              private router:Router ) { }

  get token(){
    return localStorage.getItem('token') || '';
  }
  get uid(){
    return this.usuario.uid || '';
  }
  get headers(){
    return {
      headers:{
        'x-token':this.token
      }
    }
  }
  logout(){
    localStorage.removeItem('token');
    google.accounts.id.revoke('ibuss.sac@gmail.com',()=>{
      this.router.navigateByUrl('/login');
    })

  }
  actualizarPerfil(data:{email:string, nombre:string, role:string}){
    data={
      ...data,
      role:this.usuario.role
    }
    // console.log("datass",data);
    return this.http.put(`${base_url}/usuarios/${this.uid}`,data,this.headers);
  }
  validarToken():Observable<boolean>{
    return this.http.get(`${base_url}/login/renew`,{
      headers:{
        'x-token':this.token
      }
    }).pipe(
      map((resp:any)=>{

        const { email, google, img='', nombre, role, uid } = resp.usuario;
        this.usuario = new Usuario( nombre, email,'', role, img, google, uid );
        this.usuario.imprimirUsuario();
        localStorage.setItem('token',resp.token);
        return true;
      }),
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
  // private transformarUsuarios(resultados:any[]):Usuario[]{
  //   return resultados.map(
  //     user=>new Usuario(user.nombre,user.email,'',user.role,user.img,user.google,user.uid)
  //   );
  // }
  cargarUsuarios(desde:number){
    const url=`${base_url}/usuarios?desde=${desde}`
    return this.http.get< cargarUsuarios >(url,this.headers)
      .pipe(  
        map(resp=>{
          const usuarios=resp.usuarios.map(
              user=>new Usuario(user.nombre,user.email,'',user.role,user.img,user.google,user.uid)
          );         
          
          return {
            total:resp.total,
            usuarios
          };

        })
      )
  }
  eliminarUsuario(usuario:Usuario){
    //localhost:3005/api/usuarios/65961f0a45f0f831a1461367
    const url=`${base_url}/usuarios/${usuario.uid}`
    return this.http.delete(url,this.headers)
  }
  guardarUsuario(usuario:Usuario){
    return this.http.put(`${base_url}/usuarios/${usuario.uid}`,usuario,this.headers);
  }
}
