import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: ':uid', component: ReportComponent }
]

@NgModule({
  declarations: [
    ReportComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class ReportModule { }
