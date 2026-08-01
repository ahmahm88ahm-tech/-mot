import { ImageResponse } from 'next/og';

export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon({ params }: { params?: { q?: string } }) {
  const maskable = params?.q === 'maskable';
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: maskable ? '#0d0c0a' : 'transparent' }}>
        <div style={{ width: maskable ? '80%' : '100%', height: maskable ? '80%' : '100%', background: '#0d0c0a', borderRadius: 96, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'sans-serif', fontWeight: 700, fontSize: 300, color: '#c9a24c' }}>م</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
// ملاحظة: إن لم يتوفّر next/og، استبدل بـ app/icon.png ثابت وضع الأيقونات في public/icons/
