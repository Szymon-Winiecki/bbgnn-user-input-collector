import * as collectedInputData from "../../util/BusinessLogic/collectedInputData"


export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const result = await collectedInputData.getAll()
            res.status(200).json({ result });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'failed to load data' });
        }
    } else if (req.method === 'POST') {
        try {
            const result = await collectedInputData.add(JSON.parse(req.body));
            res.status(201).send();
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'failed to save data' });
        }
    } else if (req.method === 'PUT'){
        try {
            const result = await collectedInputData.update(JSON.parse(req.body));
            if(!result){
                res.status(404).send();
            }
            res.status(200).json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'failed to update data' });
        }
    } 
    
  }