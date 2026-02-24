import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-playground',
  imports: [MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule],
  templateUrl: './playground.html',
  styleUrl: './playground.scss',
})
export class Playground {
  testSelect = new FormControl('test');

  testSelectList: string[] = ['test1', 'test2', 'test3'];
}
