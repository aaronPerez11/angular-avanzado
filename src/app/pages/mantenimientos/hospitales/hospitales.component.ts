import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Hospital } from 'src/app/models/Hospital.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  private imgSubs: Subscription;

  constructor(private hospitalService: HospitalService,
      private modalImagenService: ModalImagenService,
      private busquedaService: BusquedasService) { }

  ngOnInit(): void {
    this.cargarHospitales();

    this.imgSubs = this.modalImagenService.nuevaImagen
   .pipe(
    delay(100)
   )
   .subscribe(img => this.cargarHospitales());
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
}

  cargarHospitales(){
    this.cargando= true;

    this.hospitalService.cargarHospitales()
      .subscribe( hospitales => {
       this.cargando = false;
       this.hospitales = hospitales

      }, ( error) => {
        console.log(error);
        this.cargando = false;
      })
  }

  guardarCambios(hospital: Hospital){
    this.hospitalService.actualizarHospital(hospital._id, hospital.nombre)
      .subscribe( resp => {
        Swal.fire('Actualizado', hospital.nombre, 'success')
      }, ( error) => {
        console.log(error);
      })

  }

  eliminarHospital(hospital: Hospital){
    this.hospitalService.elimarHospital(hospital._id)
      .subscribe( resp => {
        this.cargarHospitales();
        Swal.fire('Eliminado', hospital.nombre, 'success')
      }, ( error) => {
        console.log(error);
      })

  }

  async abrirSweetAlert(){
    const { value } = await Swal.fire<string>({
      title: 'Crear Hospital',
      text: 'Ingrese el nuevo nombre del hospital',
      input: 'text',
      inputPlaceholder: 'Ingresar nombre del hospital',
      showCancelButton: true,
    })

    if( value?.trim().length || 0 > 0){

      this.hospitalService.crearHospital(value || '')
      .subscribe( (resp: any) => {
        this.hospitales.push( resp.hospital)

      })

    }

  }

  abrirModal( hospital: Hospital){
    this.modalImagenService.abrirModal('hospitales',hospital._id || '', hospital.img);

  }

  busquedaHospital( termino: string){

    if( termino.length === 0){
      this.cargarHospitales();
    } else {
      this.busquedaService.buscar('hospitales',termino)
        .subscribe( (resp: any) => {
         this.hospitales = resp
        }, ( error) => {
          console.log(error);

        })
    }

  }

}
