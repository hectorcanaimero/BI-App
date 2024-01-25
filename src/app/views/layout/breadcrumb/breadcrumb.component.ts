import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html' ,
})
export class BreadcrumbComponent {
  @Input() source: string = '';
  @Input() items: string[] = [];

}
