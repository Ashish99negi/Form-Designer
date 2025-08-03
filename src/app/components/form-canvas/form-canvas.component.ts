import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CdkDragDrop, CdkDropList, transferArrayItem, DragDropModule, CdkDrag, CdkDragStart, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormConfig, FormElement, FormElementType, FormRow } from '../../interfaces/form-element';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-form-canvas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    DragDropModule,
    JsonPipe,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './form-canvas.component.html',
  styleUrls: ['./form-canvas.component.scss']
})
export class FormCanvasComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() formConfig!: FormConfig;
  @Input() formElementsPalette!: FormElement[];
  @Input() selectedElement!: FormElement | null;
  @Output() selectElementEvent = new EventEmitter<FormElement | null>();
  @Output() formConfigChanged = new EventEmitter<FormConfig>();

  currentView: number = 0;
  previewForm!: FormGroup;
  dropListContainers: string[] = [];
  draggedElement: any;
  isDraggingItem: boolean = false;

  constructor(private fb: FormBuilder, private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
    this.registerIcons();
  }

  ngOnInit(): void {
    this.createPreviewForm();
    this.formConfigChanged.emit(this.formConfig);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formConfig'] && !changes['formConfig'].firstChange) {
      this.createPreviewForm();
    }
  }

  ngAfterViewInit(): void {
    this.dropListContainers = this.formConfig.rows.map(row => row.id);
  }

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

  createPreviewForm(): void {
    const formGroupConfig: { [key: string]: any } = {};
    this.formConfig.rows.forEach(row => {
      row.elements.forEach(element => {
        if (element.name) {
          const initialValue = element.value !== undefined
            ? element.value
            : (element.type === 'checkbox' ? false : '');
          formGroupConfig[element.name] = [initialValue, this.getValidators(element)];
        }
      });
    });
    this.previewForm = this.fb.group(formGroupConfig);
  }

  getValidators(element: FormElement): any[] {
    const validators = [];
    if (element.required) {
      validators.push(Validators.required);
    }
    if (element.minLength) {
      validators.push(Validators.minLength(element.minLength));
    }
    if (element.maxLength) {
      validators.push(Validators.maxLength(element.maxLength));
    }
    if (element.pattern) {
      validators.push(Validators.pattern(element.pattern));
    }
    return validators;
  }

  onPreviewFormSubmit(): void {
    if (this.previewForm.valid) {
      console.log('Preview Form Submitted:', this.previewForm.value);
    } else {
      this.previewForm.markAllAsTouched();
    }
  }

  addRow(): void {
    const newRow: FormRow = { id: uuidv4(), elements: [] };
    this.formConfig.rows.push(newRow);
    this.dropListContainers.push(newRow.id);
    this.formConfigChanged.emit(this.formConfig);
  }

  deleteRow(index: number): void {
    this.formConfig.rows.splice(index, 1);
    this.dropListContainers.splice(index, 1);
    this.selectElement(null);
    this.formConfigChanged.emit(this.formConfig);
  }

  deleteElement(rowIndex: number, elementIndex: number): void {
    const elementToDelete = this.formConfig.rows[rowIndex].elements[elementIndex];
    if (elementToDelete.name) {
      this.previewForm.removeControl(elementToDelete.name);
    }
    this.formConfig.rows[rowIndex].elements.splice(elementIndex, 1);
    this.selectElement(null);
    this.formConfigChanged.emit(this.formConfig);
  }

  selectElement(element: FormElement | null): void {
    this.selectElementEvent.emit(element);
  }

  onDragStarted(): void {
    this.isDraggingItem = true;
  }

  onDragEnded(): void {
    this.isDraggingItem = false;
  }

  onTabChange(event: number): void {
    this.currentView = event;
    if (this.currentView === 1) {
      this.createPreviewForm();
    }
  }

  drop(event: CdkDragDrop<FormElement[]>, rowIndex: number): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else if (event.previousContainer.id === 'formElementsPalette') {
      const draggedElementData = event.previousContainer.data[event.previousIndex];
      const newElement = JSON.parse(JSON.stringify(draggedElementData));
      newElement.id = uuidv4();
      newElement.name = `${newElement.type}_${Date.now()}`;
      
      this.formConfig.rows[rowIndex].elements.splice(event.currentIndex, 0, newElement);
      this.createPreviewForm();
      this.formConfigChanged.emit(this.formConfig);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.formConfigChanged.emit(this.formConfig);
    }
  }
}
