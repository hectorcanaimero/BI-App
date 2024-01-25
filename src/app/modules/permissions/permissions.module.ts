import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PermissionsComponent } from './permissions.component';
import { LoadingModule } from '@widgets/loading/loading.module';

const app: Routes = [{ path: '', component: PermissionsComponent }]

@NgModule({
  declarations: [
    PermissionsComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    LoadingModule,
    SweetAlert2Module,
    NgbAccordionModule,
    ReactiveFormsModule,
    RouterModule.forChild(app),
  ]
})
export class PermissionsModule { }
