import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ListComponent } from './list/list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { DataTablesModule } from 'angular-datatables';
import { LoadingModule } from '@widgets/loading/loading.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'list', component: ListComponent },
  { path: 'change-password', component: ChangePasswordComponent}
];

@NgModule({
  imports: [
    CommonModule,
    LoadingModule,
    DataTablesModule,
    SweetAlert2Module,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  exports: [ChangePasswordComponent, ListComponent, RegisterComponent],
  declarations: [ChangePasswordComponent, ListComponent, RegisterComponent],
})
export class UsersModule { }

