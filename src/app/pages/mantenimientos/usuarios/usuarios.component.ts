import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];

  public desde: number = 0;
  public cargando: boolean = true;
  public imgSubs: Subscription;

  constructor( private usuarioService: UsuarioService,
      private busquedaService: BusquedasService,
      private modalImagenService: ModalImagenService) { }

  ngOnInit(): void {

   this.cargarUsuarios();
   this.modalImagenService.nuevaImagen
   .pipe(
    delay(100)
   )
   .subscribe(img => {
    this.cargarUsuarios()
  });
  }

  ngOnDestroy(): void {
      this.imgSubs.unsubscribe();
  }

  cargarUsuarios(){
    this.cargando = true
    this.usuarioService.cargarUsuarios(this.desde)
      .subscribe( ({total, usuarios}) => {
        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        this.cargando = false;
      })
  }

  cambiarPagina(valor:number){
    this.desde += valor;

    if(this.desde < 0){
      this.desde = 0;
    } else if (this.desde > this.totalUsuarios){
      this.desde -=  valor;
    }

    this.cargarUsuarios();
  }

  buscar(termino: string){
    if( termino.length === 0){
      this.usuarios = this.usuariosTemp;
    } else {
      this.busquedaService.buscar('usuarios', termino)
      .subscribe( (resultados: any[]) => {
        this.usuarios = resultados;
      })
    }

  }

  eliminarUsuario(usuario: Usuario){

    if( usuario.uid === this.usuarioService.uid){
      return Swal.fire('Error', 'No se puede eliminar el usuario', 'error');
    }

    return Swal.fire({
      title: '¿Borrar usuario?',
      text: `Esta apunto de borrar a ${ usuario.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar'
    }).then((result) => {
      if (result.isConfirmed) {
       this.usuarioService.eliminarUsuario(usuario)
       .subscribe( resp => {
         Swal.fire(
          'Eliminado',
          `${usuario.nombre} eliminado correctamente`,
          'success'
        )
        this.cargarUsuarios();
       })
      }
    })

  }


  cambiarRole(usuario: Usuario){
    console.log(usuario);
    this.usuarioService.guardarUsuario(usuario)
      .subscribe( resp => {
        console.log(resp);

      })
  }

  abrirModal( usuario: Usuario){
    this.modalImagenService.abrirModal('usuarios',usuario.uid || '', usuario.img);

  }
}
