
function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// export const xySq = (a, b, c) => (x, y) => (Math.sin(x / a) * Math.cos(y / b) * c);
const xySq = ({a, b, c, h}) =>
    (x, y) => {

        const r = Math.sin(x / a) * Math.cos((1-y) / b) * c;


        return r;
    };

// eslint-disable-next-line no-restricted-globals
const ctxSq = self;

ctxSq.onmessage = (ev) => {
    const {imageData, width, height, params} = ev.data;


    const {end} = params;


    const WW = 1;
    const HH = 1;



    const f = xySq(params);

    for (let i = 0; i < imageData.data.length; i += 4) {

        const x = (i / 4) % width;
        const y = Math.floor((i / 4) / width);

        const xnorm = x / width * WW;
        const ynorm = y / height * HH;
        const znorm = f(xnorm, ynorm) * end;

        const colorTo = 350/360;
        const colorFrom = 50/360;



        const rgb = hslToRgb(Math.max(Math.min(colorTo- znorm * (colorTo - colorFrom), colorTo), colorFrom), 0.50, 0.50);


        imageData.data[i] = rgb[0];
        imageData.data[i + 1] = rgb[1];
        imageData.data[i + 2] = rgb[2];
        imageData.data[i + 3] = 255;
        
    }

    ctxSq.postMessage({
        imageData
    });
};
