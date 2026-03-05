import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FFlowModule, FCreateConnectionEvent } from '@foblex/flow';
import { IConnection, INode } from './workflow-canvas.model';

@Component({
  selector: 'app-workflow-canvas',
  imports: [CommonModule, FFlowModule],
  templateUrl: './workflow-canvas.html',
  styleUrl: './workflow-canvas.scss',
})
export class Floblex {}
