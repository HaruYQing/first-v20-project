import { AsyncPipe } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  Optional,
  output,
  Self,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { debounceTime, ReplaySubject } from 'rxjs';

export interface SingleSelectorOption {
  value: string;
  text: string;
  icon: string;
  disabled?: boolean;
  optionTooltip?: string | null;
}

@Component({
  selector: 'app-single-selector',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
    NgxMatSelectSearchModule,
    MatProgressSpinnerModule,
    AsyncPipe,
  ],
  templateUrl: './single-selector.html',
  styleUrl: './single-selector.scss',
})
export class SingleSelector {
  // ===== inject =====
  destroyRef = inject(DestroyRef);

  // ===== input =====
  label = input<string>('');
  options = input.required<SingleSelectorOption[]>();
  placeholder = input<string>('Please select');
  tooltipMessage = input<string>('');
  errorState = input<boolean>(false);
  required = input<boolean>(false);
  searchable = input<boolean>(false);
  helpText = input<string | null>(null);
  showClearOption = input<boolean>(false);
  loadingState = input<boolean>(false);

  /*** for attribute binding ***/
  value = input<string>('');
  disabled = input<boolean>(false);

  // ===== output =====
  selectionChange = output<string>();
  searchChange = output<string>();
  blur = output<void>();

  // ===== const & props =====
  isOpened = false;
  /*** search ***/
  public searchFilterCtrl = new FormControl<string>('');
  public filteredOptions: ReplaySubject<Array<SingleSelectorOption>> = new ReplaySubject<
    Array<SingleSelectorOption>
  >(1);

  // ===== signal =====
  errorMessage = signal('');
  /*** CVA internal states ***/
  private _cvaValue = signal<string>(''); // CVA 模式的值
  private _cvaDisabled = signal<boolean>(false); // CVA 模式的 disabled

  // ===== computed =====
  currentValue = computed(() => (this.ngControl ? this._cvaValue() : this.value()));

  currentDisabled = computed(() => (this.ngControl ? this._cvaDisabled() : this.disabled()));

  selectedOption = computed(() =>
    this.options().find((option) => option.value === this.currentValue()),
  );

  /** customed panel classes */
  panelClasses = computed(() => {
    const classes = ['single-selector-custom-panel'];

    if (this.searchable()) {
      classes.push('single-selector-with-search');
    }

    if (this.showClearOption()) {
      classes.push('single-selector-with-clear');
    }

    return classes;
  });

  isLoading = computed(() => this.loadingState());

  // ===== effect =====
  optionEffect = effect(() => {
    const currentOptions = this.options();
    this.filteredOptions.next(currentOptions.slice());
  });

  searchFilterCtrlValueChangeEffect = effect(() => {
    const control = this.searchFilterCtrl;

    if (control) {
      // 訂閱值變化
      control.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef), debounceTime(300))
        .subscribe((searchTerm) => {
          this.searchChange.emit(searchTerm ?? '');
          this.searchOptions(searchTerm ?? '');
        });
    }
  });

  // ===== life cycle =====
  constructor(@Optional() @Self() public ngControl: NgControl) {
    // 如果有 ngControl，設定 valueAccessor
    if (this.ngControl !== null) {
      this.ngControl.valueAccessor = this;
    }
  }

  // ===== methods =====
  // TODO: 可以改為空值嗎?
  /** 非必填的時候加上一個可以清空的選項 */
  addClearOption(options: SingleSelectorOption[]) {
    if (!this.required() && this.showClearOption()) {
      return [
        {
          value: 'RESET_SELECTION',
          text: this.placeholder(),
          icon: '',
          datatype: '',
        },
        ...options,
      ];
    }

    return options;
  }

  // TODO: 可以用真正的 disable，然後外面包一層給 tooltip 嗎?
  onSelectionChange(selectChange: MatSelectChange) {
    let newValue = selectChange.value;

    if (!newValue) newValue = '';

    // 處理點擊 disabled 選項，回到之前的選項
    if (this.options().find((option) => option.value === newValue)?.disabled) {
      const previousValue = this.currentValue();
      selectChange.source.value = previousValue;

      return;
    }

    // 普通邏輯
    if (this.ngControl) {
      // CVA 模式：更新內部狀態並通知 FormControl
      this._cvaValue.set(newValue);
      this.onChange(newValue);
      this.onTouched();
    } else {
      // Attribute binding 模式：發出 output 事件
      this.selectionChange.emit(newValue);
    }
  }

  onBlur() {
    if (this.isOpened) {
      return;
    }

    this.onTouched();
    if (this.ngControl) {
      // CVA 模式，檢查空值並觸發 onChange
      if (!this.currentValue()) {
        this.onChange(null);
      }
    } else {
      // Attribute binding 模式，發出 blur 事件
      this.blur.emit();
    }
  }

  /** 搜尋 */
  private searchOptions(searchTerm: string) {
    if (!searchTerm) {
      this.filteredOptions.next(this.options().slice());

      return;
    }

    const lowerSearchTerm = searchTerm.trim().toLowerCase();

    const filteredOptions = this.options().filter((option) =>
      option.text.toLowerCase().includes(lowerSearchTerm),
    );

    this.filteredOptions.next(filteredOptions);
  }

  // ====== ControlValueAccessor 介面實作 ======
  writeValue(value: any): void {
    this._cvaValue.set(value || '');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._cvaDisabled.set(isDisabled);
  }

  // 提供給 ControlValueAccessor 使用的回調函數
  private onChange: any = () => {};
  private onTouched: any = () => {};
}
