/**
 * /admin — no dashboard yet, just route straight to the popups manager.
 */
import { redirect } from 'next/navigation';

export default function AdminIndexPage() {
  redirect('/admin/popups');
}
