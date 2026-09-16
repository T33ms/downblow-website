require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');
const crypto = require('crypto');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
const SECRET = process.env.PAYSTACK_SECRET_KEY;
const PUBLIC = process.env.PAYSTACK_PUBLIC_KEY;

function requirePaystack(res){
  if(!SECRET || SECRET.includes('your_secret_key')) {
    res.status(503).json({error:'Paystack is not configured yet. Add PAYSTACK_SECRET_KEY to your .env file.'});
    return false;
  }
  return true;
}

app.post('/api/paystack/initialize', async (req,res)=>{
  if(!requirePaystack(res)) return;
  const {name,email,phone,state,address,items,subtotal}=req.body;
  if(!name||!email||!phone||!state||!address||!Array.isArray(items)||!subtotal) return res.status(400).json({error:'Missing required order information.'});
  try{
    // Delivery is intentionally configurable. Set real state fees before production.
    const deliveryFees = {Oyo:0,Lagos:0,Osun:0,Ogun:0,FCT:0,Rivers:0,Kano:0,Other:0};
    const deliveryFee = deliveryFees[state] ?? 0;
    const total = Number(subtotal) + Number(deliveryFee);
    const reference = 'DWN-' + Date.now() + '-' + crypto.randomBytes(3).toString('hex').toUpperCase();

    // In production, persist the pending order in your database before redirecting to Paystack.
    const response = await axios.post('https://api.paystack.co/transaction/initialize',{
      email,
      amount: Math.round(total * 100),
      reference,
      callback_url: `${req.protocol}://${req.get('host')}/payment-success.html`,
      metadata:{business:'Downblow Global Tecnology',name,phone,state,address,items,subtotal,deliveryFee,total}
    },{headers:{Authorization:`Bearer ${SECRET}`,'Content-Type':'application/json'}});
    res.json({authorization_url:response.data.data.authorization_url,reference});
  }catch(err){res.status(502).json({error:err.response?.data?.message||'Paystack initialization failed.'});}
});

app.post('/api/paystack/preorder', async (req,res)=>{
  if(!requirePaystack(res)) return;
  const {name,email,phone,state,storage,colour}=req.body;
  const deposit = 500000; // Placeholder: change to the official Downblow preorder deposit.
  if(!name||!email||!phone||!state) return res.status(400).json({error:'Missing required preorder information.'});
  try{
    const reference='DWN-PRE-' + Date.now() + '-' + crypto.randomBytes(3).toString('hex').toUpperCase();
    const response=await axios.post('https://api.paystack.co/transaction/initialize',{
      email,amount:deposit*100,reference,
      callback_url:`${req.protocol}://${req.get('host')}/payment-success.html`,
      metadata:{business:'Downblow Global Tecnology',type:'iPhone 18 Pro Max preorder deposit',name,phone,state,storage,colour,deposit}
    },{headers:{Authorization:`Bearer ${SECRET}`,'Content-Type':'application/json'}});
    res.json({authorization_url:response.data.data.authorization_url,reference});
  }catch(err){res.status(502).json({error:err.response?.data?.message||'Paystack preorder initialization failed.'});}
});

app.get('/api/paystack/verify/:reference', async (req,res)=>{
  if(!requirePaystack(res)) return;
  try{
    const r=await axios.get(`https://api.paystack.co/transaction/verify/${encodeURIComponent(req.params.reference)}`,{headers:{Authorization:`Bearer ${SECRET}`}});
    res.json(r.data);
  }catch(err){res.status(502).json({error:err.response?.data?.message||'Verification failed.'});}
});

app.get('/payment-success.html',(req,res)=>{
  res.sendFile(path.join(__dirname,'public','payment-success.html'));
});

app.listen(PORT,()=>console.log(`Downblow site running on http://localhost:${PORT}`));
