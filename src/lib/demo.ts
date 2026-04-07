import type { Session } from 'next-auth';

export const DEMO_STUDENT_LOGIN = 'demo-aluno';
export const DEMO_TEACHER_LOGIN = 'demo-professor';
export const DEMO_STUDENT_ID = 'demo-student';
export const DEMO_TEACHER_ID = 'demo-teacher';
export const DEMO_STUDENT_PROFILE_ID = 'demo-student-profile';
export const DEMO_TEACHER_PROFILE_ID = 'demo-teacher-profile';

export const demoVideoCategories = [
  {
    id: 'demo-cat-estrutura',
    name: 'Estrutura dissertativa',
    description: 'Aulas para organizar introdução, desenvolvimento e conclusão.',
  },
  {
    id: 'demo-cat-repertorio',
    name: 'Repertório e argumentação',
    description: 'Materiais para fortalecer repertório sociocultural e qualidade argumentativa.',
  },
];

export const demoVideoClassrooms = [
  {
    id: 'demo-class-extensiva',
    name: 'Turma extensiva 2026',
    description: 'Percurso anual com foco em base teórica, repertório e produção semanal.',
    sortOrder: 1,
  },
  {
    id: 'demo-class-revisao',
    name: 'Turma de revisão intensiva',
    description: 'Trilha mais curta para revisar estratégia, repertório e proposta de intervenção.',
    sortOrder: 2,
  },
];

export const demoVideoModules = [
  {
    id: 'demo-module-fundamentos',
    title: 'Módulo 1 - Fundamentos',
    description: 'Organização da dissertação e leitura do tema.',
    classroomId: 'demo-class-extensiva',
    sortOrder: 1,
  },
  {
    id: 'demo-module-argumentacao',
    title: 'Módulo 2 - Argumentação',
    description: 'Uso de repertório e conexão entre ideias.',
    classroomId: 'demo-class-extensiva',
    sortOrder: 2,
  },
  {
    id: 'demo-module-reta-final',
    title: 'Módulo único - Reta final',
    description: 'Revisão rápida para a turma intensiva.',
    classroomId: 'demo-class-revisao',
    sortOrder: 1,
  },
];

export const demoVideoLessons = [
  {
    id: 'demo-video-1',
    title: 'Como montar uma introdução forte',
    description: 'Passo a passo para contextualizar o tema, apresentar a tese e preparar o desenvolvimento.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    sortOrder: 1,
    classroomId: 'demo-class-extensiva',
    moduleId: 'demo-module-fundamentos',
    categoryId: 'demo-cat-estrutura',
    categoryName: 'Estrutura dissertativa',
    category: {
      id: 'demo-cat-estrutura',
      name: 'Estrutura dissertativa',
    },
  },
  {
    id: 'demo-video-2',
    title: 'Repertório sociocultural sem forçar a barra',
    description: 'Aprenda a inserir repertório de forma orgânica e alinhada ao argumento.',
    videoUrl: 'https://www.youtube.com/watch?v=oHg5SJYRHA0',
    sortOrder: 2,
    classroomId: 'demo-class-extensiva',
    moduleId: 'demo-module-argumentacao',
    categoryId: 'demo-cat-repertorio',
    categoryName: 'Repertório e argumentação',
    category: {
      id: 'demo-cat-repertorio',
      name: 'Repertório e argumentação',
    },
  },
  {
    id: 'demo-video-3',
    title: 'Conclusão com proposta de intervenção',
    description: 'Estruture agente, ação, meio e finalidade sem fugir do tema.',
    videoUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
    sortOrder: 3,
    classroomId: 'demo-class-revisao',
    moduleId: 'demo-module-reta-final',
    categoryId: 'demo-cat-estrutura',
    categoryName: 'Estrutura dissertativa',
    category: {
      id: 'demo-cat-estrutura',
      name: 'Estrutura dissertativa',
    },
  },
];

export const demoLiveClasses = [
  {
    id: 'demo-live-1',
    title: 'Live para iniciantes: repertório e tese',
    description: 'Encontro quinzenal para esclarecer dúvidas e fortalecer a base argumentativa dos alunos iniciantes.',
    scheduledAt: new Date('2026-03-16T19:00:00'),
    meetingUrl: 'https://meet.google.com/demo-redacao-pro',
  },
  {
    id: 'demo-live-2',
    title: 'Live nível médio: leituras e correções comentadas',
    description: 'Debate sobre repertório cultural, dúvidas da semana e comentários de leituras indicadas no clube.',
    scheduledAt: new Date('2026-03-16T20:00:00'),
    meetingUrl: 'https://meet.google.com/demo-plantao-redacao',
  },
  {
    id: 'demo-live-3',
    title: 'Live para iniciantes: repertório cultural aplicado',
    description: 'Novo encontro quinzenal com foco em usar referências culturais para sustentar os argumentos.',
    scheduledAt: new Date('2026-03-30T19:00:00'),
    meetingUrl: 'https://meet.google.com/demo-repertorio-iniciantes',
  },
  {
    id: 'demo-live-4',
    title: 'Live nível médio: clube de leitura e aprofundamento',
    description: 'Discussão de obra indicada no clube de leitura e sua conexão com os temas de redação do ciclo.',
    scheduledAt: new Date('2026-03-30T20:00:00'),
    meetingUrl: 'https://meet.google.com/demo-clube-leitura',
  },
];

type DemoActivity = {
  id: string;
  title: string;
  description: string;
  prompt: string;
  tags: string[];
  status: 'PUBLISHED' | 'DRAFT';
  attachmentUrl?: string | null;
  attachmentName?: string | null;
  publishedAt?: Date;
  createdAt: Date;
  submissionsCount: number;
};

type DemoSubmission = {
  id: string;
  activityId: string;
  activityTitle: string;
  studentId: string;
  studentName: string;
  content: string;
  pdfUrl?: string | null;
  pdfName?: string | null;
  status: 'UNDER_REVIEW' | 'GRADED';
  submittedAt: Date;
  grade: number | null;
  feedback: string | null;
  correctionComment?: string | null;
  strengths?: string[];
  improvements?: string[];
};

export const demoActivities: DemoActivity[] = [
  {
    id: 'demo-activity-ia',
    title: 'Redação: Tecnologia e Sociedade',
    description: 'Produza um texto dissertativo-argumentativo sobre os impactos da inteligência artificial.',
    prompt:
      'Debata como a inteligência artificial pode transformar trabalho e educação. Apresente argumentos consistentes e uma proposta de intervenção.',
    tags: ['IA', 'Sociedade', 'Tecnologia'],
    status: 'PUBLISHED',
    publishedAt: new Date('2026-03-01T09:00:00'),
    createdAt: new Date('2026-03-01T09:00:00'),
    submissionsCount: 1,
  },
  {
    id: 'demo-activity-midia',
    title: 'Cidadania digital e desinformação',
    description: 'Discuta o papel da escola e das plataformas no combate à desinformação.',
    prompt:
      'Construa um texto com tese, repertório e proposta de intervenção sobre cidadania digital e combate à desinformação.',
    tags: ['Mídia', 'Educação'],
    status: 'PUBLISHED',
    publishedAt: new Date('2026-03-04T10:00:00'),
    createdAt: new Date('2026-03-04T10:00:00'),
    submissionsCount: 1,
  },
];

export const demoSubmissions: DemoSubmission[] = [
  {
    id: 'demo-submission-1',
    activityId: 'demo-activity-ia',
    activityTitle: 'Redação: Tecnologia e Sociedade',
    studentId: DEMO_STUDENT_PROFILE_ID,
    studentName: 'adminaluno',
    content:
      'A inteligência artificial redefine processos produtivos e exige requalificação constante, mas também amplia desigualdades quando o acesso à tecnologia é limitado.',
    pdfUrl: null,
    pdfName: null,
    status: 'GRADED',
    submittedAt: new Date('2026-03-03T15:30:00'),
    grade: 840,
    feedback: 'Boa argumentação; aprofunde a proposta de intervenção e a coesão entre parágrafos.',
    correctionComment: 'Boa argumentação; aprofunde a proposta de intervenção e a coesão entre parágrafos.',
    strengths: ['Tese clara', 'Repertório atual', 'Boa organização dos argumentos'],
    improvements: ['Detalhar melhor a proposta de intervenção', 'Fechar a conclusão com mais precisão'],
  },
  {
    id: 'demo-submission-2',
    activityId: 'demo-activity-midia',
    activityTitle: 'Cidadania digital e desinformação',
    studentId: DEMO_STUDENT_PROFILE_ID,
    studentName: 'adminaluno',
    content:
      'A educação midiática é essencial para formar leitores críticos em ambientes digitais e reduzir a circulação de desinformação.',
    pdfUrl: null,
    pdfName: null,
    status: 'UNDER_REVIEW',
    submittedAt: new Date('2026-03-07T11:10:00'),
    grade: null,
    feedback: null,
    correctionComment: null,
    strengths: [],
    improvements: [],
  },
];

export function isDemoLogin(value?: string | null) {
  const normalized = value?.trim().toLowerCase();
  return normalized === DEMO_STUDENT_LOGIN || normalized === DEMO_TEACHER_LOGIN;
}

export function isDemoStudentSession(session: Session | null) {
  const email = session?.user?.email?.toLowerCase();
  const name = session?.user?.name?.toLowerCase();
  return email === DEMO_STUDENT_LOGIN || name === DEMO_STUDENT_LOGIN;
}

export function isDemoTeacherSession(session: Session | null) {
  const email = session?.user?.email?.toLowerCase();
  const name = session?.user?.name?.toLowerCase();
  return email === DEMO_TEACHER_LOGIN || name === DEMO_TEACHER_LOGIN;
}

export function isDemoSession(session: Session | null) {
  return isDemoStudentSession(session) || isDemoTeacherSession(session);
}

export function getDemoProfile(session: Session | null) {
  if (isDemoStudentSession(session)) {
    return {
      role: 'STUDENT' as const,
      user: {
        id: DEMO_STUDENT_ID,
        name: 'adminaluno',
        email: DEMO_STUDENT_LOGIN,
      },
      studentId: DEMO_STUDENT_PROFILE_ID,
    };
  }

  if (isDemoTeacherSession(session)) {
    return {
      role: 'TEACHER' as const,
      user: {
        id: DEMO_TEACHER_ID,
        name: 'adminprof',
        email: DEMO_TEACHER_LOGIN,
      },
      teacherId: DEMO_TEACHER_PROFILE_ID,
    };
  }

  return null;
}

export function getDemoActivityById(id: string) {
  return demoActivities.find((activity) => activity.id === id) ?? null;
}

export function getDemoSubmissionsByActivityId(activityId: string) {
  return demoSubmissions.filter((submission) => submission.activityId === activityId);
}
