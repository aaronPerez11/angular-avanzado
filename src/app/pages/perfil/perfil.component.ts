import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm: FormGroup;
  public usuario: Usuario;
  public imagenSubir: File;
  public imagenTemp: any;

  constructor(private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService) {

    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {

    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]]
    });
  }

  actualizarPerfil() {
    this.usuarioService.actualizarPerfil(this.perfilForm.value)
      .subscribe((resp: any) => {

        const { nombre, email } = resp.usuario;
        this.usuario.nombre = nombre;
        this.usuario.email = email;

        Swal.fire('Guardado', 'Cambios guardados con exitos', 'success')
      }, (error) => {
        Swal.fire('Error', error.error.msg, 'error')

      })
  }

  cambiarImagen(evento: any): any {

    const imagen = evento.target?.files[0];

    if (evento) {
      if (!imagen) {
        return this.imagenTemp = null;
      }
      this.imagenSubir = imagen;
      const reader = new FileReader();
      reader.readAsDataURL(imagen);

      reader.onloadend = () => {
        this.imagenTemp = reader.result;
      }


    }

  }

  subirImagen() {
    this.fileUploadService.actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid || '')
      .then(img => {
        this.usuario.img = img;
        Swal.fire('Imagen', 'Imagen actualizada correctamente', 'success');
      })
      .catch(err => {
        Swal.fire('Error', err.error.msg, 'error')
      })
  }

}
