import type {
  SubscriberArgs,
  SubscriberConfig,
} from "@medusajs/framework"

export default async function productCreateHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const query = container.resolve("query");

  const {
    data: [store],
  } = await query.graph({
    entity: "store",
    fields: ["name"],
  });

  const {
    data: [invite],
  } = await query.graph({
    entity: "invite",
    fields: ["email", "token"],
    filters: {
      id: data.id,
    },
  });

  const config = container.resolve("configModule");

  const adminPath = config.admin.path;

  const inviteUrl = `/${adminPath}/invite?token=${invite.token}`;

  const notificationModule = container.resolve("notification");

  await notificationModule.createNotifications({
    to: invite.email,
    template: "medusa-cloud-invite-user",
    channel: "email",
    data: {
      inviteUrl,
    },
    content: {
      subject: `You've been invited to join ${store.name}`,
    },
  });
}

export const config: SubscriberConfig = {
  event: "invite.created",
}