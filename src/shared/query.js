// URL param okuma ve varsayılanlar
export function getParams(route = window.location) {
    const q = new URLSearchParams(route.search || '');
    return {
        bg: q.get('bg') || 'transparent',
        fg: q.get('fg') || '#111827',
        radius: Number(q.get('radius')) || 12,
        size: q.get('size') || '16px',
        theme: q.get('theme') || 'auto',
        tz: q.get('tz') || undefined,
        work: Number(q.get('work')) || 25,
        break: Number(q.get('break')) || 5,
        value: Number(q.get('value')) || 50,
        label: q.get('label') || 'Progress',
    };
}
