import {  Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { map, switchMap } from 'rxjs';
import * as pbi from 'powerbi-client';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DataService } from '@core/services/data.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  @ViewChild('container', { static: false }) container!: ElementRef;
  report: any;
  constructor(
    private http: DataService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap): void =>
      this.getData(params.get('uid')));
  }

  getData(uid: string | null) {
    this.http.getData(`reports/${uid}`).pipe(
      switchMap((res: any) => {
        return  this.http.getData(`accounts/${res.accountID[0]._id}`).pipe(
          map((account) => {
            res.token = account.token;
            return res;
          })
        )
      })
    ).subscribe((res: any): void => {;
      if (res) this.contructReport(res);
    });
  }

  contructReport(report: any) {
    let settings: pbi.IEmbedSettings = {
      filterPaneEnabled: true,
      navContentPaneEnabled: true,
    };
    let config: pbi.IEmbedConfiguration = {
      type: 'report',
      tokenType: pbi.models.TokenType.Aad,
      accessToken: report.token,
      embedUrl: report.embedUrl,
      id: report.reportIdPB,
      filters: [],
      settings: settings
    };
    let reportContainer = this.container.nativeElement;
    let powerbi = new pbi.service.Service(pbi.factories.hpmFactory, pbi.factories.wpmpFactory, pbi.factories.routerFactory);
    this.report = powerbi.embed(reportContainer, config);
    this.report.on("loaded", (loaded: any) => console.log('loaded', loaded));
    this.report.on("loaded", (load: any) => console.log("Loaded", load));
    this.report.on("error", (error: any) => console.log("Error", error));

  }
}
