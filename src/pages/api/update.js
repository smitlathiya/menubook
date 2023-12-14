import connectDB from '../../lib/db';
import Product from '../../models/Product.JS';
import {IncomingForm} from 'formidable';
import fs from 'fs';


connectDB();

export const config = {
    api: {
      bodyParser: false,
    },
  };

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
          let form = new IncomingForm();
          form.keepExtensions = true;
          form.parse(req, async (err, fields, files) => {
            if (err) {
              return res.status(500).json({ success: false, error: 'Server Error' });
            }
            const { title, price, code, size, pId } = fields;

            if(!pId[0]){
                return res.status(400).send("id not found")
            }    
            // Save product with image data as buffer
            const product = {
              title: title[0],
              price: Number(price[0]),
              code: code[0], 
              size: size[0]
            };
            if(files?.image?.length > 0){
                const imageFile = files.image[0];
              const imageBuffer = fs.readFileSync(imageFile.filepath);
              product.image = {
                data: imageBuffer,
                contentType: imageFile.mimetype
              }
            }

            await Product.findByIdAndUpdate(
                pId[0],
                { ...product },
                { new: true, runValidators: true }
              );
    
            res.status(201).json({ success: true, data: "data updated" });
          });
        } catch (error) {
          res.status(500).json({ success: false, error: 'Server Error' });
        }
      } else {
        res.status(405).json({ success: false, error: 'Method Not Allowed' });
      }
}
