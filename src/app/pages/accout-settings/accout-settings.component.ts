import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-accout-settings',
  templateUrl: './accout-settings.component.html',
  styles: [
  ]
})
export class AccoutSettingsComponent implements OnInit {


  constructor( private settingsService: SettingsService) { }

  ngOnInit(): void {
    this.settingsService.checkCurrentTheme();

  }

  changeTheme(theme: string){

    this.settingsService.changeTheme(theme);

  }



}
