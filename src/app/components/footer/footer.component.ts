import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
          <div class="footer-con">
            <p style="margin-bottom: 2px;">
              Copyright&copy; 2019  沪ICP备16029112 号
            </p>
            <p>京创智汇(上海)物流科技有限公司</p>
          </div>`,
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
