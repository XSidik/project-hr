const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Salary = require('../models/transalary');
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
        Salary.belongsTo(Employee, { foreignKey: 'nik', targetKey: 'nik' });
        Employee.hasMany(Salary, { foreignKey: 'nik', sourceKey: 'nik' });

        const searchQuery = req.query.search || '';
        const whereEmployee = {
            [Op.or]: [
                { name: { [Op.iLike]: `%${searchQuery}%` } },
                { nik: { [Op.iLike]: `%${searchQuery}%` } }
            ]
        };

        // const whereSalary = {
        //     [Op.or]: [
        //         { tanggal_gaji: { [Op.iLike]: `%${searchQuery}%` } },
        //         { nik: { [Op.iLike]: `%${searchQuery}%` } }
        //     ]
        // };

        const totalCount = await Salary.count({
            include: [{
                model: Employee,
                where: whereEmployee
            }],
            // where: whereSalary
        });

        const totalPages = Math.ceil(totalCount / limit);

        const data = await Salary.findAll({
            include: [{
                model: Employee,
                where: whereEmployee
            }],
            // where: whereSalary,
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

// router.get('/:id', async (req, res) => {
//     try {
//         const data = await Salary.findByPk(req.params.id);
//         res.json(data);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// router.post('/', async (req, res) => {
//     try {
//         const { name, whatsapp_number, nik, date_of_entry, status, departement, position } = req.body;
//         const newSalary = await Salary.create({ name, whatsapp_number, nik, date_of_entry, status, departement, position, createdBy: req.user.id });
//         res.status(201).json(newSalary);
//     } catch (error) {
//         res.status(400).json({ message: error.original.message });
//     }
// });

// router.put('/:id', async (req, res) => {
//     const { id } = req.params;
//     try {
//         const { name, whatsapp_number, nik, date_of_entry, status, departement, position } = req.body;
//         const [updated] = await Salary.update({ name, whatsapp_number, nik, date_of_entry, status, departement, position, updatedBy: req.user.id }, {
//             where: { id }
//         });
//         if (updated) {
//             const updatedSalary = await Salary.findOne({ where: { id } });
//             res.json(updatedSalary);
//         } else {
//             res.status(404).json({ message: 'Salary not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// router.delete('/:id', async (req, res) => {
//     const { id } = req.params;
//     try {
//         const deleted = await Salary.destroy({
//             where: { id }
//         });
//         if (deleted) {
//             res.json({ message: 'Salary deleted' });
//         } else {
//             res.status(404).json({ message: 'Salary not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

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
                    await Salary.bulkCreate(results);
                    res.status(200).send('File uploaded successfully.');
                } catch (error) {
                    res.status(500).send(error.message);
                } finally {
                    fs.unlinkSync(csvFile); // Delete temporary CSV file
                }
            });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;