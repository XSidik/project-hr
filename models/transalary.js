const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TranSalaries = sequelize.define('TranSalaries', {
    status: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    nik: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tanggal_gaji: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    upah_pokok: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tunjangan_jabatan: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tunjangan_masa_kerja: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tunjangan_transport: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tunjangan_uang_makan: {
        type: DataTypes.STRING,
        allowNull: true
    },
    uang_makan_Long_shift1: {
        type: DataTypes.STRING,
        allowNull: true
    },
    uang_makan_Long_shift2: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tunjangan_shift2: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tunjangan_shift3: {
        type: DataTypes.STRING,
        allowNull: true
    },
    premi_kehadiran: {
        type: DataTypes.STRING,
        allowNull: true
    },
    upah_lembur_hari_biasa_jam: {
        type: DataTypes.STRING,
        allowNull: true
    },
    upah_lembur_hari_biasa_harga: {
        type: DataTypes.STRING,
        allowNull: true
    },
    upah_lembur_hari_libur_jam: {
        type: DataTypes.STRING,
        allowNull: true
    },
    upah_lembur_hari_libur_harga: {
        type: DataTypes.STRING,
        allowNull: true
    },
    komplain_bulan_lalu: {
        type: DataTypes.STRING,
        allowNull: true
    },
    penggantian_cuti: {
        type: DataTypes.STRING,
        allowNull: true
    },
    potongan_absensi: {
        type: DataTypes.STRING,
        allowNull: true
    },
    potongan_bpjs_dan_jamsostek: {
        type: DataTypes.STRING,
        allowNull: true
    },
    potongan_koperasi: {
        type: DataTypes.STRING,
        allowNull: true
    },
    potongan_pinjaman: {
        type: DataTypes.STRING,
        allowNull: true
    },
    potongan_lain_lain: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dana_pensiun: {
        type: DataTypes.STRING,
        allowNull: true
    },
    pph21: {
        type: DataTypes.STRING,
        allowNull: true
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
});

module.exports = TranSalaries;
