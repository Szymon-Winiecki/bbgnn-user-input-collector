import Graph from 'graphology';
import {circular} from 'graphology-layout';
import { inverseLerp, lerp } from './mathHelper';

/* (x1,y1) and (x2,y2) are top left and bottom right corners of the canvas*/
export function circularLayout(graph, x1, y1, x2, y2){
    const graphology = new Graph();

    graphology.import(graph);

    const positions = new Map(Object.entries(circular(graphology)));

    positions.forEach( pos => {
        pos.x = lerp(x1, x2, inverseLerp(-1, 1, pos.x));
        pos.y = lerp(y1, y2, inverseLerp(-1, 1, pos.y));
    });

    return positions;
}