import style from './input_data_graph.module.css'

import { useEffect, useRef, useState } from "react";
import { cleanSequence, eventSequenceToMeanGraph, toGraphology } from "../util/dataRepresentation";
import { inverseLerp, lerpClamped } from "../util/mathHelper";
import { limitStringLength } from '../util/formatingUtils';
import { circularLayout } from '../util/graphLayout';

export default function InputDataGraph({ inputData }) {
    
    const NODE_RADIUS = 30;
    const NODE_GAP = 120;
    const NODES_IN_ROW = 7;
    const NODE_STROKE = 3;

    const DRAWING_RECT = {
        x1: NODE_RADIUS + NODE_STROKE,
        y1: NODE_RADIUS + NODE_STROKE,
        x2: 700,
        y2: 700,
    }

    const [graphData, setGraphData] = useState({nodes: [], edges: []});
    const [nodesData, setNodesData] = useState(new Map());
    const [edgesData, setEdgesData] = useState([]);

    const [hoveredNode, setHoveredNode] = useState(undefined); 

    useEffect(() => {
        const tmpgraphData = eventSequenceToMeanGraph(cleanSequence(inputData));

        const tmpNodesData = new Map();
        const tmpEdgesData = [];

        const nodesPositions = circularLayout(tmpgraphData, DRAWING_RECT.x1, DRAWING_RECT.y1, DRAWING_RECT.x2, DRAWING_RECT.y2)

        tmpgraphData.nodes.forEach( (node, index) => {
            tmpNodesData.set(node.key, {
                key: node.key,
                cx: nodesPositions.get(node.key).x,
                cy: nodesPositions.get(node.key).y,
                r: NODE_RADIUS,
            });
        });

        tmpgraphData.edges.forEach( (edge, index) => {
            tmpEdgesData.push({
                source: edge.source,
                target: edge.target,
                label: edge.avgTimeBetween.toFixed(1),
                x1: tmpNodesData.get(edge.source).cx,
                y1: tmpNodesData.get(edge.source).cy,
                x2: tmpNodesData.get(edge.target).cx,
                y2: tmpNodesData.get(edge.target).cy,
            });
        });

        setNodesData(tmpNodesData);
        setEdgesData(tmpEdgesData);
        setGraphData(tmpgraphData)

    }, [inputData]);

    function indexToCX(index){
        return (index % NODES_IN_ROW) * NODE_GAP + ((index / NODES_IN_ROW) % 2) * 20 + NODE_RADIUS + NODE_STROKE;
    }

    function indexToCY(index){
        return parseInt(index / NODES_IN_ROW) * NODE_GAP + (index % 2) * 20 + NODE_RADIUS + NODE_STROKE;
    }

    function handleMouseEnterNode(key){
        setHoveredNode(key);
    }

    function handleMouseleaveNode(key){
        setHoveredNode(undefined);
    }


    return ( 
        <>
        <svg width={DRAWING_RECT.x2 + NODE_RADIUS + NODE_STROKE} height={DRAWING_RECT.y2 + NODE_RADIUS + NODE_STROKE}>
            <g>
                {edgesData.map( (edge, index) => {
                    return (<>
                        <line x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2} key={`e${index}`} className={`${style.edge} ${edge.source == hoveredNode ? style.selected : ""}`} />
                    </>);
                })}

                {Array.from(nodesData.values()).map( (node, index) => {
                    return (<>
                        <circle cx={node.cx} cy={node.cy} r={node.r} key={`c${index}`} className={`${style.nodeCircle} ${node.key == hoveredNode ? style.selected : ""}`} onMouseEnter={() => handleMouseEnterNode(node.key)} onMouseLeave={() => handleMouseleaveNode(node.key)} />
                        <text dominantBaseline="middle" textAnchor="middle" x={node.cx} y={node.cy} className={style.nodeLabel} key={`l${index}`} >{limitStringLength(node.key, 5, '-')}</text>
                    </>);
                })}

                {edgesData.filter(edge => edge.source == hoveredNode).map( (edge, index) => {
                    return (<>
                        <rect x={(edge.x1+edge.x2)/2 - 25} y={(edge.y1+edge.y2)/2 - 11} width={50} height={22} key={`r${index}`} rx={5} className={style.edgelabelBackground} />
                        <text dominantBaseline="middle" textAnchor="middle" x={(edge.x1+edge.x2)/2} y={(edge.y1+edge.y2)/2} className={style.edgeLabel} key={`el${index}`} >{edge.label}</text>
                    </>);
                })}

                

                
            </g>
        </svg>

        <pre>
            {JSON.stringify(graphData, null, 3)}
        </pre>
        </>
    );
}