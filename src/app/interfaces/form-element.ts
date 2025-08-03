export type FormElementType = 'text' | 'email' | 'password' | 'textarea' | 'dropdown' | 'checkbox' | 'heading' | 'button' | 'radio' | 'date' | 'number';

export interface FormElementOption {
  label: string;
  value: string;
}

export interface FormElement {
  id: string;
  type: FormElementType;
  label: string;
  name?: string;
  placeholder?: string;
  value?: any;
  required?: boolean;
  options?: FormElementOption[];
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  rows?: number;
  min?: number;
  max?: number;
}

export interface FormRow {
  id: string;
  elements: FormElement[];
}

export interface FormConfig {
  rows: FormRow[];
}