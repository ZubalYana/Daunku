const express = require('express')
const app = express();
const path = require('path')
const PORT = 3000;
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const TOKEN = '7001481150:AAFzGDhvR5Ks1jbS_bhe3WwORZl4_Vrheoo';
const bot = new TelegramBot(TOKEN, { polling: false });
const nodemailer = require('nodemailer');
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())

mongoose.connect(`mongodb+srv://root:py6czQnOyXhFPkng@cluster0.ybpep9u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
.then(()=>{
    console.log(`Connected to mongo DB`)
})

const Plants = mongoose.model('Plants', {title: String, price: Number, image: String, rating: Number})
const Contacts = mongoose.model('Contacts', { address: String, phone: String, email: String });
const Orders = mongoose.model('Orders', { list: Array, name: String, phone: String, status: Boolean, message: String})
const Mail = mongoose.model('Mail', { email: String });


app.post('/add-plants', async (req, res) => {
    console.log(req.body)
    try {
        const { title, price, image, rating } = req.body;
        const plants = new Plants({ title, price, image, rating });
        await plants.save();
        console.log(`Plants created`);
        res.status(201).json(plants);
    } catch (err) {
        res.status(500).json({ message: err })
    }
})
app.post('/contacts', async (req, res)=>{
    console.log(req.body)
    try {
        const { phone } = req.body;
        const { address } = req.body;
        const { email } = req.body;
        const contacts = new Contacts({address, phone, email})
        await contacts.save();
        console.log('Contacts were changed');
        res.status(201).json(contacts);
    } catch (err) {
        res.status(500).json({ message: err });
    }
})
app.get('/getContacts', async (req, res)=>{
    try {
        const contacts = await Contacts.find();
        res.json(contacts)
    } catch (err) {
        res.status(500).json({ message: err })
    }
})
app.get('/plants', async (req, res)=>{
    try {
        const plants = await Plants.find();
        res.json(plants)
    } catch (err) {
        res.status(500).json({ message: err })
    }
})
app.delete('/plant/:id', async ( req, res )=>{
    try {
        const id = req.params.id;
        console.log(id);
        await Plants.findByIdAndDelete(id);
        res.status(204).end();
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
})
app.put('/edit-plant/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const plant = await Plants.findByIdAndUpdate(id, req.body, { new: true });
        res.status(201).json(plant);
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
})
app.get('/', (req, res)=>{
    res.sendFile('public', 'index.html')
})
app.get('/admin', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public'))
})
app.post('/new-order', async (req, res) => {
    try {
        let { list, name, phone, message } = req.body;
        const order = new Orders({ list, name, phone, status: false, message });
        await order.save();
        console.log('New order saved');
        res.status(201).json(order);
        //telegram bot 
        await bot.sendMessage(1132590035, `You have a new order! Come and see: https://daunku.onrender.com/admin/`);
        console.log('Telegram message sent');

    } catch (err) {
        res.status(500).json({ message: err });
    }
})
app.get('/orders', async (req, res) => {
    try {
        const orders = await Orders.find();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err });
    }
})
app.delete('/orders/:id', async ( req, res )=>{
    try {
        const id = req.params.id;
        console.log(id);
        await Orders.findByIdAndDelete(id);
        res.status(204).end();
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
})
app.get('/getOrders/:id', async ( req, res )=>{
    try {
        const id = req.params.id;
        let order = await Orders.findById(id);
        console.log(id);
        res.json(order);
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
})
app.put('/edit-orderStatus/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedStatus = req.body.status;
        const order = await Orders.findByIdAndUpdate(id, { status: updatedStatus }, { new: true });
        if (order) {
            res.status(200).json(order);
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'youremail@gmail.com',
        pass: 'yourpassword'
    }
});

// Endpoint to save new emails
app.post('/send-mail', async (req, res) => {
    try {
        const { email } = req.body;
        const mail = new Mail({ email });
        await mail.save();
        console.log(`Add new mail: ${email}`);
        res.status(201).json(mail);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

// Endpoint to get all emails
app.get('/emails', async (req, res) => {
    try {
        const mail = await Mail.find();
        res.json(mail);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

// Endpoint to send message to all subscribers
app.post('/send-message', async (req, res) => {
    const { message } = req.body;
    try {
        const mail = await Mail.find();
        const emailList = mail.map(el => el.email);
        console.log(emailList);

        // Batch sending emails
        let batchIndex = 0;
        const batchSize = 10;

        const sendBatchEmails = setInterval(() => {
            const batch = emailList.slice(batchIndex, batchIndex + batchSize);
            if (batch.length === 0) {
                clearInterval(sendBatchEmails);
                console.log('All emails sent');
                res.status(200).json({ message: 'All emails sent' });
                return;
            }

            batch.forEach(email => {
                const mailOptions = {
                    from: 'youremail@gmail.com',
                    to: email,
                    subject: 'Sending Email using Node.js',
                    text: message
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            });

            batchIndex += batchSize;
        }, 1000);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, ()=>{
    console.log(`Server work on PORT: ${PORT}`)
})