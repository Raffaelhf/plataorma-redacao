import nodemailer from 'nodemailer';

export function isMailConfigured() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const from = process.env.SMTP_FROM;

  return Boolean(host && user && process.env.SMTP_PASSWORD && from);
}

function getMailerConfig() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM;

  if (!isMailConfigured() || !host || !user || !pass || !from) {
    throw new Error('SMTP não configurado. Defina SMTP_HOST, SMTP_USER, SMTP_PASSWORD e SMTP_FROM.');
  }

  return {
    host,
    port,
    from,
    secure: process.env.SMTP_SECURE === 'true' || port === 465,
    auth: {
      user,
      pass,
    },
  };
}

async function sendAccessEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  const config = getMailerConfig();
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth,
  });

  await transporter.sendMail({
    from: config.from,
    to,
    subject,
    text,
    html,
  });
}

export async function sendPasswordSetupEmail({
  to,
  name,
  roleLabel,
  link,
}: {
  to: string;
  name?: string | null;
  roleLabel: string;
  link: string;
}) {
  const displayName = name?.trim() || 'usuário';

  await sendAccessEmail({
    to,
    subject: 'Defina sua senha de acesso',
    text: `Olá, ${displayName}.\n\nUm perfil de ${roleLabel} foi criado para você na plataforma. Para definir sua senha de acesso, use o link abaixo:\n\n${link}\n\nSe você não esperava este convite, ignore este e-mail.`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#22347e">
        <p>Olá, <strong>${displayName}</strong>.</p>
        <p>Um perfil de <strong>${roleLabel}</strong> foi criado para você na plataforma.</p>
        <p>Para definir sua senha de acesso, clique no link abaixo:</p>
        <p><a href="${link}" style="color:#4250d4;font-weight:700">Definir senha</a></p>
        <p>Se você não esperava este convite, ignore este e-mail.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail({
  to,
  name,
  link,
}: {
  to: string;
  name?: string | null;
  link: string;
}) {
  const displayName = name?.trim() || 'usuário';

  await sendAccessEmail({
    to,
    subject: 'Redefina sua senha de acesso',
    text: `Olá, ${displayName}.\n\nUm administrador redefiniu o acesso da sua conta na plataforma. Para escolher uma nova senha, use o link abaixo:\n\n${link}\n\nEste link é temporário. Se você não solicitou essa alteração, fale com o suporte da plataforma.`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#22347e">
        <p>Olá, <strong>${displayName}</strong>.</p>
        <p>Um administrador redefiniu o acesso da sua conta na plataforma.</p>
        <p>Para escolher uma nova senha, clique no link abaixo:</p>
        <p><a href="${link}" style="color:#4250d4;font-weight:700">Redefinir senha</a></p>
        <p>Este link é temporário. Se você não solicitou essa alteração, fale com o suporte da plataforma.</p>
      </div>
    `,
  });
}
