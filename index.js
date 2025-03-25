const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect('mongodb+srv://duongkimnam2142002:ykjNnG4DVrN5f5uQ@cluster0.8yf29.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const caseSchema = new mongoose.Schema({
  title: { type: String, unique: true },
  case_id: { type: String, unique: true },
    department: String,
    type: String,
    description: String,
    last_update_date: Date,
});

const Case = mongoose.model('Case', caseSchema);

const app = express();
app.use(express.json());
app.use(cors());

app.get('/cases', async (req, res) => {
    try {
        const filters = req.query;
        const cases = await Case.find(filters);
        res.json(cases);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/cases', async (req, res) => {
    try {
        const newCase = new Case({ ...req.body, last_update_date: new Date() });
        await newCase.save();
        res.status(201).json(newCase);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/cases/:id', async (req, res) => {
    try {
        const caseItem = await Case.findById(req.params.id);
        if (!caseItem) return res.status(404).json({ error: 'Case not found' });
        res.json(caseItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/cases/:id', async (req, res) => {
    try {
        const updatedCase = await Case.findByIdAndUpdate(req.params.id, {...req.body, last_update_date: new Date()}, { new: true });
        if (!updatedCase) return res.status(404).json({ error: 'Case not found' });
        res.json(updatedCase);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/cases/:id', async (req, res) => {
    try {
        const deletedCase = await Case.findByIdAndDelete(req.params.id);
        if (!deletedCase) return res.status(404).json({ error: 'Case not found' });
        res.json({ message: 'Case deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
