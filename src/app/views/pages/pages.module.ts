// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// Partials
import { PartialsModule } from '../partials/partials.module';
// Pages
import { CoreModule } from '../../core/core.module';
import { PdfViewerModule } from "ng2-pdf-viewer";
// import { UserManagementModule } from './user-management/user-management.module';

@NgModule({
	declarations: [],
	exports: [],
	imports: [
		CommonModule,
		HttpClientModule,
		FormsModule,
		
		CoreModule,
		PartialsModule,
		PdfViewerModule
		// UserManagementModule,
	],
	providers: []
})
export class PagesModule {
}
