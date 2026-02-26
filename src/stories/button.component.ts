import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, input } from '@angular/core';

@Component({
  selector: 'storybook-button',
  standalone: true,
  imports: [CommonModule],
  template: ` <button
    type="button"
    (click)="onClick.emit($event)"
    [ngClass]="classes"
    [ngStyle]="styles"
  >
    {{ label }}
  </button>`,
  styleUrls: ['./button.css'],
})
export class ButtonComponent {
  /** Is this the principal call to action on the page? */
  @Input()
  primary = false;

  /** What background color to use */
  @Input()
  backgroundColor?: string;

  /** How large should the button be? */
  @Input()
  size: 'small' | 'medium' | 'large' = 'medium';

  /**
   * Button contents
   *
   * @required
   */
  @Input()
  label = 'Button';

  /** Is using outline style? */
  outline = input<boolean>(false);

  /** What color is outline? */
  outlineColor = input<string>('transparent');

  /** Optional click handler */
  @Output()
  onClick = new EventEmitter<Event>();

  public get classes(): string[] {
    const mode = this.primary ? 'storybook-button--primary' : 'storybook-button--secondary';

    let classes = ['storybook-button', `storybook-button--${this.size}`, mode];

    if (this.outline()) {
      classes.push('storybook-button--outline');
    }

    return classes;
  }

  public get styles(): Record<string, string> {
    return {
      'background-color': this.backgroundColor ?? 'transparent',
      'border-color': this.outlineColor(),
    };
  }
}
