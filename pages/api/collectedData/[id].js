import * as collectedInputData from "../../../util/BusinessLogic/collectedInputData"


export default async function handler(req, res) {
    const id = parseInt(req.query.id);
    if(Number.isNaN(id)){
        res.status(400).send();
    }

    if (req.method === 'GET') {
        try {
            const result = await collectedInputData.get(id);
            if(result === false){
                res.status(404).send();
            }
            res.status(200).json({ result })
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'failed to load data' });
        }
    } else if (req.method === 'DELETE') {
        try {
            const result = await collectedInputData.remove(id);
            res.status(204).send();
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'failed to remove data' });
        }
    }
      
    
  }