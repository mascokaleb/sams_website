import imageUrlBuilder from '@sanity/image-url';
import { Button, Card, Flex, Stack, Text } from '@sanity/ui';
import { useCallback, useMemo } from 'react';
import { ObjectInputProps, Path, set, unset, useClient, useFormValue } from 'sanity';

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

export function FocalPointInput(props: ObjectInputProps<FocalPointValue>) {
  const { onChange, readOnly, schemaType, value } = props;
  const imagePath = props.path.slice(0, -1) as Path;
  const imageValue = useFormValue(imagePath) as ImageFieldValue | undefined;
  const client = useClient({ apiVersion: '2024-01-01' });

  const previewUrl = useMemo(() => {
    if (!imageValue?.asset?._ref) {
      return null;
    }

    return imageUrlBuilder(client).image(imageValue).width(1200).fit('max').auto('format').url();
  }, [client, imageValue]);

  const displayPoint = useMemo(() => {
    if (isPoint(value)) {
      return { x: clamp(value.x), y: clamp(value.y) };
    }

    if (isPoint(imageValue?.hotspot)) {
      return {
        x: clamp(imageValue.hotspot.x),
        y: clamp(imageValue.hotspot.y),
      };
    }

    return DEFAULT_POINT;
  }, [imageValue?.hotspot, value]);

  const setPoint = useCallback(
    (x: number, y: number) => {
      onChange(
        set({
          _type: schemaType.name,
          x: clamp(x),
          y: clamp(y),
        })
      );
    },
    [onChange, schemaType.name]
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
    <Stack space={3}>
      <Text muted size={1}>
        Click the image to place a single center point for how this image should crop on the site.
      </Text>

      {!previewUrl ? (
        <Card border padding={3} radius={2} tone="transparent">
          <Text muted size={1}>
            Upload an image first to place the center point.
          </Text>
        </Card>
      ) : (
        <Card border padding={2} radius={2} tone="transparent">
          <Flex justify="center">
            <button
              aria-label="Set image center point"
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
                alt={imageValue?.alt || ''}
                src={previewUrl}
                style={{
                  display: 'block',
                  height: 'auto',
                  maxHeight: '420px',
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
        </Card>
      )}

      <Flex align="center" gap={2} wrap="wrap">
        <Text muted size={1}>
          Center point: {centerText}
        </Text>
        <Button
          mode="ghost"
          onClick={() => setPoint(DEFAULT_POINT.x, DEFAULT_POINT.y)}
          text="Center"
          disabled={!previewUrl || readOnly}
        />
        <Button
          mode="bleed"
          onClick={() => onChange(unset())}
          text="Use Default"
          disabled={!value || readOnly}
        />
      </Flex>
    </Stack>
  );
}
