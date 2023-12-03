import * as collectedInputData from "../../../util/BusinessLogic/collectedInputData"


export async function GET(request) {
    try {
        const result = await collectedInputData.getAllUsers()
        return Response.json(result, { status: 200 });
    } catch (err) {
        console.error(err);
        return Response.json({ error: 'failed to load data' }, { status: 500 });
    }
}
