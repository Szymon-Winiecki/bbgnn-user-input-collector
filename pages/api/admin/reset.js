import * as collectedInputData from "../../../util/BusinessLogic/collectedInputData"


export default function handler(req, res) {
    if (req.method === 'GET') {
        collectedInputData.resetStorage();
        res.status(200).json({ message: 'Success!' });
      } else {
        res.status(404).json({ message: 'Hello from Next.js!' });
      }
      
    
  }