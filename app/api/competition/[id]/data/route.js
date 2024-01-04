import * as bl from "../../../../../util/BusinessLogic/competition"



export async function GET(request, { params }) {
    const id = parseInt(params.id);
    if(Number.isNaN(id)){
        return new Response(null, { status: 400 });
    }

    try {
        const result = await bl.getDataInfoForCompetition(id);
        if(result === false){
            return new Response(null, { status: 400 });
        }
        return Response.json(result, { status: 200 });
    } catch (err) {
        console.error(err);
        return Response.json({ error: 'failed to load data' }, { status: 500 });
    }
}

export async function POST(request, { params }) {
    const id = parseInt(params.id);
    if(Number.isNaN(id)){
        return new Response(null, { status: 400 });
    }
    try {
        const body = await request.json();
        const result = await bl.saveDataInCompetition(body, id);
        if(result == null){
            return Response.json(result, { status: 400 });
        }
        return Response.json(result, { status: 201 });
    } catch (err) {
        console.error(err);
        return Response.json({ error: 'failed to save data' }, { status: 500 });
    }
}


// export async function DELETE(request, { params }) {
//     const id = parseInt(params.id);
//     if(Number.isNaN(id)){
//         return new Response(null, { status: 400 });
//     }

//     try {
//         const result = await collectedInputData.remove(id);
//         return new Response(null, { status: 204 });
//     } catch (err) {
//         console.error(err);
//         return Response.json({ error: 'failed to remove data' }, { status: 500 });
//     }
// }