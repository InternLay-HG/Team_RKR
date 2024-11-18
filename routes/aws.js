import { Router } from "express";
const router = Router();
import { getObjectURL,putObject,deleteObject } from "../services/aws.js";
router.get('/uploads/:key',async (req,res)=>{
    const key=req.params.key;
    const url=await getObjectURL(key);
    res.send(url);
  });
  router.post('/uploads',async (req,res)=>{
    const {filename,contentType}=req.body;
    const url=await putObject(filename,contentType);
    res.send(url);
  });
  router.delete('/uploads/:key', async (req, res) => {
    const key = req.params.key;
    await deleteObject(key);
    res.send("File deleted");
  });
 export default router; 