import React from 'react';
import { Linking, Platform } from 'react-native';
import { Box, Image, Pressable } from './ui/gluestack';
import { Images } from '../api/tmdb';

interface Props {
  backdropPath: string | null;
  trailerKey: string | null;
  title: string;
  /** When true (and on web with a trailer), the trailer autoplays in this slot. */
  autoplay: boolean;
}

/**
 * Detail-page backdrop slot. Shows the autoplaying trailer embed when enabled,
 * otherwise the backdrop still (tapping it opens the trailer on YouTube).
 *
 * Autoplay embed is web-only: browsers allow muted autoplay, and an inline
 * iframe needs no native modules. Native keeps the backdrop still.
 */
export function TrailerBackdrop({ backdropPath, trailerKey, title, autoplay }: Props) {
  if (autoplay && trailerKey && Platform.OS === 'web') {
    return (
      <Box className="w-full h-full bg-black">
        {React.createElement('iframe', {
          src: `https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&rel=0&playsinline=1`,
          title: `${title} trailer`,
          allow: 'autoplay; encrypted-media; picture-in-picture',
          allowFullScreen: true,
          style: { width: '100%', height: '100%', border: 0 },
        })}
      </Box>
    );
  }

  if (!backdropPath) {
    return <Box className="w-full h-full bg-background-800" />;
  }

  const still = (
    <Image
      source={{ uri: Images.backdrop(backdropPath, 'original') }}
      className="w-full h-full"
      resizeMode="cover"
      alt="Backdrop"
    />
  );

  if (!trailerKey) return still;

  return (
    <Pressable
      onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${trailerKey}`)}
      className="w-full h-full"
      accessibilityRole="button"
      accessibilityLabel="Play trailer"
    >
      {still}
    </Pressable>
  );
}
