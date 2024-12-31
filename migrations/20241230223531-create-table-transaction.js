'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tran_salaries', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      nik: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      tanggal_gaji: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      upah_pokok: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      tunjangan_jabatan: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      tunjangan_masa_kerja: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      tunjangan_transport: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tunjangan_uang_makan: {
        type: Sequelize.STRING,
        allowNull: true
      },
      uang_makan_Long_shift1: {
        type: Sequelize.STRING,
        allowNull: true
      },
      uang_makan_Long_shift2: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tunjangan_shift2: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tunjangan_shift3: {
        type: Sequelize.STRING,
        allowNull: true
      },
      premi_kehadiran: {
        type: Sequelize.STRING,
        allowNull: true
      },
      upah_lembur_hari_biasa_jam: {
        type: Sequelize.STRING,
        allowNull: true
      },
      upah_lembur_hari_biasa_harga: {
        type: Sequelize.STRING,
        allowNull: true
      },
      upah_lembur_hari_libur_jam: {
        type: Sequelize.STRING,
        allowNull: true
      },
      upah_lembur_hari_libur_harga: {
        type: Sequelize.STRING,
        allowNull: true
      },
      komplain_bulan_lalu: {
        type: Sequelize.STRING,
        allowNull: true
      },
      penggantian_cuti: {
        type: Sequelize.STRING,
        allowNull: true
      },
      potongan_absensi: {
        type: Sequelize.STRING,
        allowNull: true
      },
      potongan_bpjs_dan_jamsostek: {
        type: Sequelize.STRING,
        allowNull: true
      },
      potongan_koperasi: {
        type: Sequelize.STRING,
        allowNull: true
      },
      potongan_pinjaman: {
        type: Sequelize.STRING,
        allowNull: true
      },
      potongan_lain_lain: {
        type: Sequelize.STRING,
        allowNull: true
      },
      dana_pensiun: {
        type: Sequelize.STRING,
        allowNull: true
      },
      pph21: {
        type: Sequelize.STRING,
        allowNull: true
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      updated_by: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tran_salaries');
  }
};
