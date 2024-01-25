import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading.component';



@NgModule({
  exports: [ LoadingComponent ],
  declarations: [ LoadingComponent ],
  imports: [
    CommonModule,
  ]
})
export class LoadingModule { }
