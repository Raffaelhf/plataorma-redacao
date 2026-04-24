
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.18.0
 * Query Engine version: 4c784e32044a8a016d99474bd02a3b6123742169
 */
Prisma.prismaVersion = {
  client: "5.18.0",
  engine: "4c784e32044a8a016d99474bd02a3b6123742169"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  passwordHash: 'passwordHash',
  role: 'role',
  isActive: 'isActive',
  image: 'image',
  emailVerified: 'emailVerified',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StudentProfileScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  gradeLevel: 'gradeLevel',
  cpf: 'cpf',
  enrollmentNumber: 'enrollmentNumber',
  plan: 'plan',
  readingClub: 'readingClub',
  mentoring: 'mentoring',
  bio: 'bio',
  avatarUrl: 'avatarUrl',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TeacherProfileScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  expertise: 'expertise',
  bio: 'bio',
  avatarUrl: 'avatarUrl',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ActivityScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  prompt: 'prompt',
  tags: 'tags',
  status: 'status',
  publishedAt: 'publishedAt',
  dueDate: 'dueDate',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdById: 'createdById'
};

exports.Prisma.ActivityAttachmentScalarFieldEnum = {
  id: 'id',
  activityId: 'activityId',
  fileName: 'fileName',
  mimeType: 'mimeType',
  sizeInBytes: 'sizeInBytes',
  fileData: 'fileData',
  createdAt: 'createdAt'
};

exports.Prisma.SubmissionScalarFieldEnum = {
  id: 'id',
  studentId: 'studentId',
  activityId: 'activityId',
  content: 'content',
  pdfUrl: 'pdfUrl',
  pdfName: 'pdfName',
  pdfMimeType: 'pdfMimeType',
  pdfData: 'pdfData',
  status: 'status',
  submittedAt: 'submittedAt',
  updatedAt: 'updatedAt',
  grade: 'grade',
  feedback: 'feedback'
};

exports.Prisma.CorrectionScalarFieldEnum = {
  id: 'id',
  submissionId: 'submissionId',
  teacherId: 'teacherId',
  comments: 'comments',
  score: 'score',
  strengths: 'strengths',
  improvements: 'improvements',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VideoCategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdById: 'createdById'
};

exports.Prisma.VideoClassroomScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  sortOrder: 'sortOrder',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdById: 'createdById'
};

exports.Prisma.VideoModuleScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  sortOrder: 'sortOrder',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  classroomId: 'classroomId',
  createdById: 'createdById'
};

exports.Prisma.VideoLessonScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  videoUrl: 'videoUrl',
  sortOrder: 'sortOrder',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdById: 'createdById',
  categoryId: 'categoryId',
  classroomId: 'classroomId',
  moduleId: 'moduleId'
};

exports.Prisma.LiveClassScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  scheduledAt: 'scheduledAt',
  meetingUrl: 'meetingUrl',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdById: 'createdById'
};

exports.Prisma.AccountScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  provider: 'provider',
  providerAccountId: 'providerAccountId',
  refresh_token: 'refresh_token',
  access_token: 'access_token',
  expires_at: 'expires_at',
  token_type: 'token_type',
  scope: 'scope',
  id_token: 'id_token',
  session_state: 'session_state',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SessionScalarFieldEnum = {
  id: 'id',
  sessionToken: 'sessionToken',
  userId: 'userId',
  expires: 'expires'
};

exports.Prisma.VerificationTokenScalarFieldEnum = {
  identifier: 'identifier',
  token: 'token',
  expires: 'expires'
};

exports.Prisma.PlatformSettingsScalarFieldEnum = {
  id: 'id',
  bankRecipientName: 'bankRecipientName',
  bankDocument: 'bankDocument',
  bankName: 'bankName',
  bankAgency: 'bankAgency',
  bankAccount: 'bankAccount',
  pixKey: 'pixKey',
  whatsappNumber: 'whatsappNumber',
  paymentNotes: 'paymentNotes',
  mensalPlanPriceInCents: 'mensalPlanPriceInCents',
  trimestralPlanPriceInCents: 'trimestralPlanPriceInCents',
  semestralPlanPriceInCents: 'semestralPlanPriceInCents',
  anualPlanPriceInCents: 'anualPlanPriceInCents',
  mentoriaPlanPriceInCents: 'mentoriaPlanPriceInCents',
  readingClubPriceInCents: 'readingClubPriceInCents',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RegistrationSessionScalarFieldEnum = {
  id: 'id',
  publicToken: 'publicToken',
  name: 'name',
  email: 'email',
  passwordHash: 'passwordHash',
  role: 'role',
  gradeLevel: 'gradeLevel',
  expertise: 'expertise',
  plan: 'plan',
  readingClub: 'readingClub',
  mentoring: 'mentoring',
  acceptedPrivacyPolicy: 'acceptedPrivacyPolicy',
  acceptedTerms: 'acceptedTerms',
  selectedPaymentMethod: 'selectedPaymentMethod',
  amountInCents: 'amountInCents',
  status: 'status',
  provider: 'provider',
  providerPreferenceId: 'providerPreferenceId',
  providerPaymentId: 'providerPaymentId',
  checkoutUrl: 'checkoutUrl',
  expiresAt: 'expiresAt',
  completedAt: 'completedAt',
  createdUserId: 'createdUserId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PasswordSetupTokenScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  tokenHash: 'tokenHash',
  expiresAt: 'expiresAt',
  usedAt: 'usedAt',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.Role = exports.$Enums.Role = {
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER',
  ADMIN: 'ADMIN'
};

exports.StudentPlan = exports.$Enums.StudentPlan = {
  MENSAL: 'MENSAL',
  TRIMESTRAL: 'TRIMESTRAL',
  SEMESTRAL: 'SEMESTRAL',
  ANUAL: 'ANUAL'
};

exports.ActivityStatus = exports.$Enums.ActivityStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED'
};

exports.SubmissionStatus = exports.$Enums.SubmissionStatus = {
  PENDING: 'PENDING',
  UNDER_REVIEW: 'UNDER_REVIEW',
  RETURNED: 'RETURNED',
  GRADED: 'GRADED'
};

exports.PaymentMethod = exports.$Enums.PaymentMethod = {
  PIX: 'PIX',
  CREDIT_CARD: 'CREDIT_CARD',
  DEBIT_CARD: 'DEBIT_CARD',
  BOLETO: 'BOLETO'
};

exports.RegistrationStatus = exports.$Enums.RegistrationStatus = {
  DRAFT: 'DRAFT',
  CHECKOUT_PENDING: 'CHECKOUT_PENDING',
  PAYMENT_PENDING: 'PAYMENT_PENDING',
  APPROVED: 'APPROVED',
  FAILED: 'FAILED',
  EXPIRED: 'EXPIRED'
};

exports.Prisma.ModelName = {
  User: 'User',
  StudentProfile: 'StudentProfile',
  TeacherProfile: 'TeacherProfile',
  Activity: 'Activity',
  ActivityAttachment: 'ActivityAttachment',
  Submission: 'Submission',
  Correction: 'Correction',
  VideoCategory: 'VideoCategory',
  VideoClassroom: 'VideoClassroom',
  VideoModule: 'VideoModule',
  VideoLesson: 'VideoLesson',
  LiveClass: 'LiveClass',
  Account: 'Account',
  Session: 'Session',
  VerificationToken: 'VerificationToken',
  PlatformSettings: 'PlatformSettings',
  RegistrationSession: 'RegistrationSession',
  PasswordSetupToken: 'PasswordSetupToken'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
