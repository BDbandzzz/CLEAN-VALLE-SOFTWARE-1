import { supabase } from '@/services/supabaseClient';

export async function getMyNotifications(limit = null) {
  const { data, error } = await supabase.rpc('get_my_notifications', {
    p_limit: limit,
  });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function markNotificationRead(notificationId) {
  const { error } = await supabase.rpc('mark_notification_read', {
    p_id_notification: Number(notificationId),
  });

  if (error) throw new Error(error.message);
}

export async function markAllNotificationsRead() {
  const { error } = await supabase.rpc('mark_all_notifications_read');
  if (error) throw new Error(error.message);
}

export function subscribeToNotifications(authId, onNotification) {
  if (!authId) return () => {};

  const channel = supabase
    .channel(`notifications:${authId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'user_notifications',
        filter: `auth_id=eq.${authId}`,
      },
      onNotification
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
