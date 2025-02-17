import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, FileText, CheckCircle, XCircle, Search, Loader2, Settings  } from 'lucide-angular';
import Swal from 'sweetalert2';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';


interface Document {
  name: string;
  uploader: string;
  uploadDate: string;
  status: string;
}

@Component({
  selector: 'app-admin-document-panel',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    LucideAngularModule, 
    TableModule, 
    ButtonModule, 
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TagModule
  ],
  templateUrl: './admin-document-panel.component.html',
  styleUrls: ['./admin-document-panel.component.css'],
})
export class AdminDocumentPanelComponent implements OnInit{
  @ViewChild('dt') dt!: Table;  
  readonly FileText = FileText;
  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;
  readonly Search = Search;
  readonly Loader2 = Loader2;
  readonly Settings = Settings;

  documents: Document[] = [];
  selectedDocuments: string[] = [];
  isProcessing = false; 
  isLoading = true;
  searchValue = "";

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchDocuments();
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  filterGlobal(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      this.dt.filterGlobal(inputElement.value, 'startsWith');
    }
  }
  
  

  fetchDocuments() {
    this.isLoading = true;
    this.http.get<any[]>('http://127.0.0.1:8000/documents').subscribe({
      next: (response) => {
        this.documents = response.map((doc) => ({
          name: doc.filename,
          uploader: doc.uploader,
          uploadDate: doc.created_at,
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
            name: response.filename || 'Unknown',
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

  toggleSelection(filename: string) {
    const index = this.selectedDocuments.indexOf(filename);

    if (index > -1) {
      this.selectedDocuments.splice(index, 1);
    } else {
      if (this.selectedDocuments.length < 5) {
        this.selectedDocuments.push(filename);
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Limit Reached',
          text: 'You can select a maximum of 5 documents!',
        });
      }
    }
  }

  processFiles() {
    if (this.selectedDocuments.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Documents Selected',
        text: 'Please select up to 5 documents before processing.',
      });
      return;
    }

    this.isProcessing = true;

    Swal.fire({
      title: 'Processing Files',
      text: 'Please wait while the selected files are being processed...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.http.post<any>('http://127.0.0.1:8000/process-files/', { filenames: this.selectedDocuments }).subscribe({
      next: () => {
        this.isProcessing = false;
        Swal.fire({
          icon: 'success',
          title: 'Processing Complete',
          text: 'Selected files have been processed successfully!',
        });

        this.documents.forEach((doc) => {
          if (this.selectedDocuments.includes(doc.name)) {
            doc.status = 'Processed';
          }
        });

        this.selectedDocuments = [];
      },
      error: () => {
        this.isProcessing = false;
        Swal.fire({
          icon: 'error',
          title: 'Processing Failed',
          text: 'There was an error processing the selected files.',
        });
      },
    });
  }
}
