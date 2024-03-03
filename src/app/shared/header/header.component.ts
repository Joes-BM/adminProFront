import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {
  
  // public imgUrl='';
  public usuario:Usuario;
  constructor(private usuarioServide:UsuarioService) {
    // this.imgUrl=usuarioServide.usuario.imagenUrl;
    this.usuario=usuarioServide.usuario;
   }

  ngOnInit(): void {
  }
  logout(){
    this.usuarioServide.logout();
  }

}
