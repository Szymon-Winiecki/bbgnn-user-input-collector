import { splitIntoWords } from "../../../../../util/collectedDataTransformations/dataSplitting";


export async function POST(request) {
    try {
        const body = await request.json();
        const result = splitIntoWords(body);
        return Response.json(result, { status: 200 });
    } catch (err) {
        console.error(err);
        return Response.json({ error: 'failed to split data' }, { status: 500 });
    }
}
