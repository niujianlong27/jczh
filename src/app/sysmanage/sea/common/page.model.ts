/**
 * 分页信息
 */
export class Page {
    pageSize = 10;
    total = 0;
    pageIndex = 1;
    sizeOptions = [10, 30, 100, 200, 500];
    getPagingObj() {
        // return { 'start': (this.pageIndex - 1) * this.pageSize, 'length': this.pageSize };
        return { page: this.pageIndex, length: this.pageSize };
    }
    setTotal(tot) {
        this.total = tot;
    }
}
