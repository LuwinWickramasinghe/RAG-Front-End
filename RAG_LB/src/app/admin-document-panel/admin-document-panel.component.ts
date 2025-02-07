import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, FileText, CheckCircle, XCircle, Search, Loader2, Settings  } from 'lucide-angular';
import Swal from 'sweetalert2';

interface Document {
  name: string;
  uploader: string;
  uploadDate: string;
  status: string;
}

@Component({
  selector: 'app-admin-document-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './admin-document-panel.component.html',
  styleUrls: ['./admin-document-panel.component.css'],
})
export class AdminDocumentPanelComponent implements OnInit{
  readonly FileText = FileText;
  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;
  readonly Search = Search;
  readonly Loader2 = Loader2;
  readonly Settings = Settings;

  documents: Document[] = [];
  isProcessing = false; 
  isLoading = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchDocuments();
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  fetchDocuments() {
    this.isLoading = true;
    this.http.get<any[]>('http://127.0.0.1:8000/documents').subscribe({
      next: (response) => {
        this.documents = response.map((doc) => ({
          name: doc.filename,
          uploader: doc.created_at,
          uploadDate: doc.uploader,
          status: doc.status,
        }));
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Failed to Load Documents',
          text: 'There was an error retrieving the document list.',
        });
      },
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('file', file);

      this.http.post<any>('http://127.0.0.1:8000/upload/', formData).subscribe({
        next: (response) => {
          this.documents.push({
            name: response.name || 'Unknown',
            uploader: response.uploader || 'Unknown',
            uploadDate: response.uploadDate || new Date().toISOString(),
            status: response.status || 'Pending',
          });

          Swal.fire({
            icon: 'success',
            title: 'Upload Successful',
            text: 'Your document has been uploaded successfully!',
          });
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Upload Failed',
            text: 'Something went wrong while uploading the file.',
          });
        },
      });
    }
  }

  processFiles() {
    this.isProcessing = true;

    // Show processing alert
    Swal.fire({
      title: 'Processing Files',
      text: 'Please wait while the files are being processed...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.http.get<any>('http://127.0.0.1:8000/process-files/').subscribe({
      next: (response) => {
        this.isProcessing = false;
        Swal.fire({
          icon: 'success',
          title: 'Processing Complete',
          text: 'All files have been processed successfully!',
        });

        // Update document statuses
        this.documents.forEach((doc) => {
          doc.status = 'Processed';
        });
      },
      error: () => {
        this.isProcessing = false;
        Swal.fire({
          icon: 'error',
          title: 'Processing Failed',
          text: 'There was an error processing the files.',
        });

        // Mark documents as failed
        this.documents.forEach((doc) => {
          doc.status = 'Failed';
        });
      },
    });
  }
}
