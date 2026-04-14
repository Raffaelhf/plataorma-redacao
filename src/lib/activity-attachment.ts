type ActivityAttachmentLinkInput = {
  id: string;
  attachments?: Array<{ id: string }>;
};

export function getActivityAttachmentHref(activity: ActivityAttachmentLinkInput) {
  if (!activity.attachments?.length) return null;
  return `/api/activities/${activity.id}/attachment`;
}
