import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DataService } from '@core/services/data.service';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Observable, map, of } from 'rxjs';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {
  workspaces$!: Observable<any>;
  group$!: Observable<string>;
  constructor(
    private router: Router,
    private http: DataService,
    private storage: StorageMap,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap): void =>
      this.getData(params.get('uid')));
  }

  getData(id: string | null) {
    if(id) {
      this.group$ = this.getGroup(id);
      this.storage.get('oUser').subscribe((res: any) => {
        if (res.role !== 'user') {
          this.workspaces$ = this.http.getData(`groups/report/${id}`).pipe(map((res: any) => res.data[0]));
        } else {
          this.workspaces$ = this.getWorkspaceByUser(id, res);
        }
      })
    }
  }

  getWorkspaceByUser(id: any, user: any): Observable<any> {
    const reports: any = user.report;
    const value = reports.filter((row: any) => row.groupIdPB === id);
    return of(value);
  }

  goToReport(id: string, group: any) {
    group.groupId = id;
    this.http.setReport(group);
    this.router.navigate(['report', group.reportIdPB])
  }

  getGroup(uid: string): Observable<string> {
    return this.http.getData(`groups/${uid}`).pipe(
      map((res: any) => res.name)
    );
  }
}
