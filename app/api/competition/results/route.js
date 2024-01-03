import * as bl from "../../../../util/BusinessLogic/competition"

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const query = Object.fromEntries(searchParams);
        if(!query.user) return Response.json(null, { status: 400 });
        const result = await bl.getResultsForUser(query.user);
        return Response.json(result, { status: 200 });
    } catch (err) {
        console.error(err);
        return Response.json({ error: 'failed to load data' }, { status: 500 });
    }
}
