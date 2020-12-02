import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import * as io from 'socket.io-client';
import { GlobalService } from './global-service.service';
@Injectable()
export class ChatService {
    private url = `${environment.baseUrlSocket}`;
    //  private url = 'http://192.168.21.33:9099/';
    private socket;
    private matchUrl = '';
    // 解析url
    private reg = /^(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i;
    private content = this.reg.exec(this.url);
    private path = '';
    private isClose: Boolean = false;
    constructor(public globalService: GlobalService) {
      // 解析值赋值
      this.content.forEach((item, index) => {
        if (item && 0 < index && index < 4) {
          this.matchUrl += item;
        }
        if (index === 4 && item) {
          this.path += item;
        }
      });
      // 手动在后面增加path后缀
      this.path += 'socket.io';
      if (environment.production) {
        this.url = environment.baseUrlSocket; // 获取socket地址
      }
    }

    /**
     * socket主动关闭
     */
    socketEnd() {
      if (!this.isClose) {
        if (this.socket) {
          this.socket.close();
        }
        this.isClose = true;
      }
    }

    /**
     * 启动socket
     * @param userId 当前登陆用户id
     * @param companyId 当前登陆用户所属公司id
     */
    getMessages(userId, companyId) {
      const observable = new Observable(observer => {
        let intervalCount: any = 0; // 失败重连计数
        // socket对象存在，结束退出，防止重复创建
        if (this.socket) {
          return;
        }
        this.socket = io(this.matchUrl, {
          // 定义socket对象
          query: {
            loginUserNum: userId,
            companyId: companyId
          },
          path: this.path,
          transports: ['websocket'], // 只进行socket连接
          autoConnect: true, // 禁止自动连接
          reconnection: true, // 禁止自动重连
          reconnectionDelay: 5000, // 默认延迟5s
          reconnectionDelayMax: 300000 // 最大可延长5分钟
        });
        this.socket.on('connect', data => {
          intervalCount = 0; // 连接成功清空计数对象
          this.socket.reconnectionDelay = 5000; // 重置重连时间为5s
        });
        this.socket.on('reconnect', data => { });
        this.socket.on('push_event', data => {
          if (data.companyId === 'C000000001' || data.companyId === companyId) {
            observer.next(data); // 执行订阅函数
            // 消息未读数重新获取，延迟300执行，防止获取不到最新的未读消息
            setTimeout(() => {
              this.globalService.msgReadEvent.emit();
            }, 300);
          }
        });
        this.socket.on('message', data => {
          // 传输消息（项目中只接收，不传输）
          observer.next(data);
        });
        this.socket.on('connect_error', data => {
          // socket链接失败，
        });
        this.socket.on('reconnect_error', data => {
          // socket重连失败执行
          intervalCount++; // 重连次数+1
          if (intervalCount === 5) {
            this.socket.reconnectionDelay = 300000; // 重连失败5次，设置重连延迟时间为5分钟
          }
        });
        return () => {
          this.socket.disconnect(function(data) {
            // socket断开
          });
        };
      });
      return observable;
    }
}
