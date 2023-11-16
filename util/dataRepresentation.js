export function cleanSequence(sequence){
    const highestTimeStamp = sequence.reduce((highest, curr) => highest < curr.keyUpTime ? highest : curr.keyUpTime);

    console.log(highestTimeStamp);

    sequence.forEach(event => {
        if(event.keyUpTime == undefined) event.keyUpTime = highestTimeStamp;
    });

    return sequence;
}

export function eventSequenceToMeanGraph(sequence){
    let nodes = new Map();
    let edges = new Map();

    for(let i = 0; i < sequence.length; ++i){
        const event = sequence[i];

        const pressingTime = event.keyUpTime - event.keyDownTime;
        if(nodes.has(event.key)){
            const node = nodes.get(event.key);
            node.avgPressingTime = (node.avgPressingTime * node.numberOfEvents + pressingTime) / (node.numberOfEvents + 1);
            node.numberOfEvents++;
        }
        else{
            nodes.set(event.key, {
                key: event.key,
                avgPressingTime: pressingTime,
                numberOfEvents: 1,
            });
        }

        if(i == 0) continue;

        const previous = sequence[i-1];
        const edgeString = `${previous.key}->${event.key}`;
        const timeBetween = event.keyDownTime - previous.keyDownTime;
        if(edges.has(edgeString)){
            const edge = edges.get(edgeString);
            edge.avgTimeBetween = (edge.avgTimeBetween * edge.numberOfEvents + timeBetween) / (edge.numberOfEvents + 1);
            edge.numberOfEvents++;
        }
        else{
            edges.set(edgeString, {
                key: edgeString,
                source: previous.key,
                target: event.key,
                avgTimeBetween: timeBetween,
                numberOfEvents: 1,
            });
        }
    }

    return{
        nodes: Array.from(nodes.values()),
        edges: Array.from(edges.values()),
    }
}

/*   */
export function toGraphology(ssrGraph){
    return {
        attributes: {},
        nodes: ssrGraph.nodes.map( node => { return {key: node.key} } ),
        edges: ssrGraph.edges.map( edge => { return {key: `${edge.source}->${edge.target}`, source: edge.source, target: edge.target} } )
      };
}

export function toTorchData(ssrGraph, label){
    const nodesIndexes = new Map();
    ssrGraph.nodes.forEach( (node, index) => nodesIndexes.set(node.key, index));
    return {
        x: ssrGraph.nodes.map(node => [node.key, node.avgPressingTime]),
        edge_index: ssrGraph.edges.map(edge => [nodesIndexes.get(edge.source), nodesIndexes.get(edge.target)]),
        edge_attr: ssrGraph.edges.map(edge => [edge.avgTimeBetween]),
        y: label
    }
}