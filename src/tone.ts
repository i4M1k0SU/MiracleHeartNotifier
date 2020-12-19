import {Readable} from 'stream';
import Speaker from 'speaker';

const SAMPLE_RATE = 44100;
const BIT_DEPTH = 16;
const VOLUME = 32768;

const play = async(data: Int16Array) => {
    const speaker = new Speaker({
        sampleRate: SAMPLE_RATE,
        bitDepth: BIT_DEPTH
    });
    const size = data.length * 2;
    const buffer = Buffer.alloc(size)
    const readable = new Readable();
    readable._read = () => {
        data.forEach((value, index) => {
            buffer.writeInt16LE(value, index * 2)
        });
    };
    readable.push(buffer);
    readable.pipe(speaker);

    return new Promise(resolve => {
        setTimeout(() => {
            speaker.close(true);
            resolve(void 0);
        }, (size / 2 / SAMPLE_RATE) * 1000 + 50)
    });
};

const generate = (frequencies: number[], lengthSecond: number): Int16Array => {
    const length = SAMPLE_RATE * lengthSecond;
    const toneArray: number[] = [];
    frequencies.forEach(frequency => {
        for (let i = 0; i < length; i++) {
            toneArray.push(Math.floor(Math.min((VOLUME * Math.sin((Math.PI * frequency * i) / SAMPLE_RATE)), VOLUME - 1)));
        }
        for (let i = 0; i < SAMPLE_RATE * 0.01; i++) {
            toneArray.push(0);
        }
    });
    console.log(toneArray.length / SAMPLE_RATE);

    return Int16Array.from(toneArray);
};

export {play, generate};
