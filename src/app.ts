import fs from 'fs';
import JSON5 from 'json5';
import dotenv from 'dotenv';
import {RTMClient} from '@slack/rtm-api';
import {play, generate} from './tone';
import * as SlackUtil from './slack_util';

dotenv.config();

const DEFAULT_LENGTH = 0.19

const {
    SLACK_TOKEN,
    COLOR_PATTERN
} = process.env as { [key: string]: string };

type Commands = {
    [key: string]: {
        signalFrequency: number[],
        pattern: string;
    };
}

const commands: Commands = JSON5.parse(fs.readFileSync('./commands.json', 'utf8'));

// 制御用信号を先に生成しておく
const notificationSignal = generate(commands[COLOR_PATTERN].signalFrequency, DEFAULT_LENGTH);
const offSignal = generate(commands.off.signalFrequency, DEFAULT_LENGTH);

// 放置しすぎると信号を受け付けなくなる仕様のため1分おきに消灯コマンドを送る
const intervalOff = () => {
    console.log('Interval off');
    play(offSignal).then(() => console.log('done'));    
};
intervalOff();
setInterval(intervalOff, 60 * 1000);

const rtm = new RTMClient(SLACK_TOKEN);

rtm.start()
    .then(() => {
        console.log('RTM start');
    });

rtm.on('message', async(message) => {
    if (message.user && message.user === rtm.activeUserId) {
        return;
    }

    // undefinedのパターンが存在しているので完全に文字列に変換しておく
    const requestText = String(message.text);

    if (SlackUtil.isMentionToMe(requestText, rtm.activeUserId) || SlackUtil.isDirectMessageToMe(requestText)) {
        console.log('mention');
        play(notificationSignal).then(() => console.log('notified'));
    }
});
