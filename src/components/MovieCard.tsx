import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Images } from '../api/tmdb';
import { Movie } from '../types/tmdb';
import { formatYear, formatRating, getRatingBgColor, getRatingColor } from '../utils/format';

interface Props {
  movie: Movie;
  variant?: 'poster' | 'backdrop' | 'compact';
}

export function MovieCard({ movie, variant = 'poster' }: Props) {
  if (variant === 'backdrop') {
    return (
      <Link href={`/movie/${movie.id}`} asChild>
        <TouchableOpacity activeOpacity={0.7}>
          <View className="w-[300px] h-[170px] rounded-2xl overflow-hidden bg-dark-800">
            {movie.backdrop_path ? (
              <Image
                source={{ uri: Images.backdrop(movie.backdrop_path, 'w780') }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full bg-dark-700 items-center justify-center">
                <Text className="text-dark-400 text-sm">No Image</Text>
              </View>
            )}
            <View className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <View className="absolute bottom-0 left-0 right-0 p-3">
              <Text className="text-white text-sm font-bold" numberOfLines={1}>
                {movie.title}
              </Text>
              <View className="flex-row items-center gap-2 mt-1">
                <Text className="text-dark-300 text-xs">{formatYear(movie.release_date)}</Text>
                <View className="flex-row items-center gap-1">
                  <Text className="text-accent-gold text-xs">★</Text>
                  <Text className="text-white text-xs font-semibold">
                    {formatRating(movie.vote_average)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={`/movie/${movie.id}`} asChild>
        <TouchableOpacity activeOpacity={0.7}>
          <View className="flex-row items-center gap-3 p-2 rounded-xl bg-dark-800/50">
            {movie.poster_path ? (
              <Image
                source={{ uri: Images.poster(movie.poster_path, 'w92') }}
                className="w-12 h-18 rounded-lg"
                resizeMode="cover"
              />
            ) : (
              <View className="w-12 h-18 rounded-lg bg-dark-700 items-center justify-center">
                <Text className="text-dark-400 text-[10px]">No</Text>
              </View>
            )}
            <View className="flex-1">
              <Text className="text-white text-sm font-semibold" numberOfLines={1}>
                {movie.title}
              </Text>
              <Text className="text-dark-400 text-xs mt-0.5">
                {formatYear(movie.release_date)}
              </Text>
            </View>
            <View className={`px-2 py-1 rounded-full ${getRatingBgColor(movie.vote_average)}`}>
              <Text className={`text-xs font-bold ${getRatingColor(movie.vote_average)}`}>
                {formatRating(movie.vote_average)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    );
  }

  return (
    <Link href={`/movie/${movie.id}`} asChild>
      <TouchableOpacity activeOpacity={0.7}>
        <View className="w-[140px] mr-3">
          <View className="w-[140px] h-[210px] rounded-xl overflow-hidden bg-dark-800">
            {movie.poster_path ? (
              <Image
                source={{ uri: Images.poster(movie.poster_path, 'w342') }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full bg-dark-700 items-center justify-center">
                <Text className="text-dark-400 text-xs">No Image</Text>
              </View>
            )}
            <View className="absolute top-2 right-2">
              <View className={`px-1.5 py-0.5 rounded-full ${getRatingBgColor(movie.vote_average)}`}>
                <Text className={`text-[10px] font-bold ${getRatingColor(movie.vote_average)}`}>
                  ★ {formatRating(movie.vote_average)}
                </Text>
              </View>
            </View>
          </View>
          <Text className="text-white text-xs font-semibold mt-2" numberOfLines={1}>
            {movie.title}
          </Text>
          <Text className="text-dark-400 text-[11px] mt-0.5">
            {formatYear(movie.release_date)}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
}
