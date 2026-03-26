import React from 'react';
import { ImageResponse } from '@vercel/og';

const SITE_NAME = 'David Kozak';
const SITE_DOMAIN = 'dk.david-kozak.com';
const DEFAULT_TITLE = 'AI studio a digitalni produkty';
const DEFAULT_DESCRIPTION = 'Vyvoj, kreativni automatizace a digitalni produkty pod brandem David Kozak.';
const BRAND_GRADIENT = 'linear-gradient(135deg, #020617 0%, #0f172a 42%, #155e75 100%)';

const clampText = (value: string | null, fallback: string, maxLength: number): string => {
  const normalized = typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';

  if (!normalized) {
    return fallback;
  }

  return normalized.slice(0, maxLength);
};

export const createSocialImage = (request: Request, variant: 'og' | 'twitter') => {
  const { searchParams } = new URL(request.url);
  const title = clampText(searchParams.get('title'), DEFAULT_TITLE, 60);
  const description = clampText(searchParams.get('description'), DEFAULT_DESCRIPTION, 140);
  const badge = variant === 'twitter' ? 'TWITTER CARD' : 'OPEN GRAPH';
  const accentColor = variant === 'twitter' ? '#10b981' : '#06b6d4';
  const width = 1200;
  const height = variant === 'twitter' ? 675 : 630;

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          background: BRAND_GRADIENT,
          color: '#f8fafc',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-20%',
            bottom: '-20%',
            left: '-20%',
            background:
              'radial-gradient(circle at top left, rgba(14,165,233,0.32), transparent 42%), radial-gradient(circle at bottom right, rgba(16,185,129,0.3), transparent 36%)',
          }}
        />
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '56px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '68px',
                  height: '68px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
                  color: '#020617',
                  fontSize: '32px',
                  fontWeight: 800,
                }}
              >
                DK
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginLeft: '18px',
                }}
              >
                <div
                  style={{
                    fontSize: '18px',
                    letterSpacing: '0.28em',
                    color: '#67e8f9',
                    marginBottom: '4px',
                  }}
                >
                  {badge}
                </div>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 700,
                  }}
                >
                  {SITE_NAME}
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                padding: '12px 18px',
                borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.16)',
                backgroundColor: 'rgba(15,23,42,0.45)',
                fontSize: '20px',
                color: '#cbd5e1',
              }}
            >
              {SITE_DOMAIN}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              maxWidth: '920px',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: '22px',
                letterSpacing: '0.22em',
                color: accentColor,
                marginBottom: '22px',
              }}
            >
              DK SERVICES
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '78px',
                lineHeight: 1.02,
                fontWeight: 800,
                marginBottom: '22px',
              }}
            >
              {title}
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '30px',
                lineHeight: 1.4,
                color: '#cbd5e1',
                maxWidth: '840px',
              }}
            >
              {description}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            <div
              style={{
                display: 'flex',
              }}
            >
              {['AI studio', 'SEO-ready', 'Vercel'].map((item, index) => (
                <div
                  key={item}
                  style={{
                    display: 'flex',
                    padding: '12px 18px',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    fontSize: '20px',
                    color: '#e2e8f0',
                    marginRight: index === 2 ? '0' : '12px',
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  width: '160px',
                  height: '8px',
                  borderRadius: '999px',
                  background: 'linear-gradient(90deg, #06b6d4 0%, #10b981 100%)',
                  marginBottom: '10px',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  fontSize: '18px',
                  color: '#94a3b8',
                  letterSpacing: '0.18em',
                }}
              >
                {SITE_DOMAIN}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width,
      height,
    },
  );
};
