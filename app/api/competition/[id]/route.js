import * as bl from "../../../../util/BusinessLogic/competition"



export async function GET(request, { params }) {
    const id = parseInt(params.id);
    if(Number.isNaN(id) || params.id.length > 7){
        const code = params.id;
        const c_res = await bl.getByCode(code);
        if(!c_res){
            return new Response(null, { status: 404 });
        }
        return Response.json(c_res, { status: 200 });
    }

    try {
        const result = await bl.get(id);
        if(result === false){
            return new Response(null, { status: 400 });
        }
        return Response.json(result, { status: 200 });
    } catch (err) {
        console.error(err);
        return Response.json({ error: 'failed to load data' }, { status: 500 });
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