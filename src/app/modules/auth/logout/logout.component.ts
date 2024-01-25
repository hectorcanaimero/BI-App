import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { timer } from 'rxjs';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(
    private storage: StorageMap,
    private router: Router,
  ) { }

  ngOnInit(): void {
    timer(1500).subscribe(() => {
      this.storage.delete('oToken').subscribe(() => null);
      this.storage.delete('oUser').subscribe(() => null);
      this.router.navigate(['auth', 'login']);
    })
  }

}
