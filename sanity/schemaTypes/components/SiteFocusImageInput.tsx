import imageUrlBuilder from '@sanity/image-url';
import { Button, Card, Flex, Stack, Text } from '@sanity/ui';
import { useCallback, useMemo } from 'react';
import { ImageInputProps, PatchEvent, set, unset, useClient } from 'sanity';

type FocalPointValue = {
  _type?: string;
  x?: number;
  y?: number;
};

type ImageFieldValue = {
  asset?: {
    _ref?: string;
    _type?: string;
  };
  alt?: string;
  focalPoint?: FocalPointValue;
  hotspot?: {
    x?: number;
    y?: number;
  };
};

const DEFAULT_POINT = { x: 0.5, y: 0.5 };

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

function isPoint(value: unknown): value is { x: number; y: number } {
  return Boolean(
    value &&
      typeof value === 'object' &&
      typeof (value as { x?: unknown }).x === 'number' &&
      typeof (value as { y?: unknown }).y === 'number'
  );
}

export function SiteFocusImageInput(props: ImageInputProps) {
  const { onChange, readOnly, renderDefault } = props;
  const value = props.value as ImageFieldValue | undefined;
  const client = useClient({ apiVersion: '2024-01-01' });

  const previewUrl = useMemo(() => {
    if (!value?.asset?._ref) {
      return null;
    }

    return imageUrlBuilder(client).image(value).width(1200).fit('max').auto('format').url();
  }, [client, value]);

  const displayPoint = useMemo(() => {
    if (isPoint(value?.focalPoint)) {
      return { x: clamp(value.focalPoint.x), y: clamp(value.focalPoint.y) };
    }

    if (isPoint(value?.hotspot)) {
      return {
        x: clamp(value.hotspot.x),
        y: clamp(value.hotspot.y),
      };
    }

    return DEFAULT_POINT;
  }, [value]);

  const setPoint = useCallback(
    (x: number, y: number) => {
      onChange(
        PatchEvent.from([
          set(
            {
              _type: 'focalPoint',
              x: clamp(x),
              y: clamp(y),
            },
            ['focalPoint']
          ),
        ])
      );
    },
    [onChange]
  );

  const handleImageClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (readOnly) {
        return;
      }

      const rect = event.currentTarget.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        return;
      }

      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      setPoint(x, y);
    },
    [readOnly, setPoint]
  );

  const centerText = `${Math.round(displayPoint.x * 100)}% / ${Math.round(displayPoint.y * 100)}%`;

  return (
    <Stack space={4}>
      <Card border padding={3} radius={2} tone="transparent">
        <Stack space={3}>
          <Stack space={2}>
            <Text size={1} weight="semibold">
              Site Focus Point
            </Text>
            <Text muted size={1}>
              Click once to place the blue dot for how the site centers this image. Use the standard
              image menu below if you also want to crop the image.
            </Text>
          </Stack>

          {!previewUrl ? (
            <Card border padding={3} radius={2} tone="transparent">
              <Text muted size={1}>
                Upload an image first, then click the preview here to set the site focus point.
              </Text>
            </Card>
          ) : (
            <Flex justify="center">
              <button
                aria-label="Set site focus point"
                disabled={readOnly}
                onClick={handleImageClick}
                style={{
                  appearance: 'none',
                  background: 'none',
                  border: 'none',
                  cursor: readOnly ? 'default' : 'crosshair',
                  display: 'inline-block',
                  lineHeight: 0,
                  margin: 0,
                  maxWidth: '100%',
                  padding: 0,
                  position: 'relative',
                }}
                type="button"
              >
                <img
                  alt={value?.alt || ''}
                  src={previewUrl}
                  style={{
                    borderRadius: '8px',
                    display: 'block',
                    height: 'auto',
                    maxHeight: '320px',
                    maxWidth: '100%',
                  }}
                />
                <span
                  aria-hidden="true"
                  style={{
                    left: `${displayPoint.x * 100}%`,
                    pointerEvents: 'none',
                    position: 'absolute',
                    top: `${displayPoint.y * 100}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <span
                    style={{
                      background: '#1168ff',
                      border: '2px solid #ffffff',
                      borderRadius: '999px',
                      boxShadow: '0 0 0 4px rgba(17, 104, 255, 0.18)',
                      display: 'block',
                      height: '14px',
                      width: '14px',
                    }}
                  />
                </span>
              </button>
            </Flex>
          )}

          <Flex align="center" gap={2} wrap="wrap">
            <Text muted size={1}>
              Focus point: {centerText}
            </Text>
            <Button
              disabled={!previewUrl || readOnly}
              mode="ghost"
              onClick={() => setPoint(DEFAULT_POINT.x, DEFAULT_POINT.y)}
              text="Center"
            />
            <Button
              disabled={!value?.focalPoint || readOnly}
              mode="bleed"
              onClick={() => onChange(PatchEvent.from([unset(['focalPoint'])]))}
              text="Use Default"
            />
          </Flex>
        </Stack>
      </Card>

      {renderDefault(props)}
    </Stack>
  );
}
