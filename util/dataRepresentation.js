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
        const edgeString = `{${previous.key}-${event.key}`;
        const timeBetween = event.keyDownTime - previous.keyDownTime;
        if(edges.has(edgeString)){
            const edge = edges.get(edgeString);
            edge.avgTimeBetween = (edge.avgTimeBetween * edge.numberOfEvents + timeBetween) / (edge.numberOfEvents + 1);
            edge.numberOfEvents++;
        }
        else{
            edges.set(edgeString, {
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