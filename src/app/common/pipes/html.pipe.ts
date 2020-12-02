import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
@Pipe({
  name: 'html'
})
export class HtmlPipe implements PipeTransform {

  constructor(private dom: DomSanitizer) {}

  transform(html: string): string {
    return html ? this.dom.bypassSecurityTrustHtml(html) as any : '';
  }

}
@Pipe({
  name: 'safeUrl'
})
export class safeUrlPipe implements PipeTransform {

  constructor(private dom: DomSanitizer) {}

  transform(url: string): string {
    return this.dom.bypassSecurityTrustResourceUrl(url) as any;
  }

}

