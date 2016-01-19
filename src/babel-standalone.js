import { transform } from 'babel-core';
import es2015 from 'babel-preset-es2015';
import stage0 from 'babel-preset-stage-0';
import presetReact from 'babel-preset-react';

window.babelTransform = function (code) {
    return transform(code, { presets: [es2015, presetReact, stage0] }).code;
}