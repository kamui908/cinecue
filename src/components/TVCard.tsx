import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Box, Text, HStack, VStack, Pressable, Image } from './ui/gluestack';
import { Link } from 'expo-router';
import { Images } from '../api/tmdb';
import { TVShow } from '../types/tmdb';
import { formatYear, formatRating, getRatingBgColor, getRatingColor } from '../utils/format';
import { Icons } from './Icons';

interface Props {
  show: TVShow;
  variant?: 'poster' | 'backdrop' | 'compact';
}

export function TVCard({ show, variant = 'poster' }: Props) {
  if (variant === 'backdrop') {
    return (
      <Link href={`/tv/${show.id}`} asChild>
        <Pressable>
          <Box className="w-[300px] h-[170px] rounded-2xl overflow-hidden bg-background-800 mr-3">
            {show.backdrop_path ? (
              <Image
                source={{ uri: Images.backdrop(show.backdrop_path, 'w780') }}
                className="w-full h-full"
                resizeMode="cover"
                alt="Backdrop"
              />
            ) : (
              <Box className="w-full h-full bg-background-700 items-center justify-center">
                <Text className="text-typography-400 text-[16px]">No Image</Text>
              </Box>
            )}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.85)']}
              locations={[0.2, 1]}
              style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 120 }}
            />
            <Box className="absolute bottom-0 left-0 right-0 p-3">
              <Text className="text-white text-[16px] font-bold" numberOfLines={1}>
                {show.name}
              </Text>
              <HStack className="items-center gap-2 mt-1">
                <Text className="text-white/70 text-[16px]">{formatYear(show.first_air_date)}</Text>
                <HStack className="items-center gap-1">
                  <Icons.Star size={12} className="text-warning-500" />
                  <Text className="text-white text-[16px] font-semibold">
                    {formatRating(show.vote_average)}
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
      <Link href={`/tv/${show.id}`} asChild>
        <Pressable>
          <HStack className="items-center gap-3 p-2 rounded-xl bg-background-800/50">
            {show.poster_path ? (
              <Image
                source={{ uri: Images.poster(show.poster_path, 'w92') }}
                className="w-12 h-[72px] rounded-lg"
                resizeMode="cover"
                alt="Poster"
              />
            ) : (
              <Box className="w-12 h-[72px] rounded-lg bg-background-700 items-center justify-center">
                <Text className="text-typography-400 text-[16px]">No</Text>
              </Box>
            )}
            <VStack className="flex-1">
              <Text className="text-typography-50 text-[16px] font-semibold" numberOfLines={1}>
                {show.name}
              </Text>
              <Text className="text-typography-400 text-[16px] mt-0.5">
                {formatYear(show.first_air_date)}
              </Text>
            </VStack>
            <Box className={`px-2 py-1 rounded-full ${getRatingBgColor(show.vote_average)}`}>
              <Text className={`text-[16px] font-bold ${getRatingColor(show.vote_average)}`}>
                {formatRating(show.vote_average)}
              </Text>
            </Box>
          </HStack>
        </Pressable>
      </Link>
    );
  }

  return (
    <Link href={`/tv/${show.id}`} asChild>
      <Pressable>
        <Box className="w-[140px] mr-3">
          <Box className="w-[140px] h-[210px] rounded-xl overflow-hidden bg-background-800">
            {show.poster_path ? (
              <Image
                source={{ uri: Images.poster(show.poster_path, 'w342') }}
                className="w-full h-full"
                resizeMode="cover"
                alt="Poster"
              />
            ) : (
              <Box className="w-full h-full bg-background-700 items-center justify-center">
                <Text className="text-typography-400 text-[16px]">No Image</Text>
              </Box>
            )}
            <Box className="absolute top-2 right-2">
              <HStack className="items-center gap-1 px-1.5 py-0.5 rounded-full bg-background-900/80">
                <Icons.Star size={10} className={getRatingColor(show.vote_average)} />
                <Text className={`text-[16px] font-bold ${getRatingColor(show.vote_average)}`}>
                  {formatRating(show.vote_average)}
                </Text>
              </HStack>
            </Box>
          </Box>
          <Text className="text-typography-50 text-[16px] font-semibold mt-2" numberOfLines={1}>
            {show.name}
          </Text>
          <Text className="text-typography-400 text-[16px] mt-0.5">
            {formatYear(show.first_air_date)}
          </Text>
        </Box>
      </Pressable>
    </Link>
  );
}
