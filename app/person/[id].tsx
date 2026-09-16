import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { usePersonDetail } from '../../src/hooks/useTMDB';
import { Images } from '../../src/api/tmdb';
import { MovieCard } from '../../src/components/MovieCard';
import { TVCard } from '../../src/components/TVCard';
import { Section, HorizontalList, LoadingSpinner } from '../../src/components/UI';
import { formatDate, formatNumber } from '../../src/utils/format';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MovieCast, TVCast } from '../../src/types/tmdb';

export default function PersonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const personId = Number(id);
  const { data: person, isLoading } = usePersonDetail(personId);
  const insets = useSafeAreaInsets();

  if (isLoading) return <LoadingSpinner />;
  if (!person) return null;

  const movieCredits = person.combined_credits.cast
    .filter((c): c is MovieCast => 'title' in c && 'character' in c)
    .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
    .slice(0, 15);

  const tvCredits = person.combined_credits.cast
    .filter((c): c is TVCast => 'name' in c && 'character' in c && !('title' in c))
    .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
    .slice(0, 15);

  const crewCredits = person.combined_credits.crew
    .filter(c => c.department === 'Directing' || c.department === 'Writing')
    .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
    .slice(0, 10);

  return (
    <ScrollView
      className="flex-1 bg-dark-950"
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-12 left-4 z-10 bg-dark-900/80 rounded-full p-2"
      >
        <Text className="text-white text-lg">←</Text>
      </TouchableOpacity>

      {/* Profile Image + Info */}
      <View className="items-center px-4 pt-16 pb-6">
        <View className="w-36 h-36 rounded-full overflow-hidden bg-dark-800 mb-4">
          {person.profile_path ? (
            <Image
              source={{ uri: Images.profile(person.profile_path, 'h632') }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full bg-dark-700 items-center justify-center">
              <Text className="text-dark-400 text-4xl font-bold">
                {person.name.charAt(0)}
              </Text>
            </View>
          )}
        </View>
        <Text className="text-white text-2xl font-bold text-center">{person.name}</Text>
        <Text className="text-dark-400 text-sm mt-1">{person.known_for_department}</Text>

        {/* Stats */}
        <View className="flex-row mt-4 bg-dark-800 rounded-2xl px-6 py-3">
          <View className="items-center mx-4">
            <Text className="text-white text-lg font-bold">★ {formatNumber(person.popularity)}</Text>
            <Text className="text-dark-400 text-[10px]">Popularity</Text>
          </View>
          {person.birthday && (
            <View className="items-center mx-4">
              <Text className="text-white text-sm font-semibold">{formatDate(person.birthday, 'MMM D, YYYY')}</Text>
              <Text className="text-dark-400 text-[10px]">Born</Text>
            </View>
          )}
          {person.deathday && (
            <View className="items-center mx-4">
              <Text className="text-white text-sm font-semibold">{formatDate(person.deathday, 'MMM D, YYYY')}</Text>
              <Text className="text-dark-400 text-[10px]">Died</Text>
            </View>
          )}
        </View>
      </View>

      {/* Biography */}
      {person.biography ? (
        <View className="px-4 mb-6">
          <Text className="text-white text-base font-bold mb-2">Biography</Text>
          <Text className="text-dark-300 text-sm leading-5">{person.biography}</Text>
        </View>
      ) : null}

      {/* Place of Birth */}
      {person.place_of_birth && (
        <View className="px-4 mb-6">
          <Text className="text-white text-sm font-semibold">📍 {person.place_of_birth}</Text>
        </View>
      )}

      {/* Also Known As */}
      {person.also_known_as.length > 0 && (
        <View className="px-4 mb-6">
          <Text className="text-white text-sm font-bold mb-2">Also Known As</Text>
          <View className="flex-row flex-wrap gap-2">
            {person.also_known_as.map((name, i) => (
              <View key={i} className="bg-dark-800 rounded-full px-3 py-1">
                <Text className="text-dark-300 text-xs">{name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Acting Credits */}
      {movieCredits.length > 0 && (
        <Section title="Acting" subtitle={`${movieCredits.length} movies`}>
          <HorizontalList>
            {movieCredits.map((credit) => (
              <MovieCard
                key={credit.id}
                movie={{
                  id: credit.id,
                  title: (credit as any).title,
                  original_title: (credit as any).title,
                  overview: '',
                  poster_path: credit.poster_path,
                  backdrop_path: null,
                  release_date: (credit as any).release_date || '',
                  vote_average: credit.vote_average,
                  vote_count: 0,
                  genre_ids: credit.genre_ids || [],
                  popularity: 0,
                  adult: false,
                  original_language: 'en',
                }}
                variant="backdrop"
              />
            ))}
          </HorizontalList>
        </Section>
      )}

      {/* TV Credits */}
      {tvCredits.length > 0 && (
        <Section title="TV Appearances" subtitle={`${tvCredits.length} shows`}>
          <HorizontalList>
            {tvCredits.map((credit) => (
              <TVCard
                key={credit.id}
                show={{
                  id: credit.id,
                  name: (credit as any).name,
                  original_name: (credit as any).name,
                  overview: '',
                  poster_path: credit.poster_path,
                  backdrop_path: null,
                  first_air_date: (credit as any).first_air_date || '',
                  vote_average: credit.vote_average,
                  vote_count: 0,
                  genre_ids: credit.genre_ids || [],
                  popularity: 0,
                  original_language: 'en',
                }}
                variant="backdrop"
              />
            ))}
          </HorizontalList>
        </Section>
      )}

      {/* Crew Credits */}
      {crewCredits.length > 0 && (
        <Section title="Crew" subtitle="Behind the camera">
          <HorizontalList>
            {crewCredits.map((credit, i) => (
              <View key={`${credit.id}-${i}`} className="w-[200px] mr-3 bg-dark-800 rounded-xl p-3">
                <Text className="text-white text-sm font-semibold" numberOfLines={1}>
                  {(credit as any).title || (credit as any).name}
                </Text>
                <Text className="text-primary-400 text-xs mt-1">{credit.job}</Text>
                <View className="flex-row items-center mt-2">
                  <Text className="text-accent-gold text-xs">★</Text>
                  <Text className="text-white text-xs ml-1">{credit.vote_average.toFixed(1)}</Text>
                </View>
              </View>
            ))}
          </HorizontalList>
        </Section>
      )}
    </ScrollView>
  );
}
