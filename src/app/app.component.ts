import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { v4 as uuidv4 } from 'uuid';
import { CdkDragDrop, CdkDropList, CdkDragStart, DragDropModule } from '@angular/cdk/drag-drop';
import { FormConfig, FormElement, FormElementType } from './interfaces/form-element';
import { FormCanvasComponent } from './components/form-canvas/form-canvas.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatCardModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    DragDropModule,
    FormCanvasComponent,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild(FormCanvasComponent, { static: false }) formCanvasComponent: FormCanvasComponent | undefined;

  formConfig: FormConfig = { rows: [] };
  selectedElement: FormElement | null = null;

  formElements: FormElement[] = [
    { id: uuidv4(), type: 'text', label: 'Text Field', placeholder: 'Enter text' },
    { id: uuidv4(), type: 'textarea', label: 'Text Area', placeholder: 'Enter text', rows: 2 },
    { id: uuidv4(), type: 'dropdown', label: 'Dropdown', options: [{ label: 'Option 1', value: 'opt1' }] },
    { id: uuidv4(), type: 'checkbox', label: 'Checkbox', value: false },
    { id: uuidv4(), type: 'radio', label: 'Radio Group', options: [{ label: 'Option 1', value: 'opt1' }] },
    { id: uuidv4(), type: 'date', label: 'Date Picker' },
  ];

  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
    this.registerIcons();
  }

  ngOnInit(): void { }
  ngAfterViewInit(): void { }

  registerIcons(): void {
    this.iconRegistry.addSvgIconLiteral('text', this.sanitizer.bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M4 6.84h16V8.16H4V6.84ZM4 11.84h16V13.16H4V11.84ZM4 16.84h16V18.16H4V16.84Z"/></svg>`));
    this.iconRegistry.addSvgIconLiteral('number', this.sanitizer.bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1 15V7.12L14.73 17H16V7.12h-1V15.7L11.53 7.12H10V17Z"/></svg>`));
    this.iconRegistry.addSvgIconLiteral('textarea', this.sanitizer.bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm-1 14H5c-.55 0-1-.45-1-1v-4h18v4c0 .55-.45 1-1 1ZM20 6H4v4h16V6Z"/></svg>`));
    this.iconRegistry.addSvgIconLiteral('dropdown', this.sanitizer.bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 16.32a.93.93 0 0 1-.68-.28L6.44 10.6c-.35-.35-.35-.91 0-1.26a.88.88 0 0 1 1.25 0L12 14.1l4.31-4.75a.88.88 0 0 1 1.25 0c.35.35.35.91 0 1.26L12.68 16a.93.93 0 0 1-.68.32Z"/></svg>`));
    this.iconRegistry.addSvgIconLiteral('checkbox', this.sanitizer.bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="m10.84 16.85-4.88-4.88a1.27 1.27 0 0 1 0-1.76 1.25 1.25 0 0 1 1.76 0L11.72 13.5l6.57-6.57a1.25 1.25 0 0 1 1.76 0c.49.49.49 1.27 0 1.76l-7.45 7.45a1.25 1.25 0 0 1-1.76 0Z"/></svg>`));
    this.iconRegistry.addSvgIconLiteral('radio', this.sanitizer.bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"/><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/></svg>`));
    this.iconRegistry.addSvgIconLiteral('date', this.sanitizer.bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 16H5V9h14v11Z"/></svg>`));
  }

  getIcon(type: FormElementType): string {
    return type;
  }

  onElementPropertyChanged(): void {
    if (this.selectedElement && this.formCanvasComponent) {
      this.formCanvasComponent.formConfigChanged.emit(this.formConfig);
    }
  }

  addOption(): void {
    if (this.selectedElement && this.selectedElement.options) {
      this.selectedElement.options.push({ label: `Option ${this.selectedElement.options.length + 1}`, value: `option${this.selectedElement.options.length + 1}` });
      this.onElementPropertyChanged();
    }
  }

  removeOption(index: number): void {
    if (this.selectedElement && this.selectedElement.options) {
      this.selectedElement.options.splice(index, 1);
      this.onElementPropertyChanged();
    }
  }

  exportCode(): void {
    const templateCode = this.generateStaticTemplateCode();
    const fileName = 'generated-form.component.html';
    const blob = new Blob([templateCode], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  private generateStaticTemplateCode(): string {
    const rowsHtml = this.formConfig.rows.map(row => {
      const elementsHtml = row.elements.map(element => {
        let elementTag = '';
        const requiredAttr = element.required ? '[required]="true"' : '';
        const placeholderAttr = element.placeholder ? `placeholder="${element.placeholder}"` : '';
        const ngModelBinding = element.name ? `[(ngModel)]="${element.name}"` : '';
        const widthClass = `w-[calc(33.33%-0.333rem)]`;

        switch (element.type) {
          case 'text':
          case 'email':
          case 'password':
          case 'number':
            elementTag = `
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>${element.label}</mat-label>
          <input matInput type="${element.type}" ${requiredAttr} ${placeholderAttr} ${ngModelBinding} />
        </mat-form-field>`;
            break;
          case 'textarea':
            elementTag = `
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>${element.label}</mat-label>
          <textarea matInput ${requiredAttr} ${placeholderAttr} ${ngModelBinding} rows="${element.rows ?? 2}"></textarea>
        </mat-form-field>`;
            break;
          case 'dropdown':
            const optionsHtml = element.options?.map(opt => `<mat-option value="${opt.value}">${opt.label}</mat-option>`).join('\n              ');
            elementTag = `
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>${element.label}</mat-label>
          <mat-select ${requiredAttr} ${ngModelBinding} ${placeholderAttr ? `placeholder="${element.placeholder}"` : ''}>
            ${optionsHtml}
          </mat-select>
        </mat-form-field>`;
            break;
          case 'checkbox':
            elementTag = `
        <mat-checkbox ${requiredAttr} ${ngModelBinding}>
          ${element.label}
        </mat-checkbox>`;
            break;
          case 'radio':
            const radioOptionsHtml = element.options?.map(opt => `<mat-radio-button value="${opt.value}">${opt.label}</mat-radio-button>`).join('\n              ');
            elementTag = `
        <p>${element.label}</p>
        <mat-radio-group ${requiredAttr} ${ngModelBinding} class="flex space-x-4">
          ${radioOptionsHtml}
        </mat-radio-group>`;
            break;
          case 'date':
            elementTag = `
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>${element.label}</mat-label>
          <input matInput [matDatepicker]="picker" ${requiredAttr} ${ngModelBinding}>
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>`;
            break;
          default:
            return '';
        }
        return `<div class="${widthClass}">${elementTag}</div>`;
      }).join('\n');
      return `<div class="flex gap-6 flex-wrap">
${elementsHtml}
      </div>`;
    }).join('\n');

    return `
<mat-card class="p-6 shadow-lg rounded-lg bg-white">
  <mat-card-content>
    <form (ngSubmit)="onSubmit()" class="space-y-6">
      ${rowsHtml}
      <div class="mt-6 flex justify-end">
        <button mat-raised-button color="primary" type="submit">
          <span *ngIf="!loading">Submit Form</span>
          <mat-spinner *ngIf="loading" [diameter]="20"></mat-spinner>
        </button>
      </div>
      <div *ngIf="submissionStatus" class="mt-4 p-3 rounded-md text-sm"
           [ngClass]="submissionStatus.startsWith('Form submitted') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
        {{ submissionStatus }}
      </div>
    </form>
  </mat-card-content>
</mat-card>
`;
  }
  
  noReturnPredicate(): boolean {
    return false;
  }
}
