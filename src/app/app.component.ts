import { AfterViewInit, Component, OnDestroy, HostListener } from '@angular/core';
import { DataService } from '@core/services/data.service';
import { StorageMap } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnDestroy {
  title = 'nobleui-angular';
  constructor(
    private http: DataService,
    private storage: StorageMap,
  ) {}
  ngOnDestroy(): void {
    this.storage.clear().subscribe(() => null);
  }
  ngAfterViewInit(): void {
    this.storage.get('oToken').subscribe((token: any) => {
      if (token) {
        this.http.getData('users').subscribe((user: any) => {
          this.storage.set('oUser', user).subscribe(() => null);
        })
      }
    })
  }
  @HostListener('window:unload', ['$event'])
  unloadHandler(event: Event) {
    event.preventDefault();
    console.log(event);
    this.storage.delete('oToken').subscribe(() => null);
    this.storage.delete('oUser').subscribe(() => null);
  }
}
