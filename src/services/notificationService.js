import { supabase } from '@/services/supabaseClient';
import { SERVICE_ERROR_MESSAGES } from '@/core/constants/errorMessages';
import { createServiceError } from '@/core/services/errorMessageService';

export async function getMyNotifications(limit = null) {
  const { data, error } = await supabase.rpc('get_my_notifications', {
    p_limit: limit,
  });

  if (error) {
    throw createServiceError(error, SERVICE_ERROR_MESSAGES.notifications.list);
  }
  return data ?? [];
}

export async function markNotificationRead(notificationId) {
  const { error } = await supabase.rpc('mark_notification_read', {
    p_id_notification: Number(notificationId),
  });

  if (error) {
    throw createServiceError(
      error,
      SERVICE_ERROR_MESSAGES.notifications.markRead
    );
  }
}

export async function markAllNotificationsRead() {
  const { error } = await supabase.rpc('mark_all_notifications_read');
  if (error) {
    throw createServiceError(
      error,
      SERVICE_ERROR_MESSAGES.notifications.markAllRead
    );
  }
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
