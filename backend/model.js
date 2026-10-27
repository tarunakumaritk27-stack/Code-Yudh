const { Sequelize, DataTypes } = require('sequelize');

// ==========================================
// 1. Database Connection
// ==========================================
const sequelize = new Sequelize('ai_detector_db', 'postgres', 'yourpassword', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  logging: console.log, // Set to false in production
});

// ==========================================
// 2. Models Definition
// ==========================================

// Users
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('USER', 'REVIEWER', 'ADMIN'),
    defaultValue: 'USER',
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION'),
    defaultValue: 'ACTIVE',
    allowNull: false,
  },
}, { tableName: 'users', timestamps: true });

// API Keys
const ApiKey = sequelize.define('ApiKey', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  key_hash: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
  },
  key_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, { tableName: 'api_keys', timestamps: true, updatedAt: false });

// Credit Balances
const CreditBalance = sequelize.define('CreditBalance', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  available_credits: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00,
    allowNull: false,
  },
  subscription_tier: {
    type: DataTypes.ENUM('FREE', 'PRO', 'ENTERPRISE'),
    defaultValue: 'FREE',
    allowNull: false,
  },
  reset_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, { tableName: 'credit_balances', timestamps: true });

// Detection Models Catalog
const DetectionModel = sequelize.define('DetectionModel', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  model_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  version: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  modality: {
    type: DataTypes.ENUM('TEXT', 'IMAGE', 'AUDIO', 'VIDEO'),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
  config_metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
}, { tableName: 'detection_models', timestamps: true });

// Submissions (Inputs / Media)
const Submission = sequelize.define('Submission', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  modality: {
    type: DataTypes.ENUM('TEXT', 'IMAGE', 'AUDIO', 'VIDEO'),
    allowNull: false,
  },
  content_hash: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  raw_text: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  media_url: {
    type: DataTypes.STRING(1024),
    allowNull: true,
  },
  file_size_bytes: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
}, {
  tableName: 'submissions',
  timestamps: true,
  indexes: [
    { fields: ['content_hash'] },
    { fields: ['user_id', 'createdAt'] },
  ],
});

// Detection Jobs (Async Pipeline)
const DetectionJob = sequelize.define('DetectionJob', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  status: {
    type: DataTypes.ENUM('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED'),
    defaultValue: 'QUEUED',
    allowNull: false,
  },
  error_message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  started_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  finished_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  duration_ms: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, { tableName: 'detection_jobs', timestamps: true });

// Detection Results (Consolidated Verdict)
const DetectionResult = sequelize.define('DetectionResult', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  verdict: {
    type: DataTypes.ENUM('LIKELY_REAL', 'LIKELY_AI', 'UNCERTAIN'),
    allowNull: false,
  },
  ai_probability: {
    type: DataTypes.DECIMAL(5, 4),
    allowNull: false,
  },
  real_probability: {
    type: DataTypes.DECIMAL(5, 4),
    allowNull: false,
  },
  diagnostics_json: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
}, { tableName: 'detection_results', timestamps: true });

// Detection Segments (Granular Breakdown)
const DetectionSegment = sequelize.define('DetectionSegment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  sequence_index: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  boundary_info: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  ai_score: {
    type: DataTypes.DECIMAL(5, 4),
    allowNull: false,
  },
  classification: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, { tableName: 'detection_segments', timestamps: false });

// User Feedback (Ground Truth Data)
const UserFeedback = sequelize.define('UserFeedback', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  feedback_type: {
    type: DataTypes.ENUM('FALSE_POSITIVE', 'FALSE_NEGATIVE', 'CORRECT'),
    allowNull: false,
  },
  ground_truth_label: {
    type: DataTypes.ENUM('ACTUAL_REAL', 'ACTUAL_AI', 'UNKNOWN'),
    allowNull: false,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  flagged_for_retraining: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
}, { tableName: 'user_feedback', timestamps: true });

// ==========================================
// 3. Relationships & Foreign Keys
// ==========================================

// User <-> ApiKey (1:N)
User.hasMany(ApiKey, { foreignKey: { name: 'user_id', allowNull: false }, onDelete: 'CASCADE' });
ApiKey.belongsTo(User, { foreignKey: 'user_id' });

// User <-> CreditBalance (1:1)
User.hasOne(CreditBalance, { foreignKey: { name: 'user_id', allowNull: false, unique: true }, onDelete: 'CASCADE' });
CreditBalance.belongsTo(User, { foreignKey: 'user_id' });

// User <-> Submission (1:N)
User.hasMany(Submission, { foreignKey: { name: 'user_id', allowNull: true }, onDelete: 'SET NULL' });
Submission.belongsTo(User, { foreignKey: 'user_id' });

// Submission <-> DetectionJob (1:N)
Submission.hasMany(DetectionJob, { foreignKey: { name: 'submission_id', allowNull: false }, onDelete: 'CASCADE' });
DetectionJob.belongsTo(Submission, { foreignKey: 'submission_id' });

// DetectionJob <-> DetectionResult (1:1)
DetectionJob.hasOne(DetectionResult, { foreignKey: { name: 'job_id', allowNull: false, unique: true }, onDelete: 'CASCADE' });
DetectionResult.belongsTo(DetectionJob, { foreignKey: 'job_id' });

// DetectionModel <-> DetectionResult (1:N)
DetectionModel.hasMany(DetectionResult, { foreignKey: { name: 'model_id', allowNull: false }, onDelete: 'RESTRICT' });
DetectionResult.belongsTo(DetectionModel, { foreignKey: 'model_id' });

// DetectionResult <-> DetectionSegment (1:N)
DetectionResult.hasMany(DetectionSegment, { foreignKey: { name: 'result_id', allowNull: false }, onDelete: 'CASCADE' });
DetectionSegment.belongsTo(DetectionResult, { foreignKey: 'result_id' });

// DetectionResult <-> UserFeedback (1:N)
DetectionResult.hasMany(UserFeedback, { foreignKey: { name: 'result_id', allowNull: false }, onDelete: 'CASCADE' });
UserFeedback.belongsTo(DetectionResult, { foreignKey: 'result_id' });

// User <-> UserFeedback (1:N)
User.hasMany(UserFeedback, { foreignKey: { name: 'user_id', allowNull: false }, onDelete: 'CASCADE' });
UserFeedback.belongsTo(User, { foreignKey: 'user_id' });

// ==========================================
// 4. Exports
// ==========================================
module.exports = {
  sequelize,
  User,
  ApiKey,
  CreditBalance,
  DetectionModel,
  Submission,
  DetectionJob,
  DetectionResult,
  DetectionSegment,
  UserFeedback,
};