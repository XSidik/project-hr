const express = require('express');
const router = express.Router();
const path = require('path');
const qrcode = require('qrcode');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const Wa = require('../models/wa');
const { Op } = require('sequelize');
const fs = require('fs');
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const Salary = require('../models/transalary');
const Employee = require('../models/employee');
const Company = require('../models/company');

const puppeteer = require('puppeteer');

const client = new Client({
    restartOnAuthFail: true,
    authStrategy: new LocalAuth()
});


module.exports = function (io) {

    router.get('/', (req, res) => {
        res.sendFile('./public/whatsapp.html', { root: path.join(__dirname, '../') });
    });

    const today = new Date();
    const now = today.toLocaleString();

    client.on('qr', (qr) => {
        qrcode.toDataURL(qr, (err, url) => {
            // Emit QR code to connected sockets
            // You need to set up socket.io for this to work
            io.emit("qr", url);
            io.emit('message', `${now} QR Code received`);
        });
    });

    client.on('ready', () => {
        io.emit('message', `${now} WhatsApp is ready!`);
    });

    client.on('message', msg => {
        if (msg.body === '!ping') {
            msg.reply('pong');
        } else if (msg.body === 'skuy') {
            msg.reply('helo ma bradah');
        }
    });

    client.on('authenticated', async (session) => {
        io.emit('message', `${now} Whatsapp is authenticated!`);

    });

    client.on('auth_failure', function (session) {
        io.emit('message', `${now} Auth failure, restarting...`);
    });

    client.on('disconnected', async (session) => {
        io.emit('message', `${now} Disconnected`);
        client.destroy();
        client.initialize();


    });

    client.initialize();

    // send message routing
    router.post('/send', async (req, res) => {
        const data = req.body;
        const phone = "62" + data.phone.substring(1) + "@c.us";
        const message = data.message;

        client.sendMessage(phone, message)
            .then(response => {
                res.status(200).json({
                    error: false,
                    data: {
                        message: 'Pesan terkirim',
                        meta: response,
                    },
                });
            })
            .catch(error => {
                res.status(200).json({
                    error: true,
                    data: {
                        message: 'Error send message',
                        meta: error,
                    },
                });
            });
    });

    async function getDataSalary() {
        const whereSalary = {
            status: {
                [Op.is]: null
            }
        };

        const data = await Salary.findAll({
            include: [{
                model: Employee,
            }],
            where: whereSalary,
        });

        return data;
    }

    async function getDataCompany() {
        const data = await Company.findOne();
        return data;
    }

    async function getDataEmployee() {
        const data = await Employee.findAll();
        return data;
    }

    function getStringDate(data) {
        const dtDate = new Date(data);

        // Array of month names
        const monthNames = [
            'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
            'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
        ];

        // Get the month and year from the date
        const month = monthNames[dtDate.getMonth()];
        const year = dtDate.getFullYear();

        // Format the date string as "NOV2023"
        const formattedDate = `${month}${year}`;

        return formattedDate;
    }

    function getImageAsBase64(filePath) {
        const fullPath = path.resolve(filePath);
        const fileData = fs.readFileSync(fullPath);
        const base64Image = new Buffer.from(fileData).toString('base64');
        return `data:image/png;base64,${base64Image}`;
    }


    async function createPDF(dataSalary, dataCompany, dataEmployee, index) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // HTML content that you want to convert to PDF
        const imagePath = path.join(__dirname, '../', './public/images', dataCompany.image);

        const imageBase64 = getImageAsBase64(imagePath);

        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>A5 Page Size</title>
        <style>
        @page {
            size: A4 landscape;
            margin: 0;
          }
          body {
            margin: 0;
            font-family: Arial, sans-serif;
            padding: 20px;
            box-sizing: border-box;
            width: 297mm;
            height: 210mm;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 12px;
          }
          .content {
            width: 80%;
          }
        </style>
        </head>
        <body>
        <table border="0" cellpadding="0" cellspacing="0" width="1350" style="border-collapse:
            collapse;table-layout:fixed;width:1016pt">
            <colgroup>
            <col class="xl205" width="42" style="mso-width-source:userset;mso-width-alt:1536;
            width:32pt">
            <col class="xl370" width="14" style="mso-width-source:userset;mso-width-alt:512;
            width:11pt">
            <col class="xl370" width="13" style="mso-width-source:userset;mso-width-alt:475;
            width:10pt">
            <col class="xl370" width="35" style="mso-width-source:userset;mso-width-alt:1280;
            width:26pt">
            <col class="xl370" width="194" style="mso-width-source:userset;mso-width-alt:7094;
            width:146pt">
            <col class="xl370" width="41" style="mso-width-source:userset;mso-width-alt:1499;
            width:31pt">
            <col class="xl370" width="62" style="mso-width-source:userset;mso-width-alt:2267;
            width:47pt">
            <col class="xl370" width="92" style="mso-width-source:userset;mso-width-alt:3364;
            width:69pt">
            <col class="xl370" width="34" style="mso-width-source:userset;mso-width-alt:1243;
            width:26pt">
            <col class="xl370" width="87" style="mso-width-source:userset;mso-width-alt:3181;
            width:65pt">
            <col class="xl370" width="11" style="mso-width-source:userset;mso-width-alt:402;
            width:8pt">
            <col class="xl370" width="25" style="mso-width-source:userset;mso-width-alt:914;
            width:19pt">
            <col class="xl370" width="61" style="mso-width-source:userset;mso-width-alt:2230;
            width:46pt">
            <col class="xl370" width="121" style="mso-width-source:userset;mso-width-alt:4425;
            width:91pt">
            <col class="xl370" width="48" style="mso-width-source:userset;mso-width-alt:1755;
            width:36pt">
            <col class="xl370" width="44" style="mso-width-source:userset;mso-width-alt:1609;
            width:33pt">
            <col class="xl370" width="96" style="mso-width-source:userset;mso-width-alt:3510;
            width:72pt">
            <col class="xl370" width="115" style="mso-width-source:userset;mso-width-alt:4205;
            width:86pt">
            </colgroup>
            <tbody>
            <tr height="24" style="mso-height-source:userset;height:18.0pt">
                <td height="24" class="xl207" width="42" style="height:18.0pt;width:32pt"></td>
                <td width="14" style="width:11pt" align="left" valign="top">
                <span style="mso-ignore:vglayout;
            position:absolute;z-index:1;margin-left:7px;margin-top:4px;width:60px;
            height:40px">
                    <img width="50" height="40" src="${imageBase64}" v:shapes="Picture_x0020_247">
                </span>
                <span style="mso-ignore:vglayout2">
                    <table cellpadding="0" cellspacing="0">
                    <tbody>
                        <tr>
                        <td height="24" class="xl368" width="14" style="height:18.0pt;width:11pt">
                            <a name="Print_Area"></a>
                        </td>
                        </tr>
                    </tbody>
                    </table>
                </span>
                </td>
                <td class="xl369" width="13" style="width:10pt"></td>
                <td class="xl370" width="35" style="width:26pt"></td>
                <td colspan="6" class="xl684" width="510" style="width:384pt">${dataCompany.name}</td>
                <td class="xl371" width="11" style="width:8pt"></td>
                <td colspan="7" class="xl685" width="510" style="width:383pt; padding-left:270px">SLIP GAJI</td>
            </tr>
            <tr height="24" style="mso-height-source:userset;height:18.0pt">
                <td height="24" class="xl206" style="height:18.0pt"></td>
                <td class="xl372"></td>
                <td class="xl370"></td>
                <td class="xl373"></td>
                <td class="xl374" colspan="3" style="mso-ignore:colspan">${dataCompany.sub_name}</td>
                <td class="xl375"></td>
                <td class="xl375"></td>
                <td class="xl375"></td>
                <td class="xl373"></td>
                <td class="xl373"></td>
                <td colspan="6" class="xl688" style="width:383pt; padding-left:200px">PRIBADI &amp; RAHASIA</td>
            </tr>
            <tr height="22" style="mso-height-source:userset;height:16.5pt">
                <td height="22" class="xl206" style="height:16.5pt"></td>
                <td colspan="3" class="xl686" style="border-top: 1px solid #000; border-left: 1px solid #000;">
                <span style="mso-spacerun:yes">&nbsp;</span>Nama <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl376" style="border-top: 1px solid #000;">
                <span style="mso-spacerun:yes">&nbsp;</span>${dataEmployee.name} <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl377" colspan="2" style="mso-ignore:colspan; border-top: 1px solid #000;">
                <span style="mso-spacerun:yes">&nbsp;</span>N.I.K. <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl378" style="border-top: 1px solid #000;">${dataEmployee.nik}</td>
                <td class="xl377" style="border-top: 1px solid #000;">
                <span style="mso-spacerun:yes">&nbsp;</span>S <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl379" style="border-top: 1px solid #000; border-right: 1px solid #000;">
                <span
                    style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>-
                </td>
                <td class="xl380"></td>
                <td class="xl381">D</td>
                <td class="xl382" colspan="3" style="mso-ignore:colspan">
                <span style="mso-spacerun:yes">&nbsp;</span>PENDAPATAN LAIN-LAIN : <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl382"></td>
                <td class="xl382"></td>
                <td class="xl382"></td>
            </tr>
            <tr height="22" style="mso-height-source:userset;height:16.5pt">
                <td height="22" class="xl206" style="height:16.5pt"></td>
                <td colspan="3" class="xl680" style="border-left: 1px solid #000;">
                <span style="mso-spacerun:yes">&nbsp;</span>Bagian <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl383">
                <span style="mso-spacerun:yes">&nbsp;</span>${dataEmployee.departement} <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl384" colspan="2" style="mso-ignore:colspan">
                <span style="mso-spacerun:yes">&nbsp;</span>Masa Kerja <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl384">
                <span
                    style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>2
                </td>
                <td class="xl384">
                <span style="mso-spacerun:yes">&nbsp;</span>IK <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl385" style="border-right: 1px solid #000;">
                <span
                    style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>-
                </td>
                <td class="xl384"></td>
                <td class="xl381"></td>
                <td class="xl384" colspan="2" style="mso-ignore:colspan">
                <span style="mso-spacerun:yes">&nbsp;</span>Upah Lembur Hari Biasa <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl387">${dataSalary.upah_lembur_hari_biasa_jam}</td>
                <td class="xl387">Jam</td>
                <td rowspan="2" class="xl681" width="96" style="width:72pt">
                <span style="mso-spacerun:yes">&nbsp;</span>Rp <span style="mso-spacerun:yes">&nbsp;&nbsp; </span>${dataSalary.upah_lembur_hari_biasa_harga}
                </td>
                <td class="xl388">
                <span style="mso-spacerun:yes">&nbsp;</span>Rp <span style="mso-spacerun:yes">&nbsp; </span>${dataSalary.upah_lembur_hari_biasa_jam * dataSalary.upah_lembur_hari_biasa_harga}
                </td>
            </tr>
            <tr height="22" style="mso-height-source:userset;height:16.5pt">
                <td height="22" class="xl206" style="height:16.5pt"></td>
                <td colspan="3" class="xl680" style="border-left: 1px solid #000;">
                <span style="mso-spacerun:yes">&nbsp;</span>Jabatan <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl383">
                <span style="mso-spacerun:yes">&nbsp;</span>${dataEmployee.position} <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl384"></td>
                <td class="xl384"></td>
                <td class="xl384"></td>
                <td class="xl384">
                <span style="mso-spacerun:yes">&nbsp;</span>IB <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl385" style="border-right: 1px solid #000;">
                <span
                    style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>-
                </td>
                <td class="xl384"></td>
                <td class="xl381"></td>
                <td class="xl384" colspan="2" style="mso-ignore:colspan">
                <span style="mso-spacerun:yes">&nbsp;</span>Upah Lembur Hari Libur <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl387">${dataSalary.upah_lembur_hari_libur_jam}</td>
                <td class="xl387">Jam</td>
                <td class="xl388">
                <span style="mso-spacerun:yes">&nbsp;</span>Rp <span
                    style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>${dataSalary.upah_lembur_hari_libur_jam * dataSalary.upah_lembur_hari_libur_harga}
                </td>
            </tr>
            <tr height="22" style="mso-height-source:userset;height:16.5pt">
                <td height="22" class="xl206" style="height:16.5pt"></td>
                <td class="xl389" style="border-left: 1px solid #000; border-bottom: 1px solid #000;">&nbsp;</td>
                <td colspan="2" class="xl682" style="border-bottom: 1px solid #000;">&nbsp;</td>
                <td class="xl390" style="border-bottom: 1px solid #000;">
                <span style="mso-spacerun:yes">&nbsp;</span>${getStringDate(dataSalary.tanggal_gaji)}
                </td>
                <td class="xl391" colspan="2" style="mso-ignore:colspan; border-bottom: 1px solid #000;">
                <span style="mso-spacerun:yes">&nbsp;</span>SLIP NO <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl392" style="border-bottom: 1px solid #000;">${index}</td>
                <td class="xl393" style="border-bottom: 1px solid #000;">
                <span style="mso-spacerun:yes">&nbsp;</span>C <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl394" style="border-bottom: 1px solid #000; border-right: 1px solid #000;">
                <span
                    style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>-
                </td>
                <td class="xl380"></td>
                <td class="xl381">E</td>
                <td class="xl382" colspan="2" style="mso-ignore:colspan">
                <span style="mso-spacerun:yes">&nbsp;</span>Komplain Bulan Lalu <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl382"></td>
                <td class="xl382"></td>
                <td class="xl382"></td>
                <td class="xl382"></td>
            </tr>
            <tr height="22" style="mso-height-source:userset;height:16.5pt">
                <td height="22" class="xl206" style="height:16.5pt"></td>
                <td class="xl395"></td>
                <td class="xl395"></td>
                <td class="xl395"></td>
                <td class="xl383"></td>
                <td class="xl382"></td>
                <td class="xl382"></td>
                <td class="xl382"></td>
                <td class="xl382"></td>
                <td class="xl380"></td>
                <td class="xl380"></td>
                <td class="xl381">F</td>
                <td class="xl382" colspan="2" style="mso-ignore:colspan">
                <span style="mso-spacerun:yes">&nbsp;</span>PENGGANTIAN CUTI <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl384">
                <span style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>-
                </td>
                <td class="xl382">
                <span style="mso-spacerun:yes">&nbsp;</span>Hari <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl396">
                <span style="mso-spacerun:yes">&nbsp;</span>Rp188,429
                </td>
                <td class="xl551">
                <span
                    style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>- <span style="mso-spacerun:yes">&nbsp;&nbsp; </span>
                </td>
            </tr>
            <tr height="22" style="mso-height-source:userset;height:16.5pt">
                <td height="22" class="xl206" style="height:16.5pt"></td>
                <td colspan="2" class="xl375">A</td>
                <td colspan="5" class="xl382">
                <span style="mso-spacerun:yes">&nbsp;</span>UPAH POKOK <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl382">
                <span style="mso-spacerun:yes">&nbsp;</span>Rp <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl398">
                <span style="mso-spacerun:yes">&nbsp;</span>${dataSalary.upah_pokok}
                </td>
                <td class="xl388"></td>
                <td colspan="6" class="xl375">Sub Total-3</td>
                <td class="xl399">
                <span style="mso-spacerun:yes">&nbsp;</span>Rp <span style="mso-spacerun:yes">&nbsp; </span>${dataSalary.upah_lembur_hari_biasa_jam * dataSalary.upah_lembur_hari_biasa_harga + dataSalary.upah_lembur_hari_libur_jam * dataSalary.upah_lembur_hari_libur_harga}
                </td>
            </tr>
            <tr height="22" style="mso-height-source:userset;height:16.5pt">
                <td height="22" class="xl206" style="height:16.5pt"></td>
                <td colspan="2" class="xl375">B</td>
                <td colspan="5" class="xl382">
                <span style="mso-spacerun:yes">&nbsp;</span>TUNJANGAN TETAP : <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl382"></td>
                <td class="xl398"></td>
                <td class="xl388"></td>
                <td colspan="6" class="xl375">TOTAL PENGHASILAN <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl399">
                <span style="mso-spacerun:yes">&nbsp;</span>Rp <span style="mso-spacerun:yes">&nbsp; </span>7,119,704
                </td>
            </tr>
            <tr height="22" style="mso-height-source:userset;height:16.5pt">
                <td height="22" class="xl206" style="height:16.5pt"></td>
                <td colspan="2" class="xl375"></td>
                <td class="xl384">
                <span style="mso-spacerun:yes">&nbsp;&nbsp; </span>1
                </td>
                <td colspan="4" class="xl382">
                <span style="mso-spacerun:yes">&nbsp;</span>Tunjangan Jabatan <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl382">
                <span style="mso-spacerun:yes">&nbsp;</span>Rp <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl398">
                <span
                    style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>${dataSalary.tunjangan_jabatan}
                </td>
                <td class="xl388"></td>
                <td class="xl384" colspan="3" style="mso-ignore:colspan">
                <span style="mso-spacerun:yes">&nbsp;</span>POTONGAN : <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl384"></td>
                <td class="xl384"></td>
                <td class="xl384"></td>
                <td class="xl384"></td>
            </tr>
            <tr height="22" style="mso-height-source:userset;height:16.5pt">
                <td height="22" class="xl206" style="height:16.5pt"></td>
                <td colspan="2" class="xl375"></td>
                <td class="xl384">
                <span style="mso-spacerun:yes">&nbsp;&nbsp; </span>2
                </td>
                <td colspan="4" class="xl382">
                <span style="mso-spacerun:yes">&nbsp;</span>Tunjangan Masa Kerja <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl382">
                <span style="mso-spacerun:yes">&nbsp;</span>Rp <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl398">
                <span style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>${dataSalary.tunjangan_masa_kerja}
                </td>
                <td class="xl388"></td>
                <td class="xl400" align="right">1</td>
                <td class="xl384" colspan="2" style="mso-ignore:colspan">
                <span style="mso-spacerun:yes">&nbsp;</span>Absensi (Ketidakhadiran) <span
                    style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl401">
                <span style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>-
                </td>
                <td class="xl401">
                <span style="mso-spacerun:yes">&nbsp;</span>Hari <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl388">
                <span style="mso-spacerun:yes">&nbsp;</span>Rp188,429
                </td>
                <td class="xl388">
                <span style="mso-spacerun:yes">&nbsp;</span>Rp <span
                    style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>${dataSalary.potongan_absensi}
                </td>
            </tr>
            <tr height="22" style="mso-height-source:userset;height:16.5pt">
                <td height="22" class="xl206" style="height:16.5pt"></td>
                <td colspan="7" class="xl409" style="padding-left: 200px; font-weight: bold;">Sub Total-1</td>
                <td class="xl382">
                <span style="mso-spacerun:yes">&nbsp;</span>Rp <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl398">
                <span style="mso-spacerun:yes">&nbsp;</span>5,697,861
                </td>
                <td class="xl388"></td>
                <td class="xl400" align="right">2</td>
                <td class="xl382" colspan="3" style="mso-ignore:colspan">
                <span style="mso-spacerun:yes">&nbsp;</span>Jamsostek &amp; BPJS ---- (JHT 3%) <span
                    style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl382"></td>
                <td class="xl382"></td>
                <td class="xl388">
                <span style="mso-spacerun:yes">&nbsp;</span>Rp <span style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp;&nbsp;
                </span>${dataSalary.potongan_bpjs_dan_jamsostek}
                </td>
            </tr>
            <tr height="22" style="mso-height-source:userset;height:16.5pt">
                <td height="22" class="xl206" style="height:16.5pt"></td>
                <td colspan="2" class="xl375">C</td>
                <td colspan="7" class="xl382">
                <span style="mso-spacerun:yes">&nbsp;</span>TUNJANGAN TIDAK TETAP : <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl382"></td>
                <td class="xl400" align="right">3</td>
                <td class="xl382" colspan="2" style="mso-ignore:colspan">
                <span style="mso-spacerun:yes">&nbsp;</span>Koperasi <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl382"></td>
                <td class="xl382"></td>
                <td class="xl382"></td>
                <td class="xl388">
                <span style="mso-spacerun:yes">&nbsp;</span>Rp <span style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp;&nbsp;
                </span>100,000
                </td>
            </tr>
            <tr height="22" style="mso-height-source:userset;height:16.5pt">
                <td height="22" class="xl206" style="height:16.5pt"></td>
                <td colspan="2" class="xl375"></td>
                <td class="xl384">
                <span style="mso-spacerun:yes">&nbsp;&nbsp; </span>1
                </td>
                <td class="xl384">
                <span style="mso-spacerun:yes">&nbsp;</span>Tunjangan Transport <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl402">
                <span style="mso-spacerun:yes">&nbsp;&nbsp; </span>19
                </td>
                <td class="xl403">
                <span style="mso-spacerun:yes">&nbsp;</span>Hari <span style="mso-spacerun:yes">&nbsp; </span>x <span
                    style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl388">
                <span style="mso-spacerun:yes">&nbsp;</span>Rp <span style="mso-spacerun:yes">&nbsp; </span>11,500
                </td>
                <td class="xl382">
                <span style="mso-spacerun:yes">&nbsp;</span>Rp <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl398">
                <span style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp; </span>${dataSalary.tunjangan_transport}
                </td>
                <td class="xl388"></td>
                <td class="xl400" align="right">4</td>
                <td class="xl382" colspan="2" style="mso-ignore:colspan">
                <span style="mso-spacerun:yes">&nbsp;</span>Pinjaman <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl382"></td>
                <td class="xl382"></td>
                <td class="xl382"></td>
                <td class="xl388">
                <span style="mso-spacerun:yes">&nbsp;</span>Rp <span
                    style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>${dataSalary.potongan_pinjaman}
                </td>
            </tr>
            <tr height="22" style="mso-height-source:userset;height:16.5pt">
                <td height="22" class="xl206" style="height:16.5pt"></td>
                <td class="xl375"></td>
                <td class="xl375"></td>
                <td class="xl384">
                <span style="mso-spacerun:yes">&nbsp;&nbsp; </span>2
                </td>
                <td class="xl384">
                <span style="mso-spacerun:yes">&nbsp;</span>Tunjangan Uang Makan <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl402">
                <span style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp; </span>- <span style="mso-spacerun:yes">&nbsp;&nbsp; </span>
                </td>
                <td class="xl403">
                <span style="mso-spacerun:yes">&nbsp;</span>Hari <span style="mso-spacerun:yes">&nbsp; </span>x <span
                    style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl388">
                <span style="mso-spacerun:yes">&nbsp;</span>Rp <span style="mso-spacerun:yes">&nbsp; </span>12,000
                </td>
                <td class="xl382">
                <span style="mso-spacerun:yes">&nbsp;</span>Rp <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl398">
                <span
                    style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>${dataSalary.tunjangan_uang_makan}
                </td>
                <td class="xl388"></td>
                <td class="xl400" align="right">5</td>
                <td class="xl382" colspan="2" style="mso-ignore:colspan">
                <span style="mso-spacerun:yes">&nbsp;</span>Lain-lain <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl382"></td>
                <td class="xl382"></td>
                <td class="xl382"></td>
                <td class="xl388">
                <span style="mso-spacerun:yes">&nbsp;</span>Rp <span style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp;&nbsp;
                </span>${dataSalary.potongan_lain_lain}
                </td>
            </tr>
            <tr height="22" style="mso-height-source:userset;height:16.5pt">
                <td height="22" class="xl206" style="height:16.5pt"></td>
                <td colspan="2" class="xl375"></td>
                <td class="xl384">
                <span style="mso-spacerun:yes">&nbsp;&nbsp; </span>3
                </td>
                <td class="xl384">
                <span style="mso-spacerun:yes">&nbsp;</span>Uang Makan (Long Shift-I) <span
                    style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl402">
                <span style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp;&nbsp; </span>4
                </td>
                <td class="xl403">
                <span style="mso-spacerun:yes">&nbsp;</span>Hari <span style="mso-spacerun:yes">&nbsp; </span>x <span
                    style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl388">
                <span style="mso-spacerun:yes">&nbsp;</span>Rp <span style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp; </span>6,000
                </td>
                <td class="xl382">
                <span style="mso-spacerun:yes">&nbsp;</span>Rp <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl398">
                <span style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>${dataSalary.uang_makan_Long_shift1}
                </td>
                <td class="xl388"></td>
                <td colspan="6" class="xl375">Sub Total-1</td>
                <td class="xl399">
                <span style="mso-spacerun:yes">&nbsp;</span>Rp <span style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp;&nbsp;
                </span>369,586
                </td>
            </tr>
            <tr height="22" style="mso-height-source:userset;height:16.5pt">
                <td height="22" class="xl206" style="height:16.5pt"></td>
                <td colspan="2" class="xl375"></td>
                <td class="xl384">
                <span style="mso-spacerun:yes">&nbsp;&nbsp; </span>4
                </td>
                <td class="xl384">
                <span style="mso-spacerun:yes">&nbsp;</span>Uang Makan (Long Shift-II) <span
                    style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl402">
                <span style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp;&nbsp; </span>3
                </td>
                <td class="xl403">
                <span style="mso-spacerun:yes">&nbsp;</span>Hari <span style="mso-spacerun:yes">&nbsp; </span>x <span
                    style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl388">
                <span style="mso-spacerun:yes">&nbsp;</span>Rp <span style="mso-spacerun:yes">&nbsp; </span>12,000
                </td>
                <td class="xl382">
                <span style="mso-spacerun:yes">&nbsp;</span>Rp <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl398">
                <span style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>36,000
                </td>
                <td class="xl388"></td>
                <td class="xl400" align="right">1</td>
                <td class="xl382" colspan="2" style="mso-ignore:colspan">
                <span style="mso-spacerun:yes">&nbsp;</span>Dana Pensiun (1%) <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl382"></td>
                <td class="xl382"></td>
                <td class="xl382"></td>
                <td class="xl399">
                <span style="mso-spacerun:yes">&nbsp;</span>Rp <span
                    style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>56,529
                </td>
            </tr>
            <tr height="22" style="mso-height-source:userset;height:16.5pt">
                <td height="22" class="xl206" style="height:16.5pt"></td>
                <td colspan="2" class="xl375"></td>
                <td class="xl384">
                <span style="mso-spacerun:yes">&nbsp;&nbsp; </span>5
                </td>
                <td class="xl384">
                <span style="mso-spacerun:yes">&nbsp;</span>Tunjangan Shift II <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl402">
                <span style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp;&nbsp; </span>9
                </td>
                <td class="xl403">
                <span style="mso-spacerun:yes">&nbsp;</span>Hari <span style="mso-spacerun:yes">&nbsp; </span>x <span
                    style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl388">
                <span style="mso-spacerun:yes">&nbsp;</span>Rp <span style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp; </span>2,000
                </td>
                <td class="xl382">
                <span style="mso-spacerun:yes">&nbsp;</span>Rp <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl398">
                <span style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>18,000
                </td>
                <td class="xl388"></td>
                <td class="xl400" align="right">2</td>
                <td class="xl404" colspan="5" style="mso-ignore:colspan">
                <span style="mso-spacerun:yes">&nbsp;</span>PPh 21 (5%) ---- ditanggung perusahaan. <span
                    style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl399">
                <span style="mso-spacerun:yes">&nbsp;</span>Rp <span
                    style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>-
                </td>
            </tr>
            <tr height="22" style="mso-height-source:userset;height:16.5pt">
                <td height="22" class="xl206" style="height:16.5pt"></td>
                <td class="xl375"></td>
                <td class="xl375"></td>
                <td class="xl384">
                <span style="mso-spacerun:yes">&nbsp;&nbsp; </span>6
                </td>
                <td class="xl384">
                <span style="mso-spacerun:yes">&nbsp;</span>Tunjangan Shift III <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl402"></td>
                <td class="xl403">
                <span style="mso-spacerun:yes">&nbsp;</span>Hari <span style="mso-spacerun:yes">&nbsp; </span>x <span
                    style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl388">
                <span style="mso-spacerun:yes">&nbsp;</span>Rp <span style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp; </span>2,000
                </td>
                <td class="xl382">
                <span style="mso-spacerun:yes">&nbsp;</span>Rp <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl382">
                <span
                    style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>-
                </td>
                <td class="xl388"></td>
                <td colspan="6" class="xl375">TOTAL POTONGAN <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl399">
                <span style="mso-spacerun:yes">&nbsp;</span>Rp <span style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp;&nbsp;
                </span>426,114
                </td>
            </tr>
            <tr height="22" style="mso-height-source:userset;height:16.5pt">
                <td height="22" class="xl206" style="height:16.5pt"></td>
                <td colspan="2" class="xl375"></td>
                <td class="xl384">
                <span style="mso-spacerun:yes">&nbsp;&nbsp; </span>7
                </td>
                <td colspan="4" class="xl382">
                <span style="mso-spacerun:yes">&nbsp;</span>Premi Kehadiran <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl382">
                <span style="mso-spacerun:yes">&nbsp;</span>Rp <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl398">
                <span style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>22,000
                </td>
                <td class="xl388"></td>
                <td colspan="6" class="xl375">TOTAL YANG DIBAYARKAN</td>
                <td class="xl405">
                <span style="mso-spacerun:yes">&nbsp;</span>Rp <span style="mso-spacerun:yes">&nbsp; </span>6,693,589
                </td>
            </tr>
            <tr height="22" style="mso-height-source:userset;height:16.5pt">
                <td height="22" class="xl206" style="height:16.5pt"></td>
                <td colspan="7" class="xl679" style="padding-left: 200px; font-weight: bold;">Sub Total-2</td>
                <td class="xl391">
                <span style="mso-spacerun:yes">&nbsp;</span>Rp <span style="mso-spacerun:yes">&nbsp;</span>
                </td>
                <td class="xl406">
                <span style="mso-spacerun:yes">&nbsp;&nbsp;&nbsp; </span>318,500
                </td>
                <td class="xl407">&nbsp;</td>
                <td class="xl407">&nbsp;</td>
                <td class="xl408">&nbsp;</td>
                <td class="xl408">&nbsp;</td>
                <td class="xl408">&nbsp;</td>
                <td class="xl408">&nbsp;</td>
                <td class="xl408">&nbsp;</td>
                <td class="xl408">&nbsp;</td>
            </tr>
            </tbody>
        </table>
        </body>
        </html>
        `;

        // Set content of the page
        await page.setContent(htmlContent);

        const dateOnly = today.toISOString().substring(0, 10);
        const pdfName = "salary_" + dataEmployee.name + "_" + dateOnly + '.pdf';

        // Specify the path where you want to save the PDF
        const pdfPath = path.join(__dirname, '../', './public/pdfs', pdfName);

        // Generate PDF
        await page.pdf({ path: pdfPath, format: 'A5', landscape: true });
        // await page.goto('your-page-url', { waitUntil: 'networkidle0' });

        await browser.close();

        return pdfPath;
    }

    // send file message routing
    router.post('/sendSalarySlip', async (req, res) => {
        // get data needs
        const dataSalary = await getDataSalary();
        const dataCompany = await getDataCompany();
        const dataEmployee = await getDataEmployee();

        // create pdf file
        for (let i = 0; i < dataSalary.length; i++) {
            const salary = dataSalary[i];
            const employee = dataEmployee.find(e => e.nik === salary.nik);

            const pdfPath = await createPDF(salary, dataCompany, employee, i + 1);

            // const data = req.body;
            const phone = "62" + employee.whatsapp_number.substring(1) + "@c.us";
            const message = "hii " + employee.name + ", ini adalah slip gaji untuk " + getStringDate(salary.tanggal_gaji);

            sendFile(client, phone, message, pdfPath).then((res) => console.log(res));
            await delay(5000);
        }

        res.status(200).json({
            error: false,
            data: {
                message: 'Pesan terkirim',
            },
        });
    });

    async function sendFile(client, phone, ack = "", pdfPath) {
        return new Promise(async function (resolve, reject) {
            const media = MessageMedia.fromFilePath(pdfPath);
            try {
                await client.sendMessage(phone, media, { caption: ack });
                resolve("Succesfully sent.");
            } catch (error) {
                reject("Can not send message.", error)
            }
        })
    }

    return router;
}


