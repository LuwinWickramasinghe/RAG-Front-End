import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, FileText, CheckCircle, XCircle, Search} from 'lucide-angular';

@Component({
  selector: 'app-admin-document-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './admin-document-panel.component.html',
  styleUrls: ['./admin-document-panel.component.css'],
})
export class AdminDocumentPanelComponent {
  readonly FileText = FileText;
  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;
  readonly Search = Search;
  documents = [
    { id: 1, name: 'LeavePolicy.pdf', uploader: 'Admin01', status: 'Processed', uploadDate: '2024-03-15' },
    { id: 2, name: 'ComplianceRules.docx', uploader: 'Admin02', status: 'Failed', uploadDate: '2024-03-14' },
  ];
}
