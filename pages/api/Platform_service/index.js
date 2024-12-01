import connectMongo from '@/lib/db.js';

export default async function handler(req, res) {
    await connectMongo();

    if (req.method === 'GET') {

        res.status(200).json("welcome Platform services");
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
