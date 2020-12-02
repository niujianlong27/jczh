import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { format } from 'date-fns'
import { SEA_URLS } from '../../../common/model/sea-urls';

@Injectable({
    providedIn: 'root'
})
export class UploadFiles {

    // action: string = 'http://sea-trans.oss-cn-shanghai.aliyuncs.com/';
    // dirName: string = 'sea-doc'

    action: string;
    dirName: string;

    uploadData: any = {};

    new_multipart_params: any = {};

    constructor(private http: HttpClient) {
        this.http.post(SEA_URLS.getPolicy, {}).subscribe((res: any) => {
            if (res.data && res.code == 100) {
                this.uploadData = res.data;
                
                this.action = `${this.uploadData.host}/`;
                this.dirName = this.uploadData.dir;
            } else {
            }
        })
    }

    handleRequest(args): Subscription {
        const formData = new FormData();
        if (args.data) {
            Object.keys(args.data).map(key => {
                formData.append(key, args.data[key]);
            });
        }
        formData.append(args.name, args.file as any);

        if (!args.headers) { args.headers = {}; }
        if (args.headers['X-Requested-With'] !== null) {
            args.headers['X-Requested-With'] = `XMLHttpRequest`;
        } else {
            delete args.headers['X-Requested-With'];
        }
        const req = new HttpRequest('POST', args.action, formData, {
            reportProgress: true,
            withCredentials: args.withCredentials,
            headers: new HttpHeaders(args.headers)
        });
        return this.http.request('POST', args.action, {
            body: formData,
            reportProgress: true,
            withCredentials: args.withCredentials,
            headers: new HttpHeaders(args.headers)
        }).subscribe((event: any) => {
            args.file.url = args.action + args.data.key;
            args.onSuccess('', args.file, {});
        }, (err) => {
            //this.abort(args.file);
            args.onError(err, args.file);
        });
    }

    getPolicy(): Observable<any> {
        const that = this;
        return Observable.create(function (observer) {
            if (that.uploadData.expire && that.uploadData.expire > (new Date().getTime() / 1000 + 20 * 60)) {
                observer.next(that.uploadData);
            } else {
                that.http.post(SEA_URLS.getPolicy, {}).subscribe((res: any) => {
                    if (res.data && res.code == 100) {
                        that.uploadData = res.data;
                        observer.next(that.uploadData);
                    } else {
                        observer.error();
                    }
                })
            }
        });
    }


    handleData = (file) => {
        this.getPolicy().subscribe((res: any) => {
            //设置formdata
            // this.new_multipart_params = {
            //     policy: res.policy,
            //     OSSAccessKeyId: res.accessId,
            //     success_action_status: '200', //让服务端返回200,不然，默认会返回204
            //     signature: res.signature,
            //     key: `${this.dirName}/${this.calculate_object_name(file)}`
            // };
            this.new_multipart_params = {
                policy: this.uploadData.policy,
                OSSAccessKeyId: this.uploadData.accessId,
                success_action_status: '200', //让服务端返回200,不然，默认会返回204
                signature: this.uploadData.signature,
                key: `${this.dirName}/${this.calculate_object_name(file)}`
            };
        });
        // console.dir(this.new_multipart_params);
        return this.new_multipart_params;
    }


    get_dirname(dir) {
        if (dir != '' && dir.indexOf('/') != dir.length - 1) {
            dir = dir + '/'
        }
        return dir;
    }

    random_string(len) {
        len = len || 32;
        var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        var maxPos = chars.length;
        var pwd = '';
        for (var i = 0; i < len; i++) {
            pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }

    get_suffix(filename) {
        var pos = filename.lastIndexOf('.')
        var suffix = ''
        if (pos != -1) {
            suffix = filename.substring(pos)
        }
        return suffix;
    }

    /**
     * 上传文件名称前面增加时间戳
     * @param file 
     */
    calculate_object_name(file) {
        file = file || { name: '1.jpg' };
        // return this.random_string(32) + this.get_suffix(file.name);
        return format(new Date(), 'YYYYMMDDHHmmss') + '_' + file.name;
    }

    /**
     * 获取上传时文件名称
     * @param url 
     */
    getRealFileName(url: string) {
        if (url) {
            const fileName = url.substr(url.lastIndexOf('/') + 1);
            return fileName.indexOf('_') > -1 ? fileName.substr(fileName.indexOf('_') + 1) : fileName;
        }
        return "未知文件名称";
    }

    /**
     * 将urls根据“;”切割，返回上传组件所需数组
     * @param urls 
     */
    getFileList(urls: string) {
        if (!urls) {
            return [];
        }
        return urls.split(";").filter(item => item).map((item, index) => {
            return {
                uid: index + 1,
                name: this.getRealFileName(item),
                status: 'done',
                url: item,
            };
        });
    }

}
