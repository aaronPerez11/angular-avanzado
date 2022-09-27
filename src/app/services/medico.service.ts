import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Medico } from '../models/medico.model';

const base_url = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor(private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }


  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }



  cargarHospitales(){
    const url = `${ base_url }/medicos`;
    return this.http.get<{ok: boolean, medico: Medico[] }>( url, this.headers)
      .pipe(
        map( (resp: {ok: boolean, medico: Medico[] }) => resp.medico)
      );
  }

  crearMedico(medico: {nombre: string, hospital: string}){
    const url = `${ base_url }/medicos`;
    return this.http.post( url, medico, this.headers);
  }

  obtenerMedicoById(_id: string){
    const url = `${ base_url }/medicos/${ _id}`;
    return this.http.get<{ok: boolean, medico: Medico }>( url,this.headers)
    .pipe(
        map( (resp: {ok: boolean, medico: Medico }) => resp.medico)
    );
  }

  actualizarMedico( medico: Medico){
    const url = `${ base_url }/medicos/${medico._id}`;
    return this.http.put( url, medico ,this.headers);
  }

  eliminarMedico(_id: string){
    const url = `${ base_url }/medicos/${ _id}`;
    return this.http.delete( url,this.headers);
  }
}
