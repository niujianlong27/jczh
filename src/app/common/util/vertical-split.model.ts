/**
 * grid分屏展示
 */
export class VerticalSplit {

    constructor({
        leftWidth = '49.5%',
        lineWidth = '49.5%',
        rightWidth = '49.5%',
        display = 'block',
        rightShow = false,
    } = {}) {
        this.leftWidth = leftWidth;
        this.lineWidth = lineWidth;
        this.rightWidth = rightWidth;
        this.display = display;
        this.rightShow = rightShow;
    }

    // 页面grid
    leftWidth: string = '49.5%';
    lineWidth: string = '49.5%';
    rightWidth: string = '49.5%';
    display: string = 'block';
    rightShow: boolean = false;

    /**
     * 右grid控制
     * @param data
     */
    gridLineFun(data: number) {
        const w = data < 1 ? data : 0.96;

        this.leftWidth = `${w * 100}%`;
        this.lineWidth = `${w * 100}%`;
        this.rightWidth = `${99 - w * 100}%`;
        this.display = 'block';

    }

    /**
     * 右grid
     */
    rightShowFun() {
        this.rightShow = !this.rightShow;
        if (this.rightShow) {
            this.leftWidth = '99%';
            this.lineWidth = '99%';
            this.rightWidth = '0%';
            this.display = 'none';
        } else {
            this.leftWidth = '49.5%';
            this.lineWidth = '49.5%';
            this.rightWidth = '49.5%';
            this.display = 'block';
        }
    }
}
