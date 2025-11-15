import { Component, OnInit } from '@angular/core';
import * as powerbi from 'powerbi-client';
import { HeaderAdminComponent } from '../header-admin/header-admin.component';

@Component({
  selector: 'app-powerbi',
    standalone: true,
  imports: [HeaderAdminComponent],
  templateUrl: './powerbi.component.html',
  styleUrls: ['./powerbi.component.scss'],
})
export class PowerbiComponent implements OnInit {
  
  ngOnInit(): void {
    const embedUrl = "https://app.powerbi.com/reportEmbed?reportId=ca741141-34b9-437f-b260-2bdefdd2cad1&autoAuth=true&ctid=dc59e38c-4977-406f-bdd1-9ebbabbd387e&actionBarEnabled=true"; // depuis Power BI
    const reportId = "XXXX-XXXX-XXXX";

    const config: powerbi.IReportEmbedConfiguration = {
      type: 'report',
      id: reportId,
      embedUrl: embedUrl,
      tokenType: powerbi.models.TokenType.Aad, // ici Azure AD + Gateway
      settings: {
        panes: {
          filters: { visible: false },
          pageNavigation: { visible: true }
        }
      }
    };

    const reportContainer = document.getElementById('reportContainer') as HTMLElement;
    const service = new powerbi.service.Service(
      powerbi.factories.hpmFactory,
      powerbi.factories.wpmpFactory,
      powerbi.factories.routerFactory
    );

    service.embed(reportContainer, config);
  }
}

