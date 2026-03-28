type StudentProfileReader = {
  studentProfile: {
    findFirst: (args: { where: { enrollmentNumber: string }; select: { id: true } }) => Promise<{ id: string } | null>;
  };
};

function createCandidate() {
  const year = new Date().getFullYear();
  const suffix = Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, '0');

  return `${year}-${suffix}`;
}

export async function generateEnrollmentNumber(db: StudentProfileReader) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const enrollmentNumber = createCandidate();
    const existing = await db.studentProfile.findFirst({
      where: { enrollmentNumber },
      select: { id: true },
    });

    if (!existing) {
      return enrollmentNumber;
    }
  }

  throw new Error('Não foi possível gerar uma matrícula única.');
}
