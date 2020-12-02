import {Injectable} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {HttpClient, HttpRequest, HttpHeaders, HttpEventType, HttpResponse} from '@angular/common/http';
import {SYS_URLS} from '@model/trans-urls';
import {format} from 'date-fns';
import {HttpEvent} from '@angular/common/http/src/response';

@Injectable({
  providedIn: 'root'
})
export class UploadFiles {

  action: string = 'https://another2.oss-cn-hangzhou.aliyuncs.com/';

  uploadData: any = {};

  new_multipart_params: any = {};

  //now = timestamp = Date.parse(new Date()) / 1000;
  constructor(
    private http: HttpClient,
    // private dir?: string,
  ) {
    // dir = dir ? `${dir}/` : '';

  }

  handleRequest(args): Subscription {
    console.log(11);

    console.log(args);
    const formData = new FormData();
    if (args.data) {
      Object.keys(args.data).map(key => {
        key === 'key' && formData.append(key, args.data[key]);
        key === 'file' && formData.append(key, args.data[key]);
      });
    }
    formData.append(args.name, args.file as any);

    if (!args.headers) {
      args.headers = {};
    }
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
    return this.http.request(req).subscribe(
      (event: HttpEvent<{}>) => {
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total! > 0) {
            // tslint:disable-next-line:no-any
            (event as any).percent = (event.loaded / event.total!) * 100;
          }
          // 处理上传进度条，必须指定 `percent` 属性来表示进度
          args.onProgress!(event, args.file!);
        } else if (event instanceof HttpResponse) {
          // 处理成功
          args.file.url = args.action + args.data.key;
          args.onSuccess!(event.body, args.file!, event);
        }
      },
      //   (event: any) => {
      //     args.file.url = args.action + args.data.key;
      //     args.onSuccess('', args.file, {});
      // },
      (err) => {
        //this.abort(args.file);
        args.onError(err, args.file);
      });
  }

  getPolicy(): Observable<any> {
    const that = this;
    return new Observable((observer) => {
      if (that.uploadData.expire && that.uploadData.expire > (new Date().getTime() / 1000 + 20 * 60)) {
        observer.next();
      } else {
        that.http.post(SYS_URLS.UPLOAD_GETPOLICY, {}).subscribe((res: any) => {
          if (res.data && res.code == 100) {
            that.uploadData = res.data;
            that.uploadData.dir = that.get_dirname(that.uploadData.dir);
            observer.next();
          } else {
            observer.error();
          }
        });
      }
    });
  }

  handleData = (file) => {
    console.log(12)
    this.setUpload();
    this.new_multipart_params['key'] = 'seadoc/' + this.calculate_object_name(file);
    console.log(this.new_multipart_params);
    return { ...this.new_multipart_params};
  };

  // getDir(): string{
  //     return this.dir ? this.dir : this.uploadData.dir ? this.uploadData.dir : '';
  // }

  setUpload() {
    this.getPolicy().subscribe(() => {
      //设置formdata
      this.new_multipart_params = {
        'policy': this.uploadData.policy,
        'OSSAccessKeyId': this.uploadData.accessId,
        'success_action_status': '200', //让服务端返回200,不然，默认会返回204
        'signature': this.uploadData.signature,
      };
    });
  }

  get_dirname(dir) {
    if (dir != '' && dir.indexOf('/') != dir.length - 1) {
      dir = dir + '/';
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
    var pos = filename.lastIndexOf('.');
    var suffix = '';
    if (pos != -1) {
      suffix = filename.substring(pos);
    }
    return suffix;
  }

  /**
   * 上传文件名称前面增加时间戳
   * @param file
   */
  calculate_object_name(file) {
    file = file || {name: '1.jpg'};
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
    return '未知文件名称';
  }

  /**
   * 将urls根据“;”切割，返回上传组件所需数组
   * @param urls
   */
  getFileList(urls: string) {
    if (!urls) {
      return [];
    }
    return urls.split(';').filter(item => item).map((item, index) => {
      return {
        uid: index + 1,
        name: this.getRealFileName(item),
        status: 'done',
        url: item,
      };
    });
  }

}
