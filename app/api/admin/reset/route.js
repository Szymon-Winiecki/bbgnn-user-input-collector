import * as collectedInputData from "../../../../util/BusinessLogic/system"


export async function GET(request) {
  collectedInputData.resetStorage();
  return new Response(null, { status: 200 });
}