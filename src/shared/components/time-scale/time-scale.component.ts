import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import { Scroll } from 'ionic-angular';
import * as $ from 'jquery';

@Component({
    selector: 'page-time-scale',
    templateUrl: './time-scale.component.html'
})
export class TimeScaleComponent implements OnInit {
    @ViewChild(Scroll) scroll: Scroll;
    bodyWidth: number;
    scrollLeft: number = 0;
    times = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    time = '00:00:00';
    showTime = '00:00:00';
    secondCount = 86400;
    timeStream: Subject<string> = new Subject<string>();

    ngOnInit() {
        this.bodyWidth = $(window).width();
        this.timeStream
            .debounceTime(600)
            .distinctUntilChanged()
            .subscribe(scrollLeft => {
                // 0.6秒内有滑动刻度尺是不会进入到这的
                this.time = this.formatSeconds();
            });

    }

    ngAfterViewInit() {
        this.scroll.addScrollEventListener((event) => {
            this.scrollLeft = event.target.scrollLeft;
            this.showTime = this.formatSeconds();
            this.timeStream.next(String(this.scrollLeft));
        });
    }

    formatSeconds() {
        let result = '0时0分0秒';
        let second: number = this.scrollLeft / 2136 * this.secondCount;

        var h = Math.floor(second / 3600 % 24);
        var m = Math.floor(second / 60 % 60);
        var s = Math.floor(second / 60 % 60 % 60);
        if (String(h).length == 1) {
            result = `0${h}`
        } else {
            result = `${h}`
        }

        if (String(m).length == 1) {
            result += `:0${m}`
        } else {
            result += `:${m}`
        }

        if (String(s).length == 1) {
            result += `:0${s}`
        } else {
            result += `:${s}`
        }

        if (this.scrollLeft >= 2136) {
            result = '23:59:59';
        } else if (this.scrollLeft < 0) {
            result = '00:00:00';
        }
        return result;
    }

    
}
