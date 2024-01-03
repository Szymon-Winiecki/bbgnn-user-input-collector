import * as bl from "../../../util/BusinessLogic/competition"

export async function GET(request) {
    try {
        const result = await bl.getAll()
        return Response.json(result, { status: 200 });
    } catch (err) {
        console.error(err);
        return Response.json({ error: 'failed to load data' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const result = await bl.create(body);
        return Response.json(result, { status: 201 });
    } catch (err) {
        console.error(err);
        return Response.json({ error: 'failed to save data' }, { status: 500 });
    }
}

// export async function PUT(request) {
//     try {
//         const result = await collectedInputData.update(JSON.parse(req.body));
//         if(!result){
//             return Response.json(result, { status: 404 });
//         }
//         return Response.json(result, { status: 200 });
//     } catch (err) {
//         console.error(err);
//         return Response.json({ error: 'failed to update data' }, { status: 500 });
//     }
// }
