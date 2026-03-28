type SubmissionPdfLinkInput = {
  id: string;
  pdfUrl?: string | null;
  pdfName?: string | null;
};

export function getSubmissionPdfHref(submission: SubmissionPdfLinkInput) {
  if (!submission.pdfName && !submission.pdfUrl) return null;
  return `/api/submissions/${submission.id}/pdf`;
}
