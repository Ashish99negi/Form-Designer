import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormElement, FormElementOption } from '../../interfaces/form-element';

@Component({
  selector: 'app-element-properties-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title class="text-2xl font-bold text-gray-800">Edit {{ element.type | titlecase }} Element</h2>
    <mat-dialog-content [formGroup]="elementForm" class="grid grid-cols-1 gap-4 py-4">
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Label</mat-label>
        <input matInput formControlName="label" required>
        <mat-error *ngIf="elementForm.get('label')?.hasError('required')">Label is required</mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-full" *ngIf="element.type !== 'heading' && element.type !== 'button'">
        <mat-label>Name</mat-label>
        <input matInput formControlName="name" required>
        <mat-error *ngIf="elementForm.get('name')?.hasError('required')">Name is required</mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-full"
                      *ngIf="['text', 'textarea'].includes(element.type)">
        <mat-label>Placeholder</mat-label>
        <input matInput formControlName="placeholder">
      </mat-form-field>

      <div *ngIf="element.type === 'checkbox'" class="flex items-center">
        <mat-checkbox formControlName="value">Default Checked</mat-checkbox>
      </div>
      
      <div *ngIf="['text', 'textarea'].includes(element.type)" class="grid grid-cols-2 gap-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Min Length</mat-label>
          <input matInput type="number" formControlName="minLength">
        </mat-form-field>
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Max Length</mat-label>
          <input matInput type="number" formControlName="maxLength">
        </mat-form-field>
      </div>

      <div *ngIf="element.type === 'text'">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Pattern (Regex)</mat-label>
          <input matInput formControlName="pattern">
          <mat-hint>e.g.,  for 5-digit number</mat-hint>
        </mat-form-field>
      </div>

      <div class="flex items-center" *ngIf="element.type !== 'heading' && element.type !== 'button'">
        <mat-checkbox formControlName="required">Required Field</mat-checkbox>
      </div>

      <ng-container *ngIf="element.type === 'dropdown' || element.type === 'radio'">
        <h3 class="text-lg font-semibold mt-4 mb-2">Options</h3>
        <div formArrayName="options" class="space-y-3">
          <div *ngFor="let optionGroup of options.controls; let i = index" [formGroupName]="i"
               class="flex items-center space-x-2 border p-2 rounded-md bg-gray-50">
            <mat-form-field appearance="outline" class="flex-grow">
              <mat-label>Option Label</mat-label>
              <input matInput formControlName="label" required>
              <mat-error *ngIf="optionGroup.get('label')?.hasError('required')">Label required</mat-error>
            </mat-form-field>
            <mat-form-field appearance="outline" class="flex-grow">
              <mat-label>Option Value</mat-label>
              <input matInput formControlName="value" required>
              <mat-error *ngIf="optionGroup.get('value')?.hasError('required')">Value required</mat-error>
            </mat-form-field>
            <button mat-icon-button color="warn" (click)="removeOption(i)">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </div>
        <button mat-flat-button color="primary" (click)="addOption()" class="mt-3 w-full">
          <mat-icon>add</mat-icon> Add Option
        </button>
      </ng-container>

    </mat-dialog-content>
    <mat-dialog-actions align="end" class="pt-4">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="elementForm.invalid">Save</button>
    </mat-dialog-actions>
  `,
  styles: []
})
export class ElementPropertiesDialogComponent implements OnInit {
  elementForm!: FormGroup;
  element: FormElement;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ElementPropertiesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { element: FormElement }
  ) {
    this.element = data.element;
  }

  ngOnInit(): void {
    this.elementForm = this.fb.group({
      id: [this.element.id],
      type: [this.element.type],
      label: [this.element.label, Validators.required],
      name: [this.element.name || '', this.element.type === 'heading' || this.element.type === 'button' ? [] : Validators.required],
      placeholder: [this.element.placeholder || ''],
      value: [this.element.value !== undefined ? this.element.value : (this.element.type === 'checkbox' ? false : '')],
      required: [this.element.required || false],
      minLength: [this.element.minLength, [Validators.min(0)]],
      maxLength: [this.element.maxLength, [Validators.min(0)]],
      pattern: [this.element.pattern || ''],
      options: this.fb.array(this.element.options ? this.element.options.map(opt => this.createOption(opt)) : [])
    });
  }

  createOption(option?: FormElementOption): FormGroup {
    return this.fb.group({
      label: [option?.label || '', Validators.required],
      value: [option?.value || '', Validators.required]
    });
  }

  get options(): FormArray {
    return this.elementForm.get('options') as FormArray;
  }

  addOption(): void {
    this.options.push(this.createOption());
  }

  removeOption(index: number): void {
    this.options.removeAt(index);
  }

  onSave(): void {
    if (this.elementForm.valid) {
      const updatedElement: FormElement = this.elementForm.value;
      if (!['dropdown', 'radio'].includes(updatedElement.type)) {
        delete updatedElement.options;
      }
      this.dialogRef.close(updatedElement);
    } else {
      this.elementForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}