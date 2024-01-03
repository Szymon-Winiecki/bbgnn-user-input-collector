import * as bl from "../../../../../util/BusinessLogic/competition"



export async function GET(request, { params }) {
    const id = parseInt(params.id);
    if(Number.isNaN(id)){
        return new Response(null, { status: 400 });
    }

    try {
        const result = await bl.getStats(id);
        if(result === null){
            return new Response(null, { status: 400 });
        }
        return Response.json(result, { status: 200 });
    } catch (err) {
        console.error(err);
        return Response.json({ error: 'failed to load data' }, { status: 500 });
    }
}