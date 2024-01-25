import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceComponent } from './workspace.component';
import { RouterModule, Routes } from '@angular/router';
import { NamePipe } from './name.pipe';

const routes: Routes = [
  { path: ':uid', component: WorkspaceComponent }
]

@NgModule({
  declarations: [
    NamePipe,
    WorkspaceComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class WorkspaceModule { }
