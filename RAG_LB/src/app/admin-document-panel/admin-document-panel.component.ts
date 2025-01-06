import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-document-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-document-panel.component.html',
  styleUrls: ['./admin-document-panel.component.css'],
})
export class AdminDocumentPanelComponent {
  documents = [
    { id: 1, name: 'LeavePolicy.pdf', uploader: 'Admin01', status: 'Processed', uploadDate: '2024-03-15' },
    { id: 2, name: 'ComplianceRules.docx', uploader: 'Admin02', status: 'Failed', uploadDate: '2024-03-14' },
  ];
}
