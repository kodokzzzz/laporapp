import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ notifications }) {
    return (
        <AuthenticatedLayout header="Notifikasi Anda">
            <Head title="Notifikasi Anda" />
            <div className="page-container">
                <div className="page-header">
                    <h2 className="page-header-title">Pemberitahuan Sistem</h2>
                </div>
                <div className="card">
                    <div className="card-body">
                        {notifications?.length > 0 ? (
                            <ul className="space-y-4">
                                {notifications.map(notif => (
                                    <li key={notif.id} className={`p-4 rounded-md border ${notif.read_at ? 'bg-gray-50 border-gray-200' : 'bg-primary-50 border-primary-200'}`}>
                                        <h4 className="font-bold text-gray-800">{notif.title}</h4>
                                        <p className="text-gray-600 text-sm">{notif.message}</p>
                                        <span className="text-xs text-gray-400 mt-2 block">{new Date(notif.created_at).toLocaleString()}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-center py-8">Anda tidak memiliki notifikasi baru.</p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
