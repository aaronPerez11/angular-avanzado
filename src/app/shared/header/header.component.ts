import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';


declare const google: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent {

  public usuario: Usuario;

  constructor(private usuarioService: UsuarioService,
              private router: Router,
              private ngZone: NgZone) {
                this.usuario = usuarioService.usuario;
                console.log(this.usuario);

              }


  logout(){
    this.usuarioService.logout();

    google.accounts.id.revoke('artej58@gmail.com', () => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      })
    })
  }



}
