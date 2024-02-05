import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router,  } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { UsuarioService } from '../services/usuario.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AutgGuard implements CanActivate {
  constructor( private usuarioService:UsuarioService,
               private router:Router){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      return this.usuarioService.validarToken()
      .pipe(
        tap( estaAutenticado=>{
          if(!estaAutenticado){
            this.router.navigateByUrl('/login')
          }
        })
      )
  }
  
}
