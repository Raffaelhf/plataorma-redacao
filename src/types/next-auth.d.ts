declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string | null;
      role: string;
      isActive?: boolean;
      studentId?: string;
      teacherId?: string;
    };
  }

  interface User {
    role: string;
    isActive?: boolean;
    studentId?: string;
    teacherId?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
    isActive?: boolean;
    studentId?: string;
    teacherId?: string;
  }
}
