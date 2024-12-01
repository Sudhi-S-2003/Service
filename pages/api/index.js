import connectMongo from '../../lib/db';

export default async function handler(req, res) {
    await connectMongo();

    if (req.method === 'GET') {

        res.status(200).json("welcome services");
    } else if (req.method === 'POST') {
        res.status(201).json("welcome services");
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
