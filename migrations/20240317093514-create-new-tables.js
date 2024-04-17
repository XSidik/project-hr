'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Companies', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      sub_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.createTable('TranSalaries', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
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
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      updatedBy: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Companies');
    await queryInterface.dropTable('TranSalaries');
  }
};
