module.exports = {
  username: 'postgres',
  password: 'docker',
  database: 'fastfeetdb',
  host: 'localhost',
  dialect: 'postgres',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
