import * as collectedInputData from "../../../../util/BusinessLogic/collectedInputData"



export async function GET(request, { params }) {
    const id = parseInt(params.id);
    if(Number.isNaN(id)){
        return new Response(null, { status: 400 });
    }

    try {
        const result = await collectedInputData.get(id);
        if(result === false){
            return new Response(null, { status: 400 });
        }
        return Response.json(result, { status: 200 });
    } catch (err) {
        console.error(err);
        return Response.json({ error: 'failed to load data' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const id = parseInt(params.id);
    if(Number.isNaN(id)){
        return new Response(null, { status: 400 });
    }

    try {
        const result = await collectedInputData.remove(id);
        return new Response(null, { status: 204 });
    } catch (err) {
        console.error(err);
        return Response.json({ error: 'failed to remove data' }, { status: 500 });
    }
}