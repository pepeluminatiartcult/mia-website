import { ImageResponse } from 'next/og';
import { getExchangeById } from '@/lib/queries';

export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const exchange = await getExchangeById(id);

  if (!exchange) {
    return new Response('Not found', { status: 404 });
  }

  const questionExcerpt =
    exchange.question_text.length > 180
      ? exchange.question_text.slice(0, 180) + '...'
      : exchange.question_text;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#000',
          color: '#fff',
          padding: '60px',
          fontFamily: 'monospace',
        }}
      >
        {/* Top: ID + Domain */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 28, color: '#4a7c6f', fontWeight: 700 }}>
            {exchange.id}
          </div>
          <div style={{ fontSize: 18, color: '#999' }}>
            {exchange.domain_code} — {exchange.domain_name}
          </div>
        </div>

        {/* Middle: Question */}
        <div
          style={{
            fontSize: 32,
            lineHeight: 1.4,
            color: '#fff',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            paddingTop: 40,
            paddingBottom: 40,
          }}
        >
          {questionExcerpt}
        </div>

        {/* Bottom: Model + Branding */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 18, color: '#999' }}>
              {exchange.model_name} — {exchange.token_count.toLocaleString()} tokens
            </div>
            <div style={{ fontSize: 14, color: '#666' }}>
              {new Date(exchange.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>MIA</div>
            <div style={{ fontSize: 12, color: '#666' }}>by PAC CORP</div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
