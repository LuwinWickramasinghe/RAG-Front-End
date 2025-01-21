import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
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

  constructor(private http: HttpClient) {}

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('file', file);

      this.http.post<any>('http://127.0.0.1:8000/upload/', formData).subscribe({
        next: (response) => {
          this.documents.push(response);
          console.log(this.documents);
        },
        error: (error) => {
          console.error('Upload failed', error);
          console.log(this.documents);
        },
        complete: () => {
          console.log('Upload completed successfully');
        }
      });      
    }
  }
}

