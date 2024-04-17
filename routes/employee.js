const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Employee = require('../models/employee');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const csv = require('csv-parser');

router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const searchQuery = req.query.search || '';
        const whereClause = {
            [Op.or]: [
                { name: { [Op.iLike]: `%${searchQuery}%` } },
                { whatsapp_number: { [Op.iLike]: `%${searchQuery}%` } },
                { nik: { [Op.iLike]: `%${searchQuery}%` } }
            ]
        };

        const totalCount = await Employee.count({ where: whereClause });
        const totalPages = Math.ceil(totalCount / limit);

        const data = await Employee.findAll({
            where: whereClause,
            offset,
            limit,
            order: [
                ['updatedAt', 'DESC'],
                ['createdAt', 'DESC']
            ]
        });

        res.json({ data, totalPages, totalCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const data = await Employee.findByPk(req.params.id);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, whatsapp_number, nik, date_of_entry, status, departement, position } = req.body;
        const newEmployee = await Employee.create({ name, whatsapp_number, nik, date_of_entry, status, departement, position, createdBy: req.user.id });
        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(400).json({ message: error.original.message });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { name, whatsapp_number, nik, date_of_entry, status, departement, position } = req.body;
        const [updated] = await Employee.update({ name, whatsapp_number, nik, date_of_entry, status, departement, position, updatedBy: req.user.id }, {
            where: { id }
        });
        if (updated) {
            const updatedEmployee = await Employee.findOne({ where: { id } });
            res.json(updatedEmployee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Employee.destroy({
            where: { id }
        });
        if (deleted) {
            res.json({ message: 'Employee deleted' });
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/upload', upload.single('csvFile'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No files were uploaded.');
        }

        const csvFile = req.file.path;

        const results = [];
        fs.createReadStream(csvFile)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                try {
                    await Employee.bulkCreate(results);
                    res.status(200).send('File uploaded successfully.');
                } catch (error) {
                    res.status(500).send(error.message);
                } finally {
                    fs.unlinkSync('temp.csv'); // Delete temporary CSV file
                }
            });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;