import * as collectedInputData from "../../../../util/BusinessLogic/collectedInputData"


export async function GET(request) {
  collectedInputData.resetStorage();
  return new Response(null, { status: 200 });
}