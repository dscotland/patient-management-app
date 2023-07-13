import { type NextApiRequest, type NextApiResponse } from "next";
import axios from 'axios';

const getIPAddress = async (req: NextApiRequest, res: NextApiResponse) => {
    try{
        const response = await axios.get('https://geolocation-db.com/json/');
        res.status(200).json({ response })
    } catch(err){
        res.status(500).json({ error: 'failed to load data' })
    }
  };