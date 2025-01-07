import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeChatbotComponent } from './employee-chatbot/employee-chatbot.component';
import { AdminDocumentPanelComponent } from './admin-document-panel/admin-document-panel.component';

export const routes: Routes = [
  { path: 'employee-chatbot', component: EmployeeChatbotComponent },
  { path: 'admin-document-panel', component: AdminDocumentPanelComponent },
  { path: '', redirectTo: '/admin-document-panel', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
