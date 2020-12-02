import {
  Directive,
  Input,
  TemplateRef,
  OnInit,
  Injectable,
  Host,
} from '@angular/core';

@Injectable()
export class GridRowSource {
  private titles: { [key: string]: TemplateRef<any> } = {};
  private rows: { [key: string]: TemplateRef<any> } = {};

  add(type: string, path: string, ref: TemplateRef<any>) {
    this[type === 'title' ? 'titles' : 'rows'][path] = ref;
  }

  getTitle(path: string) {
    return this.titles[path];
  }

  getRow(path: string) {
    return this.rows[path];
  }
}

@Directive({ selector: '[grid-row]' })
export class GridRowDirective implements OnInit {
  @Input('grid-row')
  id: string;

  @Input()
  type: 'title';

  constructor(
    private ref: TemplateRef<any>,
    @Host() private source: GridRowSource,
  ) {}

  ngOnInit(): void {
    this.source.add(this.type, this.id, this.ref);
  }
}
