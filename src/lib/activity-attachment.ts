type ActivityAttachmentLinkInput = {
  id: string;
  attachmentUrl?: string | null;
  attachmentName?: string | null;
};

export function getActivityAttachmentHref(activity: ActivityAttachmentLinkInput) {
  if (!activity.attachmentName && !activity.attachmentUrl) return null;
  return `/api/activities/${activity.id}/attachment`;
}
