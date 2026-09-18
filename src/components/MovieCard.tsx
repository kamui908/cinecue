import React from 'react';
import { Box, Text, HStack, VStack, Pressable, Image } from './ui/gluestack';
import { Link } from 'expo-router';
import { Images } from '../api/tmdb';
import { Movie } from '../types/tmdb';
import { formatYear, formatRating, getRatingBgColor, getRatingColor } from '../utils/format';
import { Icons } from './Icons';

interface Props {
  movie: Movie;
  variant?: 'poster' | 'backdrop' | 'compact';
}

export function MovieCard({ movie, variant = 'poster' }: Props) {
  if (variant === 'backdrop') {
    return (
      <Link href={`/movie/${movie.id}`} asChild>
        <Pressable>
          <Box className="w-[300px] h-[170px] rounded-2xl overflow-hidden bg-background-800 mr-3">
            {movie.backdrop_path ? (
              <Image
                source={{ uri: Images.backdrop(movie.backdrop_path, 'w780') }}
                className="w-full h-full"
                resizeMode="cover"
                alt="Backdrop"
              />
            ) : (
              <Box className="w-full h-full bg-background-700 items-center justify-center">
                <Text className="text-typography-400 text-sm">No Image</Text>
              </Box>
            )}
            <Box className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <Box className="absolute bottom-0 left-0 right-0 p-3">
              <Text className="text-typography-50 text-sm font-bold" numberOfLines={1}>
                {movie.title}
              </Text>
              <HStack className="items-center gap-2 mt-1">
                <Text className="text-typography-400 text-xs">{formatYear(movie.release_date)}</Text>
                <HStack className="items-center gap-1">
                  <Icons.Star size={12} className="text-warning-500" />
                  <Text className="text-typography-50 text-xs font-semibold">
                    {formatRating(movie.vote_average)}
                  </Text>
                </HStack>
              </HStack>
            </Box>
          </Box>
        </Pressable>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={`/movie/${movie.id}`} asChild>
        <Pressable>
          <HStack className="items-center gap-3 p-2 rounded-xl bg-background-800/50">
            {movie.poster_path ? (
              <Image
                source={{ uri: Images.poster(movie.poster_path, 'w92') }}
                className="w-12 h-18 rounded-lg"
                resizeMode="cover"
                alt="Poster"
              />
            ) : (
              <Box className="w-12 h-18 rounded-lg bg-background-700 items-center justify-center">
                <Text className="text-typography-400 text-[10px]">No</Text>
              </Box>
            )}
            <VStack className="flex-1">
              <Text className="text-typography-50 text-sm font-semibold" numberOfLines={1}>
                {movie.title}
              </Text>
              <Text className="text-typography-400 text-xs mt-0.5">
                {formatYear(movie.release_date)}
              </Text>
            </VStack>
            <Box className={`px-2 py-1 rounded-full ${getRatingBgColor(movie.vote_average)}`}>
              <Text className={`text-xs font-bold ${getRatingColor(movie.vote_average)}`}>
                {formatRating(movie.vote_average)}
              </Text>
            </Box>
          </HStack>
        </Pressable>
      </Link>
    );
  }

  return (
    <Link href={`/movie/${movie.id}`} asChild>
      <Pressable>
        <Box className="w-[140px] mr-3">
          <Box className="w-[140px] h-[210px] rounded-xl overflow-hidden bg-background-800">
            {movie.poster_path ? (
              <Image
                source={{ uri: Images.poster(movie.poster_path, 'w342') }}
                className="w-full h-full"
                resizeMode="cover"
                alt="Poster"
              />
            ) : (
              <Box className="w-full h-full bg-background-700 items-center justify-center">
                <Text className="text-typography-400 text-xs">No Image</Text>
              </Box>
            )}
            <Box className="absolute top-2 right-2">
              <HStack className="items-center gap-1 px-1.5 py-0.5 rounded-full bg-background-900/80">
                <Icons.Star size={10} className={getRatingColor(movie.vote_average)} />
                <Text className={`text-[10px] font-bold ${getRatingColor(movie.vote_average)}`}>
                  {formatRating(movie.vote_average)}
                </Text>
              </HStack>
            </Box>
          </Box>
          <Text className="text-typography-50 text-xs font-semibold mt-2" numberOfLines={1}>
            {movie.title}
          </Text>
          <Text className="text-typography-400 text-[11px] mt-0.5">
            {formatYear(movie.release_date)}
          </Text>
        </Box>
      </Pressable>
    </Link>
  );
}
