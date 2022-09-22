import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';

import { catchError, map, tap } from 'rxjs/operators';

import { LoginForm } from '../interfaces/login-form-interface';
import { RegisterForm } from '../interfaces/register-form.interface';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';

const base_url = environment.baseUrl;
declare const gapi:any;
declare const google:any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2:any;
  public usuario: Usuario;

  constructor( private http: HttpClient,
                private router: Router,
                private ngZone: NgZone) {


                 }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid || '';
  }
  logout(){
    localStorage.removeItem('token');
    google.accounts.id.disableAutoSelect();
  }

  vaidarToken(): Observable<boolean> {


    return this.http.get( `${ base_url }/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( (resp:any) => {
        const {
          email,
          google,
          nombre,
          role,
          img = '',
          uid
        } = resp.usuario;
        this.usuario = new Usuario( nombre, email, '', img, google, role, uid);
        localStorage.setItem('token', resp.token)
        return true;
      }),
      catchError( error => of(false) )
    );
  }

  crearUsuario( formData: RegisterForm ){

    return this.http.post( `${ base_url }/usuarios`, formData)
            .pipe(
              tap( (resp: any) => {
                localStorage.setItem('token', resp.token)

              })
            )

  }

  login( formData: LoginForm ){

    return this.http.post( `${ base_url }/login`, formData)
      .pipe(
        tap( (resp: any) => {
          localStorage.setItem('token', resp.token)

        })
      )

  }

  loginGoogle( token: string){
    return this.http.post(`${ base_url }/login/google`, {token})
      .pipe(
        tap( (resp: any) => {
          localStorage.setItem('token', resp.token)
        })
      )
  }

  actualizarPerfil( data: {email: string, nombre: string, role: string}){

    data = {
      ...data,
      role: this.usuario.role || ''
    };
    return this.http.put( `${ base_url }/usuarios/${this.uid}`, data, {
      headers: {
        'x-token': this.token
      }
    })
  }
}
